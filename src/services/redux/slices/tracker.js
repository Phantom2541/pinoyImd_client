import { createSlice, createAsyncThunk } from "@reduxjs/toolkit";
import { axioKit } from "../../utilities";

const url = "Tracker";

const initialState = {
  tracker: {},
  isSuccess: false,
  isLoading: false,
};

export const BROWSE = createAsyncThunk(
  `${url}`,
  async ({ token, params }, thunkAPI) => {
    try {
      const response = await axioKit.universal(`${url}/browse`, token, params);
      return { payload: response, query: params }; // ensure query is included
    } catch (error) {
      const message =
        error.response?.data?.message || error.message || error.toString();
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
      .addCase(BROWSE.fulfilled, (state, action) => {
        state.tracker = action.payload;
        state.isLoading = false;
      })

      .addCase(BROWSE.rejected, (state, action) => {
        state.message = action.error.message;
        state.isLoading = false;
      });
  },
});

export const {
  RESET,
  UPDATEACCESS,
  SetSELECTED,
  SetCREDENTIAL,
  SetREQUIREMENTS,
  ToggleAccessModal,
  ToggleViewCredential,
  SetFilteredApplicants,
  SetMaxPage,
  setActivePage,
} = reduxSlice.actions;

export default reduxSlice.reducer;
