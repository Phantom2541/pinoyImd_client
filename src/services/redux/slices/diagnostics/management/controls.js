import { createSlice, createAsyncThunk } from "@reduxjs/toolkit";
import { axioKit } from "../../../../utilities";

const url = "liability/controls";

const initialState = {
  collections: [], // incase one query only
  filtered: [], // filtered on collection to eliminate server load
  serviceId: undefined,

  // for BREAD
  selected: {},
  totalPages: 0,
  page: 0,
  showModal: false,
  willCreate: false,
  month: new Date().getMonth() + 1, // 0-based index (Jan = 0)
  year: new Date().getFullYear(),
  /**
   * Pagination
   */
  maxPage: 5, // Default value, computed dynamically when needed
  paginated: [], // paginated the filtered
  activePage: 1,
  isSuccess: false,
  isLoading: false,
  message: "",
};

// Async thunks
export const BROWSE = createAsyncThunk(
  `${url}/browse`,
  async ({ token, params }, thunkAPI) => {
    try {
      return await axioKit.universal(`${url}/browse`, token, params);
    } catch (error) {
      return thunkAPI.rejectWithValue(
        error.response?.data?.message || error.message
      );
    }
  }
);

export const SAVE = createAsyncThunk(`${url}/save`, async (form, thunkAPI) => {
  try {
    return await axioKit.save(url, form.data, form.token);
  } catch (error) {
    return thunkAPI.rejectWithValue(
      error.response?.data?.message || error.message
    );
  }
});

export const UPDATE = createAsyncThunk(
  `${url}/update`,
  async (form, thunkAPI) => {
    try {
      return await axioKit.update(url, form.data, form.token);
    } catch (error) {
      return thunkAPI.rejectWithValue(
        error.response?.data?.message || error.message
      );
    }
  }
);

export const DESTROY = createAsyncThunk(
  `${url}/destroy`,
  async ({ data, token }, thunkAPI) => {
    try {
      return await axioKit.destroy(url, data, token);
    } catch (error) {
      return thunkAPI.rejectWithValue(
        error.response?.data?.message || error.message
      );
    }
  }
);

// Redux slice
export const reduxSlice = createSlice({
  name: url,
  initialState,
  reducers: {
    SetEDIT: (state, { payload }) => {
      console.log("SetEDIT payload:", payload);

      state.selected = payload;
      state.willCreate = false;
      state.showModal = true;
    },
    SetCREATE: (state, { payload }) => {
      state.selected = {
        lo: "",
        norm: "",
        hi: "",
        serviceId: payload.serviceId,
      };
      state.willCreate = true;
      state.showModal = true;
    },
    SetFILTER: (state, { payload }) => {
      const { page, maxPage } = payload;
      if (page.length > 0) {
        state.totalPages = Math.ceil(payload.length / maxPage);
        if (state.page > state.totalPages) {
          state.page = state.totalPages;
        }
      }
      state.filtered = page;
    },
    SetSERVICES: (state, { payload }) => {
      state.serviceId = payload;
      const _filtered = state.collections.filter(
        ({ serviceId }) => serviceId === payload
      );
      state.totalPages = Math.ceil(_filtered.length / state.maxPage) || 1;
      state.activePage = Math.min(state.activePage, state.totalPages);
      state.filtered = _filtered;
    },

    SetMaxPage: (state, { payload }) => {
      state.maxPage = payload;
      state.activePage = 1;
    },
    SetActivePAGE: (state, { payload }) => {
      state.activePage = payload;
    },

    SetMONTH: (state, { payload }) => {
      console.log("SetMONTH payload :", payload);
      if (payload === "next") {
        if (state.month === 12) {
          state.month = 1;
          state.year += 1;
        } else {
          state.month += 1;
        }
      } else {
        if (state.month === 1) {
          state.month = 12;
          state.year -= 1;
        } else {
          state.month -= 1;
        }
      }
    },
    TOGGLE: (state) => {
      state.showModal = !state.showModal;
    },
    RESET: (state) => {
      state.month = new Date().getMonth() + 1;
      state.year = new Date().getFullYear();
      state.isSuccess = false;
      state.message = "";
    },
  },
  extraReducers: (builder) => {
    builder
      // BROWSE
      .addCase(BROWSE.pending, (state) => {
        state.isLoading = true;
      })
      .addCase(BROWSE.fulfilled, (state, { payload }) => {
        const { success, data } = payload;
        console.log("payload", payload);
        console.log("data", data);

        state.collections = data;
        state.isSuccess = success;
        state.isLoading = false;
      })
      .addCase(BROWSE.rejected, (state, { payload }) => {
        state.message = payload;
        state.isLoading = false;
      })
      // SAVE
      .addCase(SAVE.pending, (state) => {
        state.isLoading = true;
      })
      .addCase(SAVE.fulfilled, (state, { payload }) => {
        state.collections.unshift(payload);
        state.filtered.unshift(payload);
        state.showModal = false;
        state.isSuccess = true;
        state.isLoading = false;
      })
      .addCase(SAVE.rejected, (state, { payload }) => {
        state.message = payload;
        state.isLoading = false;
      })

      // UPDATE
      .addCase(UPDATE.pending, (state) => {
        state.isLoading = true;
        state.isSuccess = false;
        state.message = "";
      })
      .addCase(UPDATE.fulfilled, (state, action) => {
        const { success, payload } = action;
        const index = state.collections.findIndex(
          (item) => item._id === payload._id
        );

        state.collections[index] = payload;
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
      })
      .addCase(DESTROY.fulfilled, (state, { payload }) => {
        state.collections = state.collections.filter(
          ({ _id }) => _id !== payload
        );
        state.isSuccess = true;
        state.isLoading = false;
      })
      .addCase(DESTROY.rejected, (state, { payload }) => {
        state.message = payload;
        state.isLoading = false;
      });
  },
});

// Export actions and reducer
export const {
  SetCREATE,
  SetEDIT,
  SetFILTER,
  SetPAGE,
  SetSERVICES,
  SetMaxPage,
  SetActivePAGE,
  SetMONTH,
  TOGGLE,
  RESET,
} = reduxSlice.actions;
export default reduxSlice.reducer;
