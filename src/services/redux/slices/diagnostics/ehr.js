import { createSlice, createAsyncThunk } from "@reduxjs/toolkit";
import { axioKit } from "../../../utilities";

const url = "diagnostics/ehr";

const initialState = {
  patient: {},
  selected: {},
  showMedication: false,
  branch: {},
  isSuccess: false,
  isLoading: false,
  message: "",
};

export const FIND_EHR = createAsyncThunk(
  `${url}/find/ehr`,
  ({ token, key }, thunkAPI) => {
    try {
      return axioKit.universal(`${url}/find/ehr`, token, key);
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
    SetSELECTED: (state, { payload }) => {
      state.selected = payload;
    },
    SetMEDICATION: (state, { payload }) => {
      state.selected = payload;
      state.showModal = true;
    },
    TOGGLE_MEDICATION: (state) => {
      state.showMedication = !state.showMedication;
    },
    RESET: (state) => {
      state.isSuccess = false;
      state.isLoading = false;
      state.message = "";
    },
  },
  extraReducers: (builder) => {
    builder
      .addCase(FIND_EHR.pending, (state) => {
        state.isLoading = true;
        state.isSuccess = false;
        state.message = "";
      })
      .addCase(FIND_EHR.fulfilled, (state, { payload }) => {
        state.patient = payload;
        state.isSuccess = true;
        state.isLoading = false;
      })
      .addCase(FIND_EHR.rejected, (state, action) => {
        const { error } = action;
        state.message = error.message;
        state.isLoading = false;
      });
  },
});

export const { RESET, TOGGLE_MEDICATION, SetSELECTED, SetMEDICATION } =
  reduxSlice.actions;

export default reduxSlice.reducer;
