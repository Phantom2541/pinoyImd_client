import { createSlice, createAsyncThunk } from "@reduxjs/toolkit";
import { axioKit } from "../../../../utilities";
const url = "/finance/journals/soa";

const initialState = {
  /**
   * for search and custom select.
   */
  collections: [],
  filtered: [],
  cluster: [],
  vendor: { _id: "" },
  selected: {},
  formSubmitted: false,
  month: new Date().getMonth() + 1,
  year: new Date().getFullYear(),
  /**
   * for footer pagination
   */
  maxPage: 5, // for max page
  totalPages: 0, // for pages
  activePage: 1, // for active page
  isSuccess: false,
  isLoading: false, // for loading
  message: "",
  showModal: false,
};

/**
 * Asynchronous thunk action to browse items.
 *
 * @function BROWSE
 * @param {Object} payload - The payload object containing token and key.
 * @param {string} payload.token - The authentication token.
 * @param {string} payload.key - The key for browsing.
 * @param {Object} thunkAPI - The thunk API object.
 * @returns {Promise<Object>} The response data or an error message.
 */
export const BROWSE = createAsyncThunk(
  `${url}`,
  ({ token, keys }, thunkAPI) => {
    try {
      return axioKit.universal(`${url}/browse`, token, keys);
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
    return axioKit.update(url, form.data, form.token, "update_dealOutSource");
  } catch (error) {
    const message =
      (error.response && error.response.data && error.response.data.message) ||
      error.message ||
      error.toString();

    return thunkAPI.rejectWithValue(message);
  }
});

export const reduxSlice = createSlice({
  name: url,
  initialState,
  reducers: {
    // for template use only
    SetFilterByOUTSOURCE: (state, { payload }) => {
      const { value, vendor } = payload;
      if (value === "all") {
        state.filtered = state.collections;
        state.source = "";
      } else {
        state.filtered = state.collections.filter(
          ({ outsource }) => outsource?._id === value
        );
        state.vendor = vendor;
      }
    },

    SetSoaCluster: (state, { payload }) => {
      const { soa, _id } = state.vendor;
      const fakeDB = localStorage.getItem("billing");
      let parseVoucher = fakeDB ? JSON.parse(fakeDB) : {};
      if (!_id && !soa) return;
      if (parseVoucher[_id]?.length > 0) {
        state.cluster = parseVoucher[_id];
      } else {
        state.cluster = [];
      }
    },
    CHECK_BULK_SOA: (state, { payload }) => {
      const { deals, date } = payload;
      const cluster = [...state.cluster];
      const index = cluster.findIndex((item) => item.date === date);
      const foundCluster = cluster[index];
      const { hasSelected = false } = foundCluster || {};
      if (hasSelected) {
        cluster.splice(index, 1);
      } else {
        if (index > -1) cluster.splice(index, 1);
        cluster.push({ date, deals, hasSelected: true });
      }

      state.cluster = cluster;

      localStorage.setItem(
        "billing",
        JSON.stringify({
          ...JSON.parse(localStorage.getItem("billing" || "{}")),
          [state.vendor?._id]: cluster,
        })
      );
    },

    CHECK_SOA: (state, { payload }) => {
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
        _cluster.push({ date, deals: [deal], hasSelected: totalDeals === 1 });
      }
      state.cluster = _cluster;
      localStorage.setItem(
        "billing",
        JSON.stringify({
          ...JSON.parse(localStorage.getItem("billing" || "{}")),
          [state.vendor?._id]: _cluster,
        })
      );
    },

    SetSELECTED: (state, { payload }) => {
      state.selected = payload;
    },
    SetPAYMENT: (state, { payload }) => {
      state.selected = payload;
      state.showModal = true;
    },
    ToggleMODAL: (state) => {
      state.showModal = !state.showModal;
    },
    SetMaxPage: (state, { payload }) => {
      state.maxPage = payload;
      state.activePage = 1;
    },
    SetActivePAGE: (state, { payload }) => {
      state.activePage = payload;
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
      .addCase(BROWSE.fulfilled, (state, { payload }) => {
        state.collections = state.filtered = payload;
        state.totalPages =
          Math.ceil((payload?.length || 0) / state.maxPage) || 1;
        state.activePage = Math.min(state.activePage, state.totalPages);
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
      .addCase(SAVE.fulfilled, (state, action) => {
        const { success, payload } = action.payload;
        state.message = success;
        state.collections.unshift(payload);
        state.isSuccess = true;
        state.isLoading = false;
      })
      .addCase(SAVE.rejected, (state, action) => {
        const { error } = action;
        state.message = error.message;
        state.isLoading = false;
      })
      .addCase(UPDATE.pending, (state) => {
        state.formSubmitted = true;
        state.isSuccess = false;
        state.message = "";
      })
      .addCase(UPDATE.fulfilled, (state, action) => {
        const { success, payload } = action.payload;
        const getIndex = (collections) =>
          collections.findIndex((item) => item._id === payload._id);

        const collectionIndex = getIndex(state.collections);
        const filteredIndex = getIndex(state.filtered);

        const existingSoa = state.collections[collectionIndex];
        const existingFiltered = state.filtered[filteredIndex];

        state.collections[collectionIndex] = {
          ...existingSoa,
          services: payload,
        };
        state.filtered[filteredIndex] = {
          ...existingFiltered,
          services: payload,
        };
        state.message = success;
        state.formSubmitted = false;
        state.isSuccess = true;
      })
      .addCase(UPDATE.rejected, (state, action) => {
        const { error } = action;
        state.message = error.message;
        state.formSubmitted = false;
      });
  },
});

export const {
  SetMaxPage,
  SetActivePAGE,
  CHECK_BULK_SOA,
  CHECK_SOA,
  SetSoaCluster,
  SetFilterByOUTSOURCE,
  SetSELECTED,
  SetPAYMENT,
  ToggleMODAL,
  RESET,
} = reduxSlice.actions;

export default reduxSlice.reducer;
