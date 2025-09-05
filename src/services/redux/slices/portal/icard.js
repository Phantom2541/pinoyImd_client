import { createSlice, createAsyncThunk } from "@reduxjs/toolkit";
import { axioKit, billingAddress, fullName, mobile } from "../../../utilities";
import { Policy } from "../../../fakeDb";

const url = "portal/ICard";

const initialState = {
  info: {},
  branch: {},
  isSuccess: false,
  // main loading
  isLoading: false,
  // form loading
  message: "",
};

export const BROWSE = createAsyncThunk(
  `${url}/browse`,
  ({ token, key }, thunkAPI) => {
    try {
      return axioKit.universal(`${url}/browse`, token, key);
    } catch (error) {
      const message =
        (error.response &&
          error.response.data &&
          error.response.data.message) ||
        error.message ||
        error.toString();

      return thunkAPI.rejectWithValue(message);
    }
  }
);

export const reduxSlice = createSlice({
  name: url,
  initialState,
  reducers: {
    RESET: (state) => {
      state.isSuccess = false;
      state.isLoading = false;
      state.message = "";
    },
  },
  extraReducers: (builder) => {
    builder
      .addCase(BROWSE.pending, (state) => {
        state.isLoading = true;
        state.isSuccess = false;
        state.message = "";
      })
      .addCase(BROWSE.fulfilled, (state, { payload }) => {
        const { branch, ...rest } = payload;
        const staff = rest;

        const Avatar = `/users/${staff.user.email}/profile.jpg`;
        const Signature = `/users/${staff.user.email}/signature.png`;
        const empName = `${staff.user.title || ""} ${fullName(
          staff.user.fullName,
          false,
          true
        )
          .toLowerCase()
          .replace(/\b\w/g, (c) => c.toUpperCase())}`;
        const guardian = fullName(staff.user?.guardian?.fullName, false, true);
        const position = Policy.getPositions(staff.contract?.designation),
          department = Policy.getDepartment(staff.contract?.designation);
        const pn = mobile(staff.user.mobile);

        state.info = {
          _id: staff._id,
          front: {
            empID: staff.id,
            img: Avatar,
            emp: empName,
            position,
            department,
          },
          back: {
            signature: Signature,
            dob: new Date(staff.user.dob)
              .toLocaleDateString("en-US", {
                month: "short",
                day: "numeric",
                year: "numeric",
              })
              .replace(" ", ", "),
            address: billingAddress(staff.user.address),
            guardian,
            pn,
            link: staff._id,
          },
          dfp: staff.dfp,
        };
        state.branch = branch;
        state.isLoading = false;
      })
      .addCase(BROWSE.rejected, (state, action) => {
        const { error } = action;
        state.message = error.message;
        state.isLoading = false;
      });
  },
});

export const { RESET } = reduxSlice.actions;

export default reduxSlice.reducer;
