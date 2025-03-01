import { createSlice, createAsyncThunk } from "@reduxjs/toolkit";
import { axioKit } from "../../../../utilities";

const name = "assets/persons/users";

const initialState = {
  collections: [],
  isSuccess: false,
  isLoading: false,
  message: "",
};

export const BROWSE = createAsyncThunk(
  `${name}`,
  ({ key, token }, thunkAPI) => {
    try {
      return axioKit.universal(`${name}/browse`, token, key);
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

export const GETPATIENTS = createAsyncThunk(
  `${name}/patients`,
  ({ token, query }, thunkAPI) => {
    try {
      return axioKit.universal(`${name}/patients`, token, query);
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

export const SAVE = createAsyncThunk(`${name}/save`, (form, thunkAPI) => {
  try {
    return axioKit.save(name, form.data, form.token);
  } catch (error) {
    const message =
      (error.response && error.response.data && error.response.data.message) ||
      error.message ||
      error.toString();

    return thunkAPI.rejectWithValue(message);
  }
});

export const UPDATE = createAsyncThunk(`${name}/update`, (form, thunkAPI) => {
  try {
    return axioKit.update(name, form.data, form.token);
  } catch (error) {
    const message =
      (error.response && error.response.data && error.response.data.message) ||
      error.message ||
      error.toString();

    return thunkAPI.rejectWithValue(message);
  }
});

export const reduxSlice = createSlice({
  name,
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
      .addCase(BROWSE.fulfilled, (state, { payload, success }) => {
        console.log("payload", payload);
        state.collections = payload.payload;
        state.isLoading = false;
        state.message = success;
      })
      .addCase(BROWSE.rejected, (state, action) => {
        const { error } = action;
        state.message = error.message;
        state.isLoading = false;
      })

      .addCase(GETPATIENTS.pending, (state) => {
        state.isLoading = true;
        state.isSuccess = false;
        state.message = "";
      })
      .addCase(GETPATIENTS.fulfilled, (state, action) => {
        const { payload } = action.payload;
        //console.log('payload',payload);

        state.collections = payload;
        state.isLoading = false;
      })
      .addCase(GETPATIENTS.rejected, (state, action) => {
        const { error } = action;
        state.message = error.message;
        state.isLoading = false;
      })

      .addCase(SAVE.pending, (state) => {
        state.isLoading = true;
        state.isSuccess = false;
        state.message = "";
      })
      .addCase(SAVE.fulfilled, (state, action) => {
        const { success, payload } = action.payload;
        state.message = success;
        state.collections.unshift(payload);
        state.isSuccess = true;
        state.isLoading = false;
      })
      .addCase(SAVE.rejected, (state, action) => {
        const { error } = action;
        state.message = error.message;
        state.isLoading = false;
      })

      .addCase(UPDATE.pending, (state) => {
        state.isLoading = true;
        state.isSuccess = false;
        state.message = "";
      })
      .addCase(UPDATE.fulfilled, (state, action) => {
        const { success, payload } = action.payload;
        const index = state.collections.findIndex(
          (item) => item._id === payload._id
        );

        state.collections[index] = payload;
        state.message = success;
        state.isSuccess = true;
        state.isLoading = false;
      })
      .addCase(UPDATE.rejected, (state, action) => {
        const { error } = action;
        state.message = error.message;
        state.isLoading = false;
      });
  },
});

export const { RESET } = reduxSlice.actions;

export default reduxSlice.reducer;
