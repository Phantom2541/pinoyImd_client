import { createSlice, createAsyncThunk } from "@reduxjs/toolkit";
import { axioKit } from "../../../../utilities";
import moment from "moment";
const url = "finance/journals/payables";

const initialState = {
  selected: {},
  amount: [],
  page: 0,
  showPayablesModal: false,
  showPaymentModal: false,
  showCreateModal: false,
  willCreate: false,
  /**
   * for pagination
   */
  collections: [],
  filtered: [],
  month: new Date().getMonth() + 1, // 0-based index (Jan = 0)
  year: new Date().getFullYear(),
  maxPage: 5,
  totalPages: 0,
  activePage: 1,
  isSuccess: false,
  isLoading: false,
  formSubmitted: false,
  message: "",
};

export const BROWSE = createAsyncThunk(
  `${url}/browse`,
  async ({ key, token }, thunkAPI) => {
    try {
      return await axioKit.universal(`${url}/browse`, token, key);
    } catch (error) {
      return thunkAPI.rejectWithValue(
        error.response?.data?.message || error.message || error.toString()
      );
    }
  }
);

export const LIST = createAsyncThunk(`${url}/list`, async (token, thunkAPI) => {
  try {
    return await axioKit.universal(`${url}/list`, token);
  } catch (error) {
    return thunkAPI.rejectWithValue(
      error.response?.data?.message || error.message || error.toString()
    );
  }
});

export const SAVE = createAsyncThunk(`${url}/save`, async (form, thunkAPI) => {
  try {
    return await axioKit.save(url, form.data, form.token);
  } catch (error) {
    return thunkAPI.rejectWithValue(
      error.response?.data?.message || error.message || error.toString()
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
        error.response?.data?.message || error.message || error.toString()
      );
    }
  }
);

export const SOA = createAsyncThunk(
  `${url}/soa`,
  async ({ keys, token }, thunkAPI) => {
    try {
      return await axioKit.universal(`${url}/soa`, token, keys);
    } catch (error) {
      return thunkAPI.rejectWithValue(
        error.response?.data?.message || error.message || error.toString()
      );
    }
  }
);

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
    SetPAYMENTS: (state, { payload }) => {
      state.selected = payload;
      state.showPaymentModal = true;
      state.showPayablesModal = false;
      state.willCreate = false;
    },
    SetPAYOR: (state, { payload }) => {
      const { payableId, payor } = payload;
      const updateCollections = (collections) => {
        const index = collections.findIndex(({ _id }) => _id === payableId);
        collections[index] = { ...collections[index], payor };
      };
      updateCollections(state.collections);
      updateCollections(state.filtered);
    },
    SetPAYABLES: (state) => {
      state.showPaymentModal = false;
      state.showPayablesModal = true;
      state.willCreate = true;
    },
    RemoveVERIFIED_SOA: (state, { payload }) => {
      // This function is used in manager/accrues/soa to remove verified SOA entries.
      const index = state.collections.findIndex(({ _id }) => _id === payload);
      state.collections.splice(index, 1);
      state.showPayablesModal = false;
      state.showPaymentModal = true;
      state.willCreate = false;
    },
    SetEDIT: (state, { payload }) => {
      state.selected = payload;
      state.willCreate = true;
      state.showPayablesModal = true;
    },

    SetUpdate: (state, { payload }) => {
      state.selected = payload;
      state.willCreate = false;
      state.showPayablesModal = true;
    },

    /* Modal for Create */
    TOGGLE: (state) => {
      state.showPayablesModal = false;
      state.showPaymentModal = false;
      state.selected = {};
      state.willCreate = false;
    },

    SetCREATE: (state, { payload }) => {
      state.showPayablesModal = payload;
    },
    SetFILTERED: (state, { payload }) => {
      if (payload.length > 0) {
        state.totalPages = Math.ceil(payload.length / state.maxPage);
        if (state.page > state.totalPages) {
          state.page = state.totalPages;
        }
      }
      state.filtered = payload;
    },
    SetPAGE: (state, { payload }) => {
      state.page = payload;
    },
    SETSOURCES: (state, { payload }) => {
      state.collections = payload;
    },
    SetMONTH: (state, { payload }) => {
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
    RESET: (state) => {
      state.isSuccess = false;
      state.formSubmitted = false;
      state.message = "";
    },

    ResetDATE: (state) => {
      state.month = moment().month() + 1;
      state.year = moment().year();
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
      .addCase(SOA.pending, (state) => {
        state.isLoading = true;
      })
      .addCase(SOA.fulfilled, (state, { payload }) => {
        state.collections = payload.payload;
        state.isLoading = false;
      })
      .addCase(SOA.rejected, (state, { payload }) => {
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
        state.formSubmitted = true;
      })
      .addCase(SAVE.fulfilled, (state, { payload }) => {
        const { payload: data } = payload;
        state.collections.unshift(data);
        state.filtered.unshift(data);
        state.isSuccess = true;
        state.formSubmitted = false;
      })
      .addCase(SAVE.rejected, (state, { payload }) => {
        state.message = payload;
        state.formSubmitted = false;
      })
      .addCase(UPDATE.pending, (state) => {
        state.formSubmitted = true;
      })
      .addCase(UPDATE.fulfilled, (state, { payload }) => {
        const updateCOllections = (collections) => {
          const index = collections.findIndex(
            (item) => item._id === payload._id
          );

          collections[index] = payload;
        };
        updateCOllections(state.collections);
        updateCOllections(state.filtered);

        state.isSuccess = true;
        state.formSubmitted = false;
      })
      .addCase(UPDATE.rejected, (state, { payload }) => {
        state.message = payload;
        state.formSubmitted = false;
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
  SetUpdate,
  TOGGLE,
  SetCREATE,
  SetPAYABLES,
  SetPAYMENTS,
  RemoveVERIFIED_SOA,
  SetPAYOR,
  SetPAGE,
  SETSOURCES,
  SetShowMODAL,
  RESET,
  ResetDATE,
  SetFILTERED,
  SetMONTH,
  SetMaxPage,
  SetActivePAGE,
} = reduxSlice.actions;
export default reduxSlice.reducer;
