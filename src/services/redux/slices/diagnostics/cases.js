import { createSlice, createAsyncThunk } from "@reduxjs/toolkit";
import { axioKit } from "../../../utilities";

const url = "/diagnostics/cases";

const initialState = {
  collections: [],
  filtered: [],
  maxPage: 5,
  totalPages: 0,
  activePage: 1,
  isSuccess: false,
  isLoading: false,
  formSubmitted: false,
  showItem: false,
  selected: {},
  message: "",
  gui: {
    showForm: false,
  },
};

// THUNKS

export const BROWSE = createAsyncThunk(
  `${url}/browse`,
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

export const PSH = createAsyncThunk(
  `${url}/psh`,
  async ({ token, key }, thunkAPI) => {
    try {
      return await axioKit.universal(`${url}/psh`, token, key);
    } catch (error) {
      const message =
        error.response?.data?.message || error.message || error.toString();
      return thunkAPI.rejectWithValue(message);
    }
  }
);

export const ADD_ITEM = createAsyncThunk(
  `${url}/add_item`,
  async ({ data, token }, thunkAPI) => {
    try {
      return await axioKit.save(url, data, token, "add_item");
    } catch (error) {
      const message =
        error.response?.data?.message || error.message || error.toString();
      return thunkAPI.rejectWithValue(message);
    }
  }
);

export const SAVE = createAsyncThunk(
  `${url}/save`,
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

export const UPDATE = createAsyncThunk(
  `${url}/update`,
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

// 🆕 DELETE THUNK
export const DESTROY = createAsyncThunk(
  `${url}/destroy`,
  async ({ id, token }, thunkAPI) => {
    try {
      return await axioKit.remove(`${url}/${id}`, token);
    } catch (error) {
      const message =
        error.response?.data?.message || error.message || error.toString();
      return thunkAPI.rejectWithValue(message);
    }
  }
);

// SLICE

export const casesSlice = createSlice({
  name: "cases",
  initialState,
  reducers: {
    SetFILTERED: (state, { payload }) => {
      state.filtered = payload;
      state.totalPages = Math.ceil(payload.length / state.maxPage);
    },
    SetITEM: (state, { payload }) => {
      state.selected = payload;
      state.showItem = true;
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
    SetCREATE: (state, { payload }) => {
      state.selected = payload;
      state.gui = { ...state.gui, showForm: true };
    },
    TOGGLE_ITEM: (state) => {
      state.showItem = !state.showItem;
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
        const { payload = [], success } = action.payload || {};
        state.collections = state.filtered = payload;
        state.totalPages = Math.ceil(payload.length / state.maxPage) || 1;
        state.activePage = Math.min(state.activePage, state.totalPages);
        state.isSuccess = success;
        state.isLoading = false;
      })
      .addCase(BROWSE.rejected, (state, action) => {
        state.message = action.payload || "Browse failed";
        state.isLoading = false;
      })

      .addCase(PSH.pending, (state) => {
        state.isLoading = true;
        state.isSuccess = false;
        state.message = "";
      })
      .addCase(PSH.fulfilled, (state, action) => {
        const { payload = [], success } = action.payload || {};
        state.collections = state.filtered = payload;
        state.totalPages = Math.ceil(payload.length / state.maxPage) || 1;
        state.activePage = Math.min(state.activePage, state.totalPages);
        state.isSuccess = success;
        state.isLoading = false;
      })
      .addCase(PSH.rejected, (state, action) => {
        state.message = action.payload || "Browse failed";
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
        state.message = action.payload || "Save failed";
        state.formSubmitted = false;
      })

      .addCase(ADD_ITEM.pending, (state) => {
        state.formSubmitted = true;
        state.isSuccess = false;
        state.message = "";
      })
      .addCase(ADD_ITEM.fulfilled, (state, action) => {
        const { success } = action.payload;
        state.message = success;
        state.isSuccess = true;
        state.formSubmitted = false;
      })
      .addCase(ADD_ITEM.rejected, (state, action) => {
        state.message = action.payload || "Save failed";
        state.formSubmitted = false;
      })

      .addCase(UPDATE.pending, (state) => {
        state.formSubmitted = true;
        state.isSuccess = false;
        state.message = "";
      })
      .addCase(UPDATE.fulfilled, (state, action) => {
        const { success, payload } = action.payload;
        const update = (arr) => {
          const i = arr.findIndex((item) => item._id === payload._id);
          if (i !== -1) arr[i] = payload;
        };
        update(state.collections);
        update(state.filtered);
        state.message = success;
        state.isSuccess = true;
        state.formSubmitted = false;
      })
      .addCase(UPDATE.rejected, (state, action) => {
        state.message = action.payload || "Update failed";
        state.formSubmitted = false;
      })
      .addCase(DESTROY.fulfilled, (state, action) => {
        const id = action.meta.arg.id;
        state.collections = state.collections.filter((item) => item._id !== id);
        state.filtered = state.filtered.filter((item) => item._id !== id);
        state.message = "Case deleted successfully.";
      })
      .addCase(DESTROY.rejected, (state, action) => {
        state.message = action.payload || "Delete failed";
      });
  },
});

export const {
  SetITEM,
  TOGGLE_ITEM,
  SetFILTERED,
  SetCOLLECTIONS,
  SetMaxPage,
  SetActivePAGE,
  SetCREATE,
  RESET,
} = casesSlice.actions;

export default casesSlice.reducer;
