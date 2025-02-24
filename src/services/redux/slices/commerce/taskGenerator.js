import { createSlice, createAsyncThunk } from "@reduxjs/toolkit";
import { axioKit } from "../../../utilities";

const name = "commerce/sales";

const initialState = {
  collections: [],
  _id: "default",
  source: "",
  physician: "",
  transaction: { _id: "default" },
  isSuccess: false,
  isLoading: false,
  message: "",
};

export const BROWSE = createAsyncThunk(
  `${name}`,
  ({ token, key }, thunkAPI) => {
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
export const TASKS = createAsyncThunk(
  `${name}/tasks`,
  ({ token, key }, thunkAPI) => {
    try {
      return axioKit.universal(`${name}/tasks`, token, key);
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

export const TAGGING = createAsyncThunk(
  `${name}/tagging`,
  ({ key, token }, thunkAPI) => {
    try {
      return axioKit.universal(`${name}/tagging`, token, key);
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
export const REFORM = createAsyncThunk(
  `${name}/update`,
  ({ data, token }, thunkAPI) => {
    try {
      return axioKit.update(name, data, token);
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
export const SAVE = createAsyncThunk(
  `${name}/save`,
  ({ data, token }, thunkAPI) => {
    try {
      return axioKit.save(name, data, token);
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
  name,
  initialState,
  reducers: {
    SETSOURCE: (state, { payload }) => {
      state.source = payload.source;
      state._id = payload._id;
    },
    SETPHYSICIAN: (state, { payload }) => {
      state.physician = payload.physician;
      state._id = payload._id;
    },
    RESET: (state, { payload = {} }) => {
      state.isSuccess = false;
      state.message = "";

      if (payload?.resetCollections) state.collections = [];
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
        const { payload } = action.payload;
        state.collections = payload;
        state.isLoading = false;
      })
      .addCase(BROWSE.rejected, (state, action) => {
        const { error } = action;
        state.message = error.message;
        state.isLoading = false;
      })
      .addCase(TAGGING.pending, (state) => {
        // state.isLoading = true;
        // state.isSuccess = false;
        state.message = "";
      })
      .addCase(TAGGING.fulfilled, (state, action) => {
        const { payload } = action.payload;
        const index = state.collections.findIndex((c) => c._id === payload._id);

        state.collections[index] = payload;

        state.isLoading = false;
      })
      .addCase(TAGGING.rejected, (state, action) => {
        const { error } = action;
        state.message = error.message;
        state.isLoading = false;
      })
      .addCase(TASKS.pending, (state) => {
        state.isLoading = true;
        state.isSuccess = false;
        state.message = "";
      })
      .addCase(TASKS.fulfilled, (state, action) => {
        const { payload } = action.payload;
        state.collections = payload;
        state.isLoading = false;
      })
      .addCase(TASKS.rejected, (state, action) => {
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
        state.transaction = payload;
        state.isSuccess = true;
        state.isLoading = false;
      })
      .addCase(SAVE.rejected, (state, action) => {
        const { error } = action;
        state.message = error.message;
        state.isLoading = false;
      })
      .addCase(REFORM.pending, (state) => {
        state.isSuccess = false;
        state.message = "";
      })
      .addCase(REFORM.fulfilled, (state, action) => {
        console.log("action.payload", action.payload);
        
        const { success, payload } = action.payload;
        const index = state.collections.findIndex(
          (item) => item._id === payload._id
        );

        state.collections[index] = payload;
        state.message = success;
        state.isSuccess = true;
        state.isLoading = false;
      })
      .addCase(REFORM.rejected, (state, action) => {
        const { error } = action;
        state.message = error.message;
        state.isLoading = false;
      });
  },
});

export const { RESET, SETSOURCE, SETPHYSICIAN } = reduxSlice.actions;

export default reduxSlice.reducer;
