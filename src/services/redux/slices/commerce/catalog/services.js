import { createSlice, createAsyncThunk } from "@reduxjs/toolkit";
import { axioKit } from "../../../../utilities";

const name = "commerce/catalog/services";

const initialState = {
  collections: [],
  filtered: [],
  maxPage: 5,
  totalPages: 0,
  activePage: 1,
  isSuccess: false,
  isLoading: false,
  message: "",
};

/**
 * Asynchronous thunk action to browse items.
 *
 * @function BROWSE
 * @param {Object} payload - The payload object containing token and key.
 * @param {string} payload.token - The authentication token.
 * @param {string} payload.key - The key for browsing.
 * @param {Object} thunkAPI - The thunk API object.
 * @returns {Promise<Object>} The response data or an error message.
 */
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

export const GENERATE = createAsyncThunk(
  `${name}/generate`,
  ({ data, token }, thunkAPI) => {
    try {
      return axioKit.save(name, data, token, "generate");
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
    SetSERVICES: (state, { payload }) => {
      console.log("payload", payload);
      const { collections, maxPage } = payload;

      state.collections = collections;
      state.filtered = collections;
      state.maxPage = maxPage;

      if (collections.length > 0) {
        let totalPages = Math.floor(collections.length / maxPage);
        if (collections.length % maxPage > 0) totalPages += 1;
        state.totalPages = totalPages;

        if (state.activePage > totalPages) {
          state.activePage = totalPages;
        }
      }

      state.isSuccess = true;
    },
    SetByTEMPLATES: (state, { payload }) => {
      state.filtered = state.collections.filter(
        (item) => item.template === payload
      );

      const { filtered, maxPage } = state;
      state.totalPages = Math.ceil(filtered.length / maxPage) || 1;

      state.activePage = Math.min(state.activePage, state.totalPages);
    },
    SetMaxPage: (state, { payload }) => {
      state.maxPage = payload;
      state.activePage = 1;
    },
    SetActivePAGE: (state, { payload }) => {
      state.activePage = payload;
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
      .addCase(BROWSE.fulfilled, (state, action) => {
        const { payload, success } = action.payload;
        state.isSuccess = success;
        state.collections = payload;
        state.isLoading = false;
      })
      .addCase(BROWSE.rejected, (state, action) => {
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

      .addCase(GENERATE.pending, (state) => {
        state.isLoading = true;
        state.isSuccess = false;
        state.message = "";
      })
      .addCase(GENERATE.fulfilled, (state, action) => {
        const { success, payload } = action.payload;
        state.message = success;
        state.collections = payload;
        state.isSuccess = true;
        state.isLoading = false;
      })
      .addCase(GENERATE.rejected, (state, action) => {
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

export const { SetSERVICES, SetByTEMPLATES, SetMaxPage, SetActivePAGE, RESET } =
  reduxSlice.actions;

export default reduxSlice.reducer;
