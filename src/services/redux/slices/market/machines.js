import { createSlice, createAsyncThunk } from "@reduxjs/toolkit";
import { axioKit } from "../../../utilities";

const url = "/procurements/commodity";

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
  isSuccess: false,
  isLoading: false,
  message: "",
};

export const BROWSE = createAsyncThunk(
  `${url}`,
  ({ token, params }, thunkAPI) => {
    try {
      return axioKit.universal(`${url}/browse`, token, params);
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
    SetEDIT: (state, { payload }) => {
      state.selected = payload;
      state.willCreate = false;
      state.showModal = true;
    },
    SetCREATE: (state, { payload }) => {
      state.selected = {
        brand: "",
        name: "",
        subname: "",
        description: "",
        prescription: false,
        expense: 0,
        forsale: false,
        remarks: "",
        section: "",
        store: "",
      };
      state.willCreate = true;
      state.showModal = true;
    },
    SetFILTER: (state, { payload }) => {
      console.log("payload", payload);

      const { page, maxPage } = state;
      if (payload.length > 0) {
        let totalPages = Math.floor(payload.length / maxPage);
        if (payload.length % maxPage > 0) totalPages += 1;
        state.totalPages = totalPages;
        if (page > totalPages) {
          state.page = totalPages;
        }
      }
      state.filtered = payload;
    },
    SetPagination: (state) => {
      // {
      //   payload;
      // }getPage
      const { page, max } = state;
      // if (getPage) return array;

      state.paginated = state.filtered.slice(
        (page - 1) * max,
        max + (page - 1) * max
      );
    },
    SetPAGE: (state, { payload }) => {
      state.page = payload;
    },
    RESET: (state) => {
      state.isSuccess = false;
      state.message = "";
    },
    /**
     *  for pagination
     */
    SetMaxPage: (state, { payload }) => {
      state.maxPage = payload;
      state.activePage = 1;
    },
    SetActivePAGE: (state, { payload }) => {
      state.activePage = payload;
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

        state.collections = state.filtered = payload; // Fix typo
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
        state.isLoading = true;
        state.isSuccess = false;
        state.message = "";
      })
      .addCase(SAVE.fulfilled, (state, { payload }) => {
        state.collections.unshift(payload);
        state.showModal = false;
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
        console.log("action", action);
        const { success, payload } = action.payload;
        console.log("payload", payload);
        const index = state.collections.findIndex(
          (item) => item._id === payload._id
        );
        state.collections[index] = payload;
        const findex = state.filtered.findIndex(
          (item) => item._id === payload._id
        );
        state.filtered[findex] = payload;
        state.showModal = false;
        state.message = success;
        state.isSuccess = true;
        state.isLoading = false;
      })
      .addCase(UPDATE.rejected, (state, action) => {
        const { error } = action;
        state.message = error.message;
        state.isLoading = false;
      })
      .addCase(DESTROY.pending, (state) => {
        state.isLoading = true;
        state.isSuccess = false;
        state.message = "";
      })
      .addCase(DESTROY.fulfilled, (state, action) => {
        const { success, payload } = action.payload;
        const index = state.collections.findIndex(
          (item) => item?._id === payload
        );
        state.collections.splice(index, 1);

        const index2 = state.filtered.findIndex(
          (item) => item?._id === payload
        );
        state.filtered.splice(index2, 1);
        state.message = success;
        state.isSuccess = true;
        state.isLoading = false;
      })
      .addCase(DESTROY.rejected, (state, action) => {
        const { error } = action;
        state.message = error.message;
        state.isLoading = false;
      });
  },
});

export const {
  SetCREATE,
  SetEDIT,
  SetFILTER,
  SetPAGE,
  /**
   * for pagination
   */
  SetMaxPage,
  SetActivePAGE,
  TOGGLE,
  RESET,
} = reduxSlice.actions;

export default reduxSlice.reducer;
