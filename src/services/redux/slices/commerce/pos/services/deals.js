import { createSlice, createAsyncThunk } from "@reduxjs/toolkit";
import { axioKit } from "../../../../../utilities";

const url = "commerce/pos/services/deals";

const initialState = {
  collections: [],
  transaction: { _id: "default" },
  totalPatient: 0,
  formSubmitted: false,
  filtered: [],
  // this is used for ledger
  census: {
    daily: {},
    grossSales: 0,
    menus: {},
    services: {},
    expenses: 0,
    patients: 0,
    isEmpty: true,
  },
  showModal: false,
  showRevertModal: false,
  willCreate: false,
  totalPages: 0,
  maxPage: 5,
  activePage: 1,
  selected: {},
  isSuccess: false,
  isLoading: false,
  censusLoading: false, // dedicated loader for celsus
  message: "",
};

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

export const CASHIER = createAsyncThunk(
  `${url}/cashier`,
  ({ token, key }, thunkAPI) => {
    try {
      return axioKit.universal(`${url}/cashier`, token, key);
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

export const TRACKER = createAsyncThunk(
  `${url}/tracker`,
  ({ token, key }, thunkAPI) => {
    try {
      return axioKit.universal(`${url}/tracker`, token, key);
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

export const CENSUS = createAsyncThunk(
  `${url}/ledger`,
  ({ token, key }, thunkAPI) => {
    try {
      return axioKit.universal(`${url}/ledger`, token, key);
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

export const OLDLEDGER = createAsyncThunk(
  `${url}/oldledger`,
  ({ token, key }, thunkAPI) => {
    try {
      return axioKit.universal(`${url}/oldledger`, token, key);
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

export const YEARLY = createAsyncThunk(
  `${url}/yearly`,
  ({ token, branchId, year }, thunkAPI) => {
    //console.log("branchId", branchId);
    try {
      return axioKit.universal(`${url}/yearly`, token, {
        branchId,
        year,
      });
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

/**
 * Automatic generate URL.
 */
export const LABRESULT = createAsyncThunk(
  `${url}/results`,
  ({ token, data }, thunkAPI) => {
    try {
      // \diagnostics\laboratory\result\miscellaneous
      return axioKit.save(
        `diagnostics/${
          data.department === "LAB"
            ? "laboratory"
            : data.department === "RAD"
            ? "radiology"
            : "clinic"
        }/result/${data.form.toLowerCase()}`,
        data,
        token
      );
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

export const UPDATE = createAsyncThunk(
  `${url}/update`,
  ({ data, token }, thunkAPI) => {
    try {
      return axioKit.update(url, data, token);
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

export const REVERT_SALE = createAsyncThunk(
  `${url}/REVERT_SALE`,
  ({ data, token }, thunkAPI) => {
    try {
      return axioKit.update(url, data, token, "revert_sale");
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

export const MANAGERUPDATE = createAsyncThunk(
  `${url}/managerUpdate`,
  ({ key, token }, thunkAPI) => {
    try {
      return axioKit.universal(`${url}/managerUpdate`, token, key);
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
    SetTOTAL: (state, { payload }) => {
      state.total = payload;
    },
    SetFILTERED: (state, { payload }) => {
      state.filtered = payload;
    },

    SetREVERT: (state, { payload }) => {
      state.selected = payload;
      state.showRevertModal = true;
    },
    ToggleRevertModal: (state) => {
      state.showRevertModal = !state.showRevertModal;
      state.selected = {};
    },
    SetFilterByCASHIER: (state, { payload }) => {
      if (payload === "all") {
        state.filtered = state.collections;
      } else {
        state.filtered = state.collections.filter(
          (item) => item.cashierId._id === payload
        );
      }
    },
    SetSELECTED: (state, { payload }) => {
      state.selected = payload;
      state.showModal = true;
      state.willCreate = false;
    },
    SetMODAL: (state) => {
      state.showModal = !state.showModal;
    },
    SetMaxPage: (state, { payload }) => {
      state.maxPage = payload;
      state.activePage = 1;
    },
    SetActivePAGE: (state, { payload }) => {
      state.activePage = payload;
    },
    RESET: (state, { payload = {} }) => {
      state.isSuccess = false;
      state.message = "";

      if (payload?.resetCollections) state.collections = [];
    },
  },
  /**
   * Handles extra actions not handled by the reducer itself.
   *
   * @param {Object} builder - The builder object from `createSlice`.
   *
   * @returns {Object} The extra reducers.
   */
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
        state.totalPages =
          Math.ceil((payload?.length || 0) / state.maxPage) || 1;
        state.activePage = Math.min(state.activePage, state.totalPages);
        state.isSuccess = success;
        state.isLoading = false;
      })
      .addCase(BROWSE.rejected, (state, action) => {
        const { error } = action;
        state.message = error.message;
        state.isLoading = false;
      })

      .addCase(CASHIER.pending, (state) => {
        state.isLoading = true;
        state.isSuccess = false;
        state.message = "";
      })
      .addCase(CASHIER.fulfilled, (state, action) => {
        const { payload } = action.payload;
        state.collections = payload;
        state.isLoading = false;
      })
      .addCase(CASHIER.rejected, (state, action) => {
        const { error } = action;
        state.message = error.message;
        state.isLoading = false;
      })

      .addCase(MANAGERUPDATE.pending, (state) => {
        state.isLoading = true;
        state.isSuccess = false;
        state.message = "";
      })
      .addCase(MANAGERUPDATE.fulfilled, (state, action) => {
        const { success, payload } = action.payload,
          { _id, deletedAt, amount, discount, authorizedBy } = payload;

        const index = state.collections.findIndex((c) => c._id === _id);
        state.collections[index] = {
          ...state.collections[index],
          amount,
          discount, // Ensure discount is also updated
          deletedAt, // Keep track of deletion status
          authorizedBy, // Keep track of deletion status
        };

        state.message = success;
        state.isSuccess = true;
        state.isLoading = false;
      })
      .addCase(MANAGERUPDATE.rejected, (state, action) => {
        const { error } = action;
        state.message = error.message;
        state.isLoading = false;
      })
      .addCase(REVERT_SALE.pending, (state) => {
        state.formSubmitted = true;
        state.isSuccess = false;
        state.message = "";
      })
      .addCase(REVERT_SALE.fulfilled, (state, action) => {
        const { payload } = action.payload;
        const index = state.collections.findIndex(({ _id }) => _id === payload);
        const { deletedAt, ...rest } = { ...state.collections[index] };
        state.collections[index] = rest;
        state.formSubmitted = false;
      })
      .addCase(REVERT_SALE.rejected, (state, action) => {
        const { error } = action;
        state.message = error.message;
        state.isLoading = false;
      })

      .addCase(TRACKER.pending, (state) => {
        state.isLoading = true;
        state.isSuccess = false;
        state.message = "";
      })
      .addCase(TRACKER.fulfilled, (state, action) => {
        const { payload } = action.payload;
        state.collections = payload;
        state.isLoading = false;
      })
      .addCase(TRACKER.rejected, (state, action) => {
        const { error } = action;
        state.message = error.message;
        state.isLoading = false;
      })

      .addCase(CENSUS.pending, (state) => {
        state.census = {
          // this is used for ledger
          daily: {},
          grossSales: 0,
          menus: {},
          services: {},
          expenses: 0,
          patients: 0,
          isEmpty: true,
        };
        state.censusLoading = true;
        state.isSuccess = false;
        state.message = "";
      })

      .addCase(CENSUS.fulfilled, (state, action) => {
        // //console.log("payload-census", action.payload.census);
        const { sales = [], ...rest } = action.payload.census;

        const daily = sales?.reduce((daily, { createdAt, amount, ...rest }) => {
          const day = new Date(createdAt).toDateString(),
            obj = daily[day] || (daily[day] = { sales: [], total: 0 });

          obj.sales.push({ createdAt, amount, ...rest });
          obj.total += amount;
          // //console.log("daily", daily);

          return daily;
        }, {});

        state.census = { ...rest, daily };
        state.censusLoading = false;
      })
      .addCase(CENSUS.rejected, (state, action) => {
        const { error } = action;
        state.message = error.message;
        state.censusLoading = false;
      })

      .addCase(OLDLEDGER.pending, (state) => {
        state.census = {
          // this is used for ledger
          days: {},
          grossSales: 0,
          menus: {},
          services: {},
          expenses: 0,
          patients: 0,
          isEmpty: true,
        };
        state.isLoading = true;
        state.isSuccess = false;
        state.message = "";
      })

      .addCase(OLDLEDGER.fulfilled, (state, action) => {
        state.catalogs = action.payload;
        state.collections = action.payload;
        state.isLoading = false;
      })
      .addCase(OLDLEDGER.rejected, (state, action) => {
        const { error } = action;
        state.message = error.message;
        state.isLoading = false;
      })

      .addCase(YEARLY.pending, (state) => {
        state.isLoading = true;
        state.isSuccess = false;
        state.message = "";
      })
      .addCase(YEARLY.fulfilled, (state, action) => {
        const { payload } = action.payload;
        state.collections = payload;
        state.isLoading = false;
      })
      .addCase(YEARLY.rejected, (state, action) => {
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
        state.transaction = payload;
        state.isSuccess = true;
        state.isLoading = false;
      })
      .addCase(SAVE.rejected, (state, action) => {
        const { error } = action;
        state.message = error.message;
        state.isLoading = false;
      })

      .addCase(LABRESULT.pending, (state) => {
        // state.isLoading = true;
        state.isSuccess = false;
        state.message = "";
      })
      .addCase(LABRESULT.fulfilled, (state, action) => {
        const { success, payload } = action.payload;
        console.log("action.payload", action);

        state.message = success;
        const identifier = payload?.form === "Miscellaneous" ? "saleId" : "_id";

        // Find the index of the collection item based on the identifier
        const index = state.collections.findIndex(
          (item) => item._id === payload[identifier]
        );

        // Ensure the index is valid
        if (index !== -1) {
          if (identifier === "saleId") {
            // Update miscellaneous item at the correct index
            if (state.collections[index]?.miscellaneous) {
              state.collections[index].miscellaneous[payload?.miscIndex] =
                payload;
            }
          } else {
            const form = payload.form?.toLowerCase(); // Ensure form is lowercase
            console.log("form", form);
            console.log("index", index);
            console.log("state.collections", state.collections[index]);

            // Ensure collections[index] exists before modifying it
            if (state.collections[index]) {
              state.collections[index][form] = payload;
            }
          }
        } else {
          console.warn("Item not found in collections:", payload);
        }

        state.isSuccess = true;
        state.isLoading = false;
      })
      .addCase(LABRESULT.rejected, (state, action) => {
        const { error } = action;
        state.message = error.message;
        state.isLoading = false;
      })

      .addCase(UPDATE.pending, (state) => {
        // state.isLoading = true; comment this to stop loading and refreshing UI
        state.isSuccess = false;
        state.message = "";
      })
      .addCase(UPDATE.fulfilled, (state, action) => {
        const { success, payload } = action.payload;

        const index = state.collections.findIndex(
          (item) => item._id === payload._id
        );
        state.transaction = {
          ...payload,
          _id: state.transaction._id === payload._id ? "default" : payload._id,
        };

        const currentValue = { ...state.collections[index] };

        for (const key in payload) {
          if (currentValue.hasOwnProperty(key)) {
            currentValue[key] = payload[key];
          }
        }

        state.collections[index] = currentValue;
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
  SetTOTAL,
  SetFILTERED,
  SetFilterByCASHIER,
  SetSELECTED,
  SetREVERT,
  SetMODAL,
  SetMaxPage,
  SetActivePAGE,
  ToggleRevertModal,

  RESET,
} = reduxSlice.actions;

export default reduxSlice.reducer;
