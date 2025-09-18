import { createSlice, createAsyncThunk } from "@reduxjs/toolkit";
import { axioKit } from "../../../../utilities";

const url = "/diagnostics/clinic/menus";

const initialState = {
  filter: [],
  paginated: [],
  // Bread attributes
  selected: {}, // assurance
  page: 0,
  willCreate: false,
  showModal: false,
  /**
   * pagination
   */
  collections: [],
  filtered: [],
  maxPage: 5,
  totalPages: 0,
  activePage: 1,
  formSubmitted: false,
  isSuccess: false,
  isLoading: false,
  message: "",
};

// Fetch clinic menus
export const BROWSE = createAsyncThunk(
  `${url}`,
  ({ token, data }, thunkAPI) => {
    try {
      return axioKit.universal(`${url}/browse`, token, data);
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

export const DESTROY = createAsyncThunk(
  `${url}/destroy`,
  ({ data, token }, thunkAPI) => {
    try {
      return axioKit.destroy(url, data, token);
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
    SetFILTERED: (state, { payload }) => {
      state.filtered = payload;
    },
    SetFILTER: (state, { payload }) => {
      state.filtered = payload;
      state.collections = payload;
    },
    RESET: (state) => {
      state.message = "";
      state.isSuccess = false;
    },
    SetEDIT: (state, { payload }) => {
      state.selected = payload;
      state.willCreate = false;
      state.showModal = true;
    },
    SetCREATE: (state) => {
      state.willCreate = true;
      state.showModal = true;
    },
    toggleModal: (state) => {
      state.showModal = !state.showModal;
    },

    SetMaxPage: (state, { payload }) => {
      state.maxPage = payload;
      state.activePage = 1;
    },
    SetActivePAGE: (state, { payload }) => {
      state.activePage = payload;
    },
  },
  extraReducers: (builder) => {
    builder
      .addCase(BROWSE.pending, (state) => {
        state.isLoading = true;
      })
      .addCase(BROWSE.fulfilled, (state, { payload }) => {
        state.isLoading = false;
        state.isSuccess = true;
        state.collections = payload.payload || [];
        state.filtered = payload.payload || [];
      })
      .addCase(BROWSE.rejected, (state, { payload }) => {
        state.isLoading = false;
        state.message = payload || "Failed to fetch clinic menus";
      })
      .addCase(SAVE.pending, (state) => {
        state.formSubmitted = true;
        state.isSuccess = false;
        state.message = "";
      })
      .addCase(SAVE.fulfilled, (state, action) => {
        const payload = action.payload; // direct
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
        const payload = action.payload.payload;
        state.collections = state.collections.map((item) =>
          item._id === payload._id ? payload : item
        );
        state.filtered = state.collections;
        state.showModal = false;
        state.formSubmitted = false;
        state.isSuccess = true;
      })

      .addCase(UPDATE.rejected, (state, action) => {
        const { error } = action;
        state.message = error.message;
        state.isSuccess = false;
        state.formSubmitted = false;
      })
      .addCase(DESTROY.pending, (state) => {
        state.isLoading = true;
        state.isSuccess = false;
        state.message = "";
      })
      .addCase(DESTROY.fulfilled, (state, action) => {
        const deletedId =
          action.payload.payload.id || action.payload.payload._id;
        state.collections = state.collections.filter(
          (item) => item._id !== deletedId
        );
        state.filtered = state.filtered.filter(
          (item) => item._id !== deletedId
        );
        state.isSuccess = true;
        state.isLoading = false;
        state.showModal = false;
      })

      .addCase(DESTROY.rejected, (state, action) => {
        const { error } = action;
        state.message = error.message;
        state.isLoading = false;
      });
  },
});

export const {
  SetFILTERED,
  SetFILTER,
  RESET,
  toggleModal,
  setActivePage,
  SetMaxPage,
  SetCREATE,
  SetEDIT,
} = reduxSlice.actions;
export default reduxSlice.reducer;
