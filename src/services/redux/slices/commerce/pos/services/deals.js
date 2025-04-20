import { createSlice, createAsyncThunk } from "@reduxjs/toolkit";
import { axioKit, dateFormat, getAge } from "../../../../../utilities";

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
  patient: {},
  cluster: [],
  sources: [],
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
  vendor: undefined,
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

export const GENERATE_SOA = createAsyncThunk(
  `${url}/GENERATE_SOA`,
  ({ data, token }, thunkAPI) => {
    try {
      return axioKit.save(url, data, token, "generate_soa");
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
      const department = ["laboratory", "radiology"].includes(data.department)
        ? data.department
        : "clinic";
      return axioKit.save(
        `diagnostics/${department}/result/${data.form.toLowerCase()}`,
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
      if (payload === "all") {
        state.filtered = state.collections;
        state.vendor = undefined;
      } else if (payload === "NoSource") {
        state.filtered = state.collections.filter(({ source }) => !source);
        state.vendor = "noSource";
      } else {
        state.filtered = state.collections.filter(
          ({ source }) => source?._id.toString() === payload.toString()
        );
        state.vendor = payload;
      }
      // state.filterBySource = value;
    },

    SetFilterByOUTSOURCE: (state, { payload }) => {
      if (payload !== state.filterBySource)
        if (payload === "all") {
          state.filtered = state.collections;
          state.vendor = "";
        } else {
          state.filtered = state.collections.filter(
            ({ outsource }) => outsource?._id.toString() === payload.toString()

            // source?._id.toString() === payload.toString()
          );
          state.outsource = payload;
        }
      state.filterBySource = payload;
    },

    SetVOUCHERS: (state, { payload }) => {
      state.collections = payload;
      state.filtered = payload;
    },
    // SetCluster: (state, { payload }) => {
    //   state.cluster = payload;
    // },
    SetCluster: (state, { payload }) => {
      const { cutoff, _id } = state.vendor;
      const fakeDB = localStorage.getItem("cluster");
      let parseVoucher = fakeDB ? JSON.parse(fakeDB) : {};
      if (parseVoucher[_id]?.length > 0) {
        state.cluster = parseVoucher[_id];
      } else {
        const now = new Date();
        const cutoffDate = new Date(
          now.getFullYear(),
          now.getMonth(),
          Number(cutoff) || 1
        );

        const filteredPayload = payload
          .filter((item) => {
            const itemDate = new Date(item.date); // assuming item.date is like "March 24, 2025"
            return itemDate <= cutoffDate;
          })
          .map((voucher) => ({ ...voucher, hasSelected: true }));

        state.cluster = filteredPayload;

        localStorage.setItem(
          "cluster",
          JSON.stringify({
            ...parseVoucher,
            [_id]: filteredPayload,
          })
        );
      }
    },

    CHECK_CUTOFF: (state, { payload }) => {
      const { cutoff, _id } = state.vendor;
      const now = new Date();
      const cutoffDate = new Date(
        now.getFullYear(),
        now.getMonth(),
        Number(cutoff) || 1
      );

      const _collections = state.collections.map((item) => {
        const { createdAt, source } = item;

        if (
          new Date(createdAt) <= cutoffDate &&
          source?._id.toString() === _id
        ) {
          return { ...item, hasSelected: true };
        } else {
          return item;
        }
      });

      const selectedDates = [
        ...new Set(
          _collections
            .filter(
              ({ hasSelected, source }) =>
                hasSelected === true &&
                source?._id?.toString() === state.vendor?._id?.toString()
            )
            .map(({ createdAt }) => dateFormat(createdAt))
        ),
      ];

      const result = selectedDates.map((date) => ({
        date,
        vendorId: state.vendor._id,
      }));
      state.collections = _collections;
      state.cluster = result;
      localStorage.setItem("cluster", JSON.stringify(result));
      localStorage.setItem("vouchers", JSON.stringify(_collections));
    },

    CHECK_BULK: (state, { payload }) => {
      const { deals, date } = payload;
      const cluster = [...state.cluster];
      const index = cluster.findIndex((item) => item.date === date);
      const foundCluster = cluster[index];
      const { hasSelected = false } = foundCluster || {};
      if (hasSelected) {
        cluster.splice(index, 1);
      } else {
        //remove existing cluster and insert new cluster
        if (index > -1) cluster.splice(index, 1);
        cluster.push({ date, deals, hasSelected: true });
      }

      state.cluster = cluster;

      localStorage.setItem(
        "cluster",
        JSON.stringify({
          ...JSON.parse(localStorage.getItem("cluster" || "{}")),
          [state.vendor?._id]: cluster,
        })
      );
    },

    CHECK_DEAL: (state, { payload }) => {
      if (!state.vendor._id)
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

        if (_deals.length === 0) {
          _cluster.splice(_clusterIndex, 1);
        } else {
          _cluster[_clusterIndex] = {
            ..._oldCluster,
            deals: _deals,
            hasSelected: totalDeals === _deals.length,
          };
        }
      } else {
        //if cluster is not exist
        _cluster.push({ date, deals: [deal], hasSelected: totalDeals === 1 });
      }
      state.cluster = _cluster;
      localStorage.setItem(
        "cluster",
        JSON.stringify({
          ...JSON.parse(localStorage.getItem("cluster" || "{}")),
          [state.vendor?._id]: _cluster,
        })
      );
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
        state.collections = state.filtered = payload;
        let uniqueSource = [];
        if (payload.length > 0)
          uniqueSource = [
            ...new Map(
              payload.map(({ source }) => [
                source?._id || "NoSource",
                {
                  _id: source?._id || "NoSource",
                  displayname: source?.displayname || "No Source",
                },
              ])
            ).values(),
          ];
        state.sources = uniqueSource;
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
        let uniqueSource = [];
        if (payload.length > 0)
          uniqueSource = [
            ...new Map(
              payload.map(({ source }) => [
                source?._id || "NoSource",
                {
                  _id: source?._id || "NoSource",
                  displayname: source?.displayname || "No Source",
                },
              ])
            ).values(),
          ];
        state.sources = uniqueSource;
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

      .addCase(GENERATE_SOA.pending, (state) => {
        state.isLoading = true;
        state.isSuccess = false;
        state.message = "";
      })
      .addCase(GENERATE_SOA.fulfilled, (state, action) => {
        const { success, payload } = action.payload;
        state.collections = state.collections.filter(
          ({ _id }) => !payload.includes(_id)
        );
        state.message = success;
        state.transaction = payload;
        state.isSuccess = true;
        state.isLoading = false;
      })
      .addCase(GENERATE_SOA.rejected, (state, action) => {
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
  CHECK_CUTOFF,
  SetSELECTED,
  CHECK_BULK,
  CHECK_DEAL,
  SetVOUCHERS,
  SetREVERT,
  SetDISCOUNT,
  SetCluster,
  ISCHECKED,
  PICK_VOUCHER_DEAL,
  ToggleDiscountModal,
  SetMODAL,
  SetMaxPage,
  SetActivePAGE,
  ToggleRevertModal,
  SetPatient,
  SetMONTH,
  RESET,
  ResetDATE,
} = reduxSlice.actions;

export default reduxSlice.reducer;
