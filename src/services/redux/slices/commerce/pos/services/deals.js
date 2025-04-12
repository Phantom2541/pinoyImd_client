import { createSlice, createAsyncThunk } from "@reduxjs/toolkit";
import { axioKit, getAge } from "../../../../../utilities";
import _ from "lodash";

const url = "commerce/pos/services/deals";
const today = new Date();

const initialState = {
  month: new Date().getMonth() + 1, // Month as a number (1-12)
  year: new Date().getFullYear(),
  collections: [],
  transaction: { _id: "default" },
  totalPatient: 0,
  formSubmitted: false,
  filtered: [],
  filterByCashier: "all",
  cashiers: [],
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
  patient: {},
  cluster: {},
  showModal: false,
  showRevertModal: false,
  showDiscountModal: false,
  willCreate: false,
  totalPages: 0,
  maxPage: 5,
  activePage: 1,
  selected: {},
  isSuccess: false,
  isLoading: false,
  censusLoading: false, // dedicated loader for celsus
  message: "",
  source: "",
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
export const VOUCHERS = createAsyncThunk(
  `${url}/vouchers`,
  ({ token, key }, thunkAPI) => {
    try {
      return axioKit.universal(`${url}/vouchers`, token, key);
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
export const OUTSOURCES = createAsyncThunk(
  `${url}/outsources`,
  ({ token, keys }, thunkAPI) => {
    try {
      return axioKit.universal(`${url}/outsources`, token, keys);
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

export const UPDATE_INFO = createAsyncThunk(
  `${url}/UPDATE_INFO`,
  ({ data, token }, thunkAPI) => {
    try {
      return axioKit.update(url, data, token, "update_info");
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
    SetDISCOUNT: (state, { payload }) => {
      state.selected = payload;
      state.showDiscountModal = true;
    },
    ToggleDiscountModal: (state) => {
      state.showDiscountModal = !state.showDiscountModal;
      state.selected = {};
    },
    ToggleRevertModal: (state) => {
      state.showRevertModal = !state.showRevertModal;
      state.selected = {};
    },
    SetFilterByCASHIER: (state, { payload }) => {
      if (payload !== state.filterByCashier)
        if (payload === "all") {
          state.filtered = state.collections;
        } else {
          state.filtered = state.collections.filter(
            ({ cashierId }) => cashierId._id.toString() === payload.toString()
          );
        }
      state.filterByCashier = payload;
    },

    SetFilterBySOURCE: (state, { payload }) => {
      if (payload !== state.filterBySource)
        if (payload === "all") {
          state.filtered = state.collections;
          state.source = "";
        } else {
          state.filtered = state.collections.filter(
            ({ source }) => source?._id.toString() === payload.toString()
          );
          state.source = payload;
        }
      state.filterBySource = payload;
    },

    SetFilterByOUTSOURCE: (state, { payload }) => {
      if (payload !== state.filterBySource)
        if (payload === "all") {
          state.filtered = state.collections;
          state.source = "";
        } else {
          console.log("payload", payload);

          state.filtered = state.collections.filter(
            ({ outsource }) => outsource?._id.toString() === payload.toString()

            // source?._id.toString() === payload.toString()
          );
          state.outsource = payload;
        }
      state.filterBySource = payload;
    },
    SetCluster: (state, { payload }) => {
      state.cluster = payload;
    },

    ISCHECKED: (state, { payload }) => {
      const { date, byDate = false, deal } = payload;
      const _cluster = [...state.cluster];
      const findCluster = _cluster.find((item) => item?.date === date);
      if (byDate) return findCluster.isSelected;
      const { deals = [] } = findCluster || {};
      return deals.some(({ _id }) => _id === deal._id);
    },
    PICK_ALL_VOUCHER_DEALS: (state, { payload }) => {
      const { deals, date } = payload;
      const _cluster = [...state.cluster];
      const index = _cluster.findIndex((item) => item?.date === date);
      // const findCluster = _cluster[index];
      index > -1
        ? _cluster.splice(index, 1)
        : _cluster.push({ date, deals, isSelected: true });

      state.cluster = _cluster;
      localStorage.setItem(`source-${state.source}`, JSON.stringify(_cluster));
    },

    PICK_VOUCHER_DEAL: (state, { payload }) => {
      if (!state.source)
        return "please select source first to proceed in picking voucher";

      const { date, deal, totalDeals } = payload; //ex. totalDeals=5
      /* 
          The purpose of 'totalDeals' is to determine how many deals exist on a specific date. 
          If 'totalDeals' is equal to the number of deals in the local storage store for that date,
          it means that all deals for that date have already been checked.
      */
      const _cluster = [...state.cluster];
      const _clusterIndex = _cluster.findIndex((item) => item?.date === date);
      if (_clusterIndex > -1) {
        //if cluster is already exist
        const { deals = [] } = _cluster[_clusterIndex];
        const _deals = [...deals];

        const dealIndex = _deals.findIndex((item) => item?._id === deal?._id);
        // if deal is already exist remove it
        // if deal is not exist push it to deals
        dealIndex > -1 ? _deals.splice(dealIndex, 1) : _deals.push(deal);

        // update cluster deals
        const _oldCluster = _cluster[_clusterIndex];
        _cluster[_clusterIndex] = {
          ..._oldCluster,
          deals: _deals,
          isSelected: totalDeals === _deals.length,
        };
      } else {
        //if cluster is not exist
        _cluster.push({ date, deals: [deal], isSelected: false });
      }
      state.cluster = _cluster;
      localStorage.setItem(`source-${state.source}`, JSON.stringify(_cluster));
    },

    SetSELECTED: (state, { payload }) => {
      state.selected = payload;
      state.showModal = true;
      state.willCreate = false;
    },
    SetPatient: (state, { payload }) => {
      state.patient = payload;
      const isSenior = getAge(payload.dob, true) > 59; // Use payload instead of customer
      state.privilege = payload.privilege || (isSenior ? 2 : 0);
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

    RESET: (state, { payload = {} }) => {
      state.isSuccess = false;
      state.message = "";
      state.isLoading = false;
      state.formSubmitted = false;

      if (payload?.resetCollections) state.collections = [];
    },
    ResetDATE: (state) => {
      state.month = today.getMonth() + 1;
      state.year = today.getFullYear();
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
        state.collections = payload;
        state.filtered = payload;
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

      .addCase(VOUCHERS.pending, (state) => {
        state.isLoading = true;
        state.isSuccess = false;
        state.message = "";
      })
      .addCase(VOUCHERS.fulfilled, (state, action) => {
        const { payload, success } = action.payload;
        state.collections = state.filtered = payload;
        state.totalPages =
          Math.ceil((payload?.length || 0) / state.maxPage) || 1;
        state.activePage = Math.min(state.activePage, state.totalPages);
        state.isSuccess = success;
        state.isLoading = false;
      })
      .addCase(VOUCHERS.rejected, (state, action) => {
        const { error } = action;
        state.message = error.message;
        state.isLoading = false;
      })
      .addCase(OUTSOURCES.pending, (state) => {
        state.isLoading = true;
        state.isSuccess = false;
        state.message = "";
      })
      .addCase(OUTSOURCES.fulfilled, (state, action) => {
        const { payload, success } = action.payload;
        state.collections = state.filtered = payload;
        state.totalPages =
          Math.ceil((payload?.length || 0) / state.maxPage) || 1;
        state.activePage = Math.min(state.activePage, state.totalPages);
        state.isSuccess = success;
        state.isLoading = false;
      })
      .addCase(OUTSOURCES.rejected, (state, action) => {
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
        state.totalPages = payload.length;
        state.isLoading = false;
      })
      .addCase(CASHIER.rejected, (state, action) => {
        const { error } = action;
        state.message = error.message;
        state.isLoading = false;
      })

      .addCase(MANAGERUPDATE.pending, (state) => {
        state.formSubmitted = true;
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
        state.formSubmitted = false;
      })
      .addCase(MANAGERUPDATE.rejected, (state, action) => {
        const { error } = action;
        state.message = error.message;
        state.formSubmitted = false;
      })
      .addCase(REVERT_SALE.pending, (state) => {
        state.formSubmitted = true;
        state.isSuccess = false;
        state.message = "";
      })
      .addCase(REVERT_SALE.fulfilled, (state, action) => {
        const { payload, success } = action.payload;
        const index = state.collections.findIndex(({ _id }) => _id === payload);
        const { deletedAt, remarks, ...rest } = { ...state.collections[index] };
        state.collections[index] = rest;
        state.formSubmitted = false;
        state.message = success;
        state.isSuccess = true;
      })
      .addCase(REVERT_SALE.rejected, (state, action) => {
        const { error } = action;
        state.message = error.message;
        state.formSubmitted = false;
        state.isSuccess = false;
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
        const { sales = [], ...rest } = action.payload.census;

        const daily = sales?.reduce((daily, { createdAt, amount, ...rest }) => {
          const day = new Date(createdAt).toDateString(),
            obj = daily[day] || (daily[day] = { sales: [], total: 0 });

          obj.sales.push({ createdAt, amount, ...rest });
          obj.total += amount;
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

      .addCase(UPDATE_INFO.pending, (state) => {
        state.formSubmitted = true;
        state.isSuccess = false;
        state.message = "";
      })
      .addCase(UPDATE_INFO.fulfilled, (state, action) => {
        const { success, payload } = action.payload;
        const index = state.collections.findIndex(
          ({ _id }) => _id === payload._id
        );
        state.collections[index] = {
          ...state.collections[index],
          ...payload,
        };
        state.message = success;
        state.isSuccess = true;
        state.formSubmitted = false;
      })
      .addCase(UPDATE_INFO.rejected, (state, action) => {
        const { error } = action;
        state.message = error.message;
        state.formSubmitted = false;
      })

      .addCase(LABRESULT.pending, (state) => {
        // state.isLoading = true;
        state.isSuccess = false;
        state.message = "";
      })
      .addCase(LABRESULT.fulfilled, (state, action) => {
        const { success, payload } = action.payload;
        state.message = success;
        const identifier = payload?.form === "Miscellaneous" ? "dealId" : "_id";

        // Find the index of the collection item based on the identifier
        const index = state.collections.findIndex(
          (item) => item._id === payload[identifier]
        );

        // Ensure the index is valid
        if (index !== -1) {
          if (identifier === "dealId") {
            // Update miscellaneous item at the correct index
            if (state.collections[index]?.miscellaneous) {
              state.collections[index].miscellaneous[payload?.miscIndex] =
                payload;
            }
          } else {
            const form = payload.form?.toLowerCase(); // Ensure form is lowercase
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
        state.formSubmitted = true;
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

        state.collections[index] = { ...currentValue, ...payload };
        state.message = success;
        state.isSuccess = true;
        state.formSubmitted = false;
        state.isLoading = false;
      })
      .addCase(UPDATE.rejected, (state, action) => {
        const { error } = action;
        state.formSubmitted = false;
        state.message = error.message;
        state.isLoading = false;
      });
  },
});

export const {
  SetTOTAL,
  SetFILTERED,
  SetFilterByCASHIER,
  SetFilterBySOURCE,
  SetFilterByOUTSOURCE,
  SetSELECTED,
  SetREVERT,
  SetDISCOUNT,
  ToggleDiscountModal,
  SetMODAL,
  SetMaxPage,
  SetActivePAGE,
  ToggleRevertModal,
  SetPatient,
  SetMONTH,
  RESET,
} = reduxSlice.actions;

export default reduxSlice.reducer;
