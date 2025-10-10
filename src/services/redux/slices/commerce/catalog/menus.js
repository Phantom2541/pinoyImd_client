import { createSlice, createAsyncThunk } from "@reduxjs/toolkit";
import { axioKit } from "../../../../utilities";

const url = "commerce/catalog/menus";

const initialState = {
  collections: [],
  clone: {
    from: {
      type: "menus",
      _id: "",
      collections: [],
    },
    to: {
      type: "menus",
      _id: "",
      collections: [],
    },
    type: "menus",
  },
  import: {
    branchId: "",
    file: "",
    collections: [],
  },
  showCloneWarning: false,
  showImport: false,
  overwriteItems: [], //for cloning items
  filtered: [],
  menuList: [],
  maxPage: 5,
  totalPages: 0,
  activePage: 1,
  isSuccess: false,
  isLoading: false,
  formSubmitted: false,
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
export const BROWSE = createAsyncThunk(`${url}`, ({ token, key }, thunkAPI) => {
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

export const SAVE = createAsyncThunk(
  `${url}/save`,
  ({ data, token }, thunkAPI) => {
    try {
      return axioKit.save(url, data, token);
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

export const IMPORT = createAsyncThunk(
  `${url}/import`,
  ({ data, token }, thunkAPI) => {
    try {
      return axioKit.save(url, data, token, "importMS");
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

export const CLONE = createAsyncThunk(
  `${url}/clone`,
  ({ data, token }, thunkAPI) => {
    try {
      return axioKit.save(url, data, token, "clone");
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
  `${url}/generate`,
  ({ data, token }, thunkAPI) => {
    try {
      return axioKit.save(url, data, token, "generate");
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

export const reduxSlice = createSlice({
  name: url,
  initialState,
  reducers: {
    SetFILTERED: (state, { payload }) => {
      // Always create a new array before filtering
      // const collectionsCopy = state.collections.map((item) =>
      //   JSON.parse(JSON.stringify(item))
      // );
      const filtered = payload;
      state.filtered = filtered;

      // Dispatch the action instead of calling it as a function
      state.totalPages = Math.ceil(filtered.length / state.maxPage);

      // state.isSuccess = true;
    },
    SetCLONE: (state, { payload }) => {
      state.clone = payload;
    },

    SetCLONE_WARNING: (state, { payload }) => {
      state.overwriteItems = payload;
      state.showCloneWarning = true;
    },

    SetIMPORT: (state, { payload }) => {
      state.import = payload;
    },
    TOGGLE_IMPORT: (state) => {
      state.showImport = !state.showImport;
    },
    TOGGLE_CLONE_WARNING: (state) => {
      state.showCloneWarning = !state.showCloneWarning;
    },

    SetCOLLECTIONS: (state, { payload }) => {
      state.collections = payload;
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

        state.collections = state.filtered = payload;
        state.menuList = payload.filter((item) => item.opd > 0);
        state.totalPages = Math.ceil(payload.length / state.maxPage) || 1;
        state.activePage = Math.min(state.activePage, state.totalPages);
        state.isSuccess = success;
        state.isLoading = false;
      })
      .addCase(BROWSE.rejected, (state, action) => {
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
        const { success, payload } = action.payload;
        state.message = success;
        state.collections.unshift(payload);
        state.filtered.unshift(payload);
        state.isSuccess = true;
        state.formSubmitted = false;
      })
      .addCase(SAVE.rejected, (state, action) => {
        const { error } = action;
        state.message = error.message;
        state.formSubmitted = false;
      })
      .addCase(IMPORT.pending, (state) => {
        state.formSubmitted = true;
        state.isSuccess = false;
        state.message = "";
      })
      .addCase(IMPORT.fulfilled, (state, action) => {
        const { success } = action.payload;
        state.message = success;
        state.isSuccess = true;
        state.formSubmitted = false;
      })
      .addCase(IMPORT.rejected, (state, action) => {
        const { error } = action;
        state.message = error.message;
        state.formSubmitted = false;
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

      .addCase(CLONE.pending, (state) => {
        state.formSubmitted = true;
        state.isSuccess = false;
        state.message = "";
      })
      .addCase(CLONE.fulfilled, (state, action) => {
        const { success } = action.payload;
        state.message = success;
        state.isSuccess = true;
        state.formSubmitted = false;
      })
      .addCase(CLONE.rejected, (state, action) => {
        const { error } = action;
        state.message = error.message;
        state.formSubmitted = false;
      })

      .addCase(UPDATE.pending, (state) => {
        state.formSubmitted = true;
        state.isSuccess = false;
        state.message = "";
      })
      .addCase(UPDATE.fulfilled, (state, action) => {
        const { success, payload } = action.payload;
        const updateCollections = (collections) => {
          const index = collections.findIndex(
            (item) => item._id === payload._id
          );

          collections[index] = payload;
        };
        updateCollections(state.collections);
        updateCollections(state.filtered);
        state.message = success;
        state.isSuccess = true;
        state.formSubmitted = false;
      })
      .addCase(UPDATE.rejected, (state, action) => {
        const { error } = action;
        state.message = error.message;
        state.formSubmitted = false;
      });
  },
});

export const {
  SetFILTERED,
  SetCOLLECTIONS,
  SetMaxPage,
  SetActivePAGE,
  RESET,
  SetMENUS,
  SetCLONE,
  SetCLONE_WARNING,
  TOGGLE_CLONE_WARNING,
  SetIMPORT,
  TOGGLE_IMPORT,
} = reduxSlice.actions;

export default reduxSlice.reducer;
