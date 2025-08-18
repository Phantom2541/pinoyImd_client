import { createSlice, createAsyncThunk } from "@reduxjs/toolkit";
import { axioKit } from "../../../../utilities";

const url = "/procurements/catalogs/products/source";

const initialState = {
  collections: [],
  filtered: [],
  selected: {},
  maxPage: 5,
  totalPages: 0,
  activePage: 1,
  isSuccess: false,
  isLoading: false,
  formSubmitted: false,
  showModal: false,
  message: "",
};

// Thunks
export const BROWSE = createAsyncThunk(
  "products/browse",
  async ({ token, key }, thunkAPI) => {
    try {
      return await axioKit.universal(`${url}/browse`, token, key);
    } catch (error) {
      const message =
        error.response?.data?.message || error.message || error.toString();
      return thunkAPI.rejectWithValue(message);
    }
  }
);

export const CATALOG = createAsyncThunk(
  "products/catalog",
  async ({ token, key }, thunkAPI) => {
    try {
      return await axioKit.universal(`${url}/catalog`, token, key);
    } catch (error) {
      const message =
        error.response?.data?.message || error.message || error.toString();
      return thunkAPI.rejectWithValue(message);
    }
  }
);

export const SAVE = createAsyncThunk(
  "products/save",
  async ({ data, token }, thunkAPI) => {
    try {
      return await axioKit.save(url, data, token);
    } catch (error) {
      const message =
        error.response?.data?.message || error.message || error.toString();
      return thunkAPI.rejectWithValue(message);
    }
  }
);

export const GENERATE = createAsyncThunk(
  "products/generate",
  async ({ data, token }, thunkAPI) => {
    try {
      return await axioKit.save(url, data, token, "generate");
    } catch (error) {
      const message =
        error.response?.data?.message || error.message || error.toString();
      return thunkAPI.rejectWithValue(message);
    }
  }
);

export const UPDATE = createAsyncThunk(
  "products/update",
  async (form, thunkAPI) => {
    try {
      return await axioKit.update(url, form.data, form.token);
    } catch (error) {
      const message =
        error.response?.data?.message || error.message || error.toString();
      return thunkAPI.rejectWithValue(message);
    }
  }
);

const productsSlice = createSlice({
  name: "products",
  initialState,
  reducers: {
    SetFILTERED: (state, action) => {
      state.filtered = action.payload;
      state.totalPages = Math.ceil(state.filtered.length / state.maxPage);
    },
    SetPRODUCT: (state, action) => {
      state.selected = action.payload || {};
      state.showModal = true;
    },
    SetCOLLECTIONS: (state, action) => {
      state.collections = action.payload;
    },
    SetMaxPage: (state, action) => {
      state.maxPage = action.payload;
      state.activePage = 1;
    },
    SetActivePAGE: (state, action) => {
      state.activePage = action.payload;
    },
    RESET: (state) => {
      state.isSuccess = false;
      state.message = "";
      state.collections = [];
      state.filtered = [];
      state.isLoading = false;
      state.formSubmitted = false;
    },
    TOGGLE: (state) => {
      state.showModal = !state.showModal;
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
        const { success, payload } = action.payload;
        state.collections = payload;
        state.filtered = payload;
        state.totalPages = Math.ceil(payload.length / state.maxPage) || 1;
        state.activePage = Math.min(state.activePage, state.totalPages);
        state.message = success;
        state.isSuccess = true;
        state.isLoading = false;
      })
      .addCase(BROWSE.rejected, (state, action) => {
        state.message = action.payload || action.error.message;
        state.isLoading = false;
      })

      .addCase(CATALOG.pending, (state) => {
        state.isLoading = true;
        state.isSuccess = false;
        state.message = "";
      })
      .addCase(CATALOG.fulfilled, (state, action) => {
        const payload = action.payload?.payload || [];
        const success = action.payload?.success || false;

        state.collections = payload;
        state.filtered = payload;
        state.totalPages = Math.ceil(payload.length / state.maxPage) || 1;
        state.activePage = Math.min(state.activePage, state.totalPages);
        state.isSuccess = success;
        state.isLoading = false;
      })
      .addCase(CATALOG.rejected, (state, action) => {
        state.message = action.payload || action.error.message;
        state.isLoading = false;
      })

      .addCase(SAVE.pending, (state) => {
        state.formSubmitted = true;
        state.isSuccess = false;
        state.message = "";
      })
      .addCase(SAVE.fulfilled, (state, action) => {
        const success = action.payload?.success || false;
        const payload = action.payload?.payload;

        if (payload) {
          state.collections.unshift(payload);
          state.filtered.unshift(payload);
        }

        state.message = success ? "Saved successfully." : "";
        state.isSuccess = success;
        state.formSubmitted = false;
      })
      .addCase(SAVE.rejected, (state, action) => {
        state.message = action.payload || action.error.message;
        state.formSubmitted = false;
      })

      .addCase(GENERATE.pending, (state) => {
        state.isLoading = true;
        state.isSuccess = false;
        state.message = "";
      })
      .addCase(GENERATE.fulfilled, (state, action) => {
        const success = action.payload?.success || false;
        const payload = action.payload?.payload || [];

        state.message = success ? "Generated successfully." : "";
        state.collections = payload;
        state.filtered = payload;
        state.isSuccess = success;
        state.isLoading = false;
      })
      .addCase(GENERATE.rejected, (state, action) => {
        state.message = action.payload || action.error.message;
        state.isLoading = false;
      })

      .addCase(UPDATE.pending, (state) => {
        state.formSubmitted = true;
        state.isSuccess = false;
        state.message = "";
      })
      .addCase(UPDATE.fulfilled, (state, action) => {
        const success = action.payload?.success || false;
        const payload = action.payload?.payload;

        if (payload) {
          // update in collections
          const idx = state.collections.findIndex(
            (item) => item._id === payload._id
          );
          if (idx !== -1) state.collections[idx] = payload;

          // update in filtered
          const idx2 = state.filtered.findIndex(
            (item) => item._id === payload._id
          );
          if (idx2 !== -1) state.filtered[idx2] = payload;
        }

        state.message = success ? "Updated successfully." : "";
        state.isSuccess = success;
        state.formSubmitted = false;
      })
      .addCase(UPDATE.rejected, (state, action) => {
        state.message = action.payload || action.error.message;
        state.formSubmitted = false;
      });
  },
});

export const {
  SetFILTERED,
  SetPRODUCT,
  SetCOLLECTIONS,
  TOGGLE,
  SetMaxPage,
  SetActivePAGE,
  RESET,
} = productsSlice.actions;

export default productsSlice.reducer;
