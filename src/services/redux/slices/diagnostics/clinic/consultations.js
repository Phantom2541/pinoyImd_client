import { createSlice, createAsyncThunk } from "@reduxjs/toolkit";
import { axioKit } from "../../../../utilities";

const url = "diagnostics/clinic/consultations";

const initialState = {
  patient: {},
  branch: {},
  isSuccess: false,
  // main loading
  isLoading: false,
  // form loading
  message: "",
};

export const GET_PATIENT = createAsyncThunk(
  `${url}/getPatient`,
  ({ token, key }, thunkAPI) => {
    try {
      return axioKit.universal(`${url}/get_patient`, token, key);
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
      .addCase(GET_PATIENT.pending, (state) => {
        state.isLoading = true;
        state.isSuccess = false;
        state.message = "";
      })
      .addCase(GET_PATIENT.fulfilled, (state, { payload }) => {
        state.patient = payload;
        state.isSuccess = true;
        state.isLoading = false;
      })
      .addCase(GET_PATIENT.rejected, (state, action) => {
        const { error } = action;
        state.message = error.message;
        state.isLoading = false;
      });
  },
});

export const { RESET } = reduxSlice.actions;

export default reduxSlice.reducer;
