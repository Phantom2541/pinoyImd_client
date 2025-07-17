import { createSlice, createAsyncThunk } from "@reduxjs/toolkit";
import { axioKit } from "../../../../utilities";

const url = "assets/persons/users";

const initialState = {
  collections: [],
  filtered: [],
  isSuccess: false,
  isLoading: false,
  message: "",
};

export const BROWSE = createAsyncThunk(`${url}`, ({ key, token }, thunkAPI) => {
  try {
    return axioKit.universal(`${url}/browse`, token, key);
  } catch (error) {
    const message =
      (error.response && error.response.data && error.response.data.message) ||
      error.message ||
      error.toString();

    return thunkAPI.rejectWithValue(message);
  }
});

export const GETPATIENTS = createAsyncThunk(
  `${url}/patients`,
  ({ token, key }, thunkAPI) => {
    try {
      return axioKit.universal(`${url}/patients`, token, key);
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

export const REGISTER = createAsyncThunk(
  `${url}/register`,
  (form, thunkAPI) => {
    try {
      return axioKit.save(url, form);
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
export const VALIDATE_ID = createAsyncThunk(
  `${url}/validate_ID`,
  (form, thunkAPI) => {
    try {
      return axioKit.update(url, form.data, form.token, "validate_ID");
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
    CUSTOMALERT: (state, data) => {
      state.message = data.payload;
    },
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
        state.collections = payload.payload;
        // state.collectionsUsers = payload;
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
        state.filtered = payload;
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
        const { success, payload } = action?.payload;
        const index = state.collections.findIndex(
          (item) => item._id === payload._id
        );

        state.collections[index] = payload;
        state.message = success;
        state.isSuccess = true;
        state.isLoading = false;
      })
      .addCase(UPDATE.rejected, (state, action) => {
        console.log("action", action);

        const { error } = action;
        state.message = error;
        state.isLoading = false;
      })

      .addCase(VALIDATE_ID.pending, (state) => {
        state.isLoading = true;
        state.isSuccess = false;
        state.message = "";
      })
      .addCase(VALIDATE_ID.fulfilled, (state, action) => {
        const { success } = action.payload;
        state.message = success;
        state.isSuccess = true;
        state.isLoading = false;
      })
      .addCase(VALIDATE_ID.rejected, (state, action) => {
        const { error } = action;
        state.message = error.message;
        state.isLoading = false;
      })
      .addCase(REGISTER.pending, (state) => {
        state.isLoading = true;
        state.isSuccess = false;
        state.message = "";
      })
      .addCase(REGISTER.fulfilled, (state, action) => {
        const { success, payload } = action.payload;

        state.message = success;
        state.collections.unshift(payload);
        state.isSuccess = true;
        state.isLoading = false;
      })
      .addCase(REGISTER.rejected, (state, action) => {
        const { error } = action;
        state.message = error.message;
        state.isLoading = false;
      });
  },
});

export const { RESET, CUSTOMALERT } = reduxSlice.actions;

export default reduxSlice.reducer;
