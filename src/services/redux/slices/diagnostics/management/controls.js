import { createSlice, createAsyncThunk } from "@reduxjs/toolkit";
import { axioKit } from "../../../../utilities";

const url = "liability/controls";

const initialState = {
  collections: [], // incase one query only
  filter: [], // filtered on collection to eliminate server load
  serviceId: undefined,

  // for BREAD
  selected: {},
  totalPages: 0,
  page: 0,
  showModal: false,
  willCreate: false,
  /**
   * Pagination
   */
  maxPage: 5, // Default value, computed dynamically when needed
  filtered: [],
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
      console.log("payload", payload);

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
      state.filter = page;
    },
    SetSERVICES: (state, { payload }) => {
      state.serviceId = payload;
    },

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
    RESET: (state) => {
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
      .addCase(BROWSE.fulfilled, (state, action) => {
        const { success } = action.payload;
        state.collections = state.filtered = action.payload; // Fix typo
        state.totalPages =
          Math.ceil(action.payload.length / state.maxPage) || 1;
        state.activePage = Math.min(state.activePage, state.totalPages);
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
      // .addCase(UPDATE.pending, (state) => {
      //   state.isLoading = true;
      // })
      // .addCase(UPDATE.fulfilled, (state, { payload }) => {
      //   const index = state.collections.findIndex(
      //     (item) => item._id === payload._id
      //   );
      //   if (index !== -1) {
      //     state.collections[index] = payload;
      //   }
      //   state.showModal = false;
      //   state.isSuccess = true;
      //   state.isLoading = false;
      // })
      // .addCase(UPDATE.rejected, (state, { payload }) => {
      //   state.message = payload;
      //   state.isLoading = false;
      // })

      // DESTROY
      .addCase(DESTROY.pending, (state) => {
        state.isLoading = true;
      })
      .addCase(DESTROY.fulfilled, (state, { payload }) => {
        state.collections = state.collections.filter(
          (item) => item._id !== payload
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
  TOGGLE,
  RESET,
} = reduxSlice.actions;
export default reduxSlice.reducer;
