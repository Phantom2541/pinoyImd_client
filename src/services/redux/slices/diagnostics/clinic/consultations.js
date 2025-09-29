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
export const SAVE = createAsyncThunk(`${url}/save`, (form, thunkAPI) => {
  try {
    return axioKit.save(url, form.data, form.token);
  } catch (error) {
    const message =
      (error.response && error.response.data && error.response.data.message) ||
      error.message ||
      error.toString();

    return thunkAPI.rejectWithValue(message);
  }
});

export const UPDATE = createAsyncThunk(`${url}/update`, (form, thunkAPI) => {
  try {
    return axioKit.update(url, form.data, form.token);
  } catch (error) {
    const message =
      (error.response && error.response.data && error.response.data.message) ||
      error.message ||
      error.toString();

    return thunkAPI.rejectWithValue(message);
  }
});

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
      })
      .addCase(SAVE.pending, (state) => {
        state.formSubmitted = true;
        state.isSuccess = false;
        state.message = "";
      })
      .addCase(SAVE.fulfilled, (state, action) => {
        const { payload } = action.payload;
        state.collections.unshift(payload);
        state.filtered.unshift(payload);

        state.showModal = false;
        state.isSuccess = true;
        state.formSubmitted = false;
      })
      .addCase(SAVE.rejected, (state, action) => {
        const { error } = action;
        state.message = error.message;
        state.formSubmitted = false;
        state.isSuccess = false;
      })
      .addCase(UPDATE.pending, (state) => {
        state.isSuccess = false;
        state.formSubmitted = true;
        state.message = "";
      })
      .addCase(UPDATE.fulfilled, (state, action) => {
        // const updated = action.payload; // backend returns the updated appointment
        // const index = state.collections.findIndex(
        //   (item) => item._id === updated._id
        // );

        // if (index !== -1) {
        //   state.collections[index] = updated;
        // } else {
        //   state.collections.unshift(updated);
        // }

        // state.filtered = state.collections.filter(
        //   ({ sched }) => sched === state.activeSched
        // );
        state.showModal = false;
        state.formSubmitted = false;
        state.message = "Appointment updated successfully!";
        state.isSuccess = true;
      })

      .addCase(UPDATE.rejected, (state, action) => {
        const { error } = action;
        state.message = error.message;
        state.isSuccess = false;
        state.formSubmitted = false;
      });
  },
});

export const { RESET } = reduxSlice.actions;

export default reduxSlice.reducer;
