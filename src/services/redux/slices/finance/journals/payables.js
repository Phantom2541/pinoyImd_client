import { createSlice, createAsyncThunk } from "@reduxjs/toolkit";
import { axioKit } from "../../../../utilities";

const name = "finance/journals/payables";

const initialState = {
  // collections: [],
  // isSuccess: false,
  // isLoading: false,

  selected: {},
  amount: [],
  // totalPages: 0,
  page: 0,
  showPayablesModal: false,
  showPaymentModal: false,
  showCreateModal: false,
  willCreate: false,
  // maxPage: 5,
  /**
   * for pagination
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
  `${name}/browse`,
  async ({ key, token }, thunkAPI) => {
    try {
      return await axioKit.universal(`${name}/browse`, token, key);
    } catch (error) {
      return thunkAPI.rejectWithValue(
        error.response?.data?.message || error.message || error.toString()
      );
    }
  }
);

export const LIST = createAsyncThunk(
  `${name}/list`,
  async (token, thunkAPI) => {
    try {
      return await axioKit.universal(`${name}/list`, token);
    } catch (error) {
      return thunkAPI.rejectWithValue(
        error.response?.data?.message || error.message || error.toString()
      );
    }
  }
);

export const SAVE = createAsyncThunk(`${name}/save`, async (form, thunkAPI) => {
  try {
    return await axioKit.save(name, form.data, form.token);
  } catch (error) {
    return thunkAPI.rejectWithValue(
      error.response?.data?.message || error.message || error.toString()
    );
  }
});

export const UPDATE = createAsyncThunk(
  `${name}/update`,
  async (form, thunkAPI) => {
    try {
      return await axioKit.update(name, form.data, form.token);
    } catch (error) {
      return thunkAPI.rejectWithValue(
        error.response?.data?.message || error.message || error.toString()
      );
    }
  }
);

export const DESTROY = createAsyncThunk(
  `${name}/destroy`,
  ({ data, token }, thunkAPI) => {
    try {
      return axioKit.destroy(name, data, token);
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
    SetPAYMENTS: (state, { payload }) => {
      state.selected = payload;
      state.willCreate = true;
      state.showPaymentModal = true;
      state.showPayablesModal = false;
    },

    SetPAYABLES: (state) => {
      state.showPaymentModal = false;
      state.showPayablesModal = true;
    },
    SetEDIT: (state, { payload }) => {
      state.selected = payload;
      state.willCreate = true;
      state.showPayablesModal = true;
    },

    /* Modal for Create */
    SetCloseModal: (state) => {
      state.showPayablesModal = false;
      state.showPaymentModal = false;
    },

    SetCREATE: (state, { payload }) => {
      state.showPayablesModal = payload;
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
    SetPAGE: (state, { payload }) => {
      state.page = payload;
    },
    SETSOURCES: (state, { payload }) => {
      state.collections = payload;
    },
    RESET: (state) => {
      state.isSuccess = false;
      state.message = "";
    },
    /**
     * for pagination
     */
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

      .addCase(BROWSE.fulfilled, (state, action) => {
        const { success = false } = action.payload || {};

        state.collections = state.filtered = action.payload;
        state.totalPages =
          Math.ceil((action.payload?.length || 0) / state.maxPage) || 1;
        state.activePage = Math.min(state.activePage, state.totalPages);
        state.isSuccess = success;
        state.isLoading = false;
      })

      .addCase(BROWSE.rejected, (state, { payload }) => {
        state.message = payload;
        state.isLoading = false;
      })

      .addCase(LIST.pending, (state) => {
        state.isLoading = true;
      })
      .addCase(LIST.fulfilled, (state, { payload }) => {
        state.collections = payload;
        state.isLoading = false;
      })
      .addCase(LIST.rejected, (state, { payload }) => {
        state.message = payload;
        state.isLoading = false;
      })
      .addCase(SAVE.pending, (state) => {
        state.isLoading = true;
      })
      .addCase(SAVE.fulfilled, (state, { payload }) => {
        state.collections.unshift(payload);
        state.isSuccess = true;
        state.isLoading = false;
      })
      .addCase(SAVE.rejected, (state, { payload }) => {
        state.message = payload;
        state.isLoading = false;
      })
      .addCase(UPDATE.pending, (state) => {
        state.isLoading = true;
      })
      .addCase(UPDATE.fulfilled, (state, { payload }) => {
        const index = state.collections.findIndex(
          (item) => item._id === payload._id
        );
        if (index !== -1) {
          state.collections[index] = payload;
        }
        state.isSuccess = true;
        state.isLoading = false;
      })
      .addCase(UPDATE.rejected, (state, { payload }) => {
        state.message = payload;
        state.isLoading = false;
      })

      .addCase(DESTROY.pending, (state) => {
        state.isLoading = true;
        state.isSuccess = false;
        state.message = "";
      })
      .addCase(DESTROY.fulfilled, (state, action) => {
        const { success, message, _id } = action.payload;
        const index = state.collections.findIndex((item) => item._id === _id);

        state.collections.splice(index, 1);
        state.message = message;
        state.isSuccess = success;
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
  SetBUY,
  SetEDIT,
  SetCloseModal,
  SetCREATE,
  SetPAYABLES,
  SetPAYMENTS,
  SetFILTER,
  SetPAGE,
  SETSOURCES,
  SetShowMODAL,
  RESET,
  /**
   * for pagination
   */
  SetMaxPage,
  SetActivePAGE,
} = reduxSlice.actions;
export default reduxSlice.reducer;
