import { createSlice, createAsyncThunk } from "@reduxjs/toolkit";
import { axioKit } from "../../../../utilities";
import { Services } from "../../../../../services/fakeDb/index";

const url = "commerce/catalog/services";

const initialState = {
  /**
   * for search and custom select.
   */
  collections: [],
  filtered: [],
  cluster: [],
  template: "",
  /**
   * for pagination
   */
  maxPage: 5, // for max page
  totalPages: 0, // for pages
  activePage: 1, // for active page
  isSuccess: false,
  isLoading: false, // for loading
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
    // for template use only
    SetCOLLECTIONS: (state, { payload }) => {
      const { collections, maxPage } = payload;
      const sortedCollections = [...collections]?.sort((a, b) => {
        // Customize sorting logic as needed
        return a.name.localeCompare(b.name); // Example: Sorting alphabetically by 'url' property
      });

      if (sortedCollections.length > 0) {
        let totalPages = Math.floor(sortedCollections.length / maxPage);
        if (sortedCollections.length % maxPage > 0) totalPages += 1;
        state.totalPages = totalPages;

        if (state.activePage > totalPages) {
          state.activePage = totalPages;
        }
      }
      state.collections = [...sortedCollections];
      state.filtered = [...sortedCollections];
      state.maxPage = maxPage;
      state.isSuccess = true;
      state.isLoading = false;
    },
    SetCLUSTER: (state, { payload }) => {
      state.template = payload;
      state.filtered = state.cluster =
        payload === -1
          ? [...state.collections]
          : state.collections.filter((item) => item.template === payload);
    },
    SetFILTERED: (state, { payload }) => {
      state.filtered = [...payload];
    },
    SetSERVICES: (state, { payload }) => {
      const { collections, maxPage } = payload;
      // Create a copy before sorting to avoid modifying frozen state
      const sortedCollections = [...collections]?.sort((a, b) => {
        // Customize sorting logic as needed
        return a.name.localeCompare(b.name); // Example: Sorting alphabetically by 'url' property
      });

      state.collections = sortedCollections;
      state.filtered = sortedCollections;
      state.maxPage = maxPage;

      if (sortedCollections.length > 0) {
        let totalPages = Math.floor(sortedCollections.length / maxPage);
        if (sortedCollections.length % maxPage > 0) totalPages += 1;
        state.totalPages = totalPages;

        if (state.activePage > totalPages) {
          state.activePage = totalPages;
        }
      }

      state.isSuccess = true;
      state.isLoading = false;
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
        const { payload } = action.payload;
        const services = [...Services.collections]
          .sort((a, b) => a.name.localeCompare(b.name))
          .map((service) => {
            const references = payload.filter(
              ({ serviceId }) => serviceId === service.id
            );
            return { ...service, references };
          });

        state.cluster = state.filtered = state.collections = [...services];
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

export const {
  SetCOLLECTIONS,
  SetSERVICES,
  SetByTEMPLATES,
  SetMaxPage,
  SetActivePAGE,
  SetFILTERED,
  SetCLUSTER,
  RESET,
} = reduxSlice.actions;

export default reduxSlice.reducer;
