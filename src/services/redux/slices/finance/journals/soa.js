import { createSlice, createAsyncThunk } from "@reduxjs/toolkit";
import { axioKit } from "../../../../utilities";

const url = "/finance/journals/soa";
const today = new Date();

const initialState = {
  collections: [],
  filtered: [],
  cluster: [],
  vendor: { _id: "" },
  selected: {},
  formSubmitted: false,
  month: today.getMonth() + 1,
  year: today.getFullYear(),
  maxPage: 5,
  totalPages: 0,
  activePage: 1,
  isSuccess: false,
  isLoading: false,
  message: "",
  showModal: false,
};

// ✅ BROWSE
export const BROWSE = createAsyncThunk(
  `${url}/browse`,
  async ({ token, keys }, thunkAPI) => {
    try {
      return await axioKit.universal(`${url}/browse`, token, keys);
    } catch (error) {
      const message =
        (error.response && error.response.data && error.response.data.message) ||
        error.message ||
        error.toString();
      return thunkAPI.rejectWithValue(message);
    }
  }
);

// ✅ SAVE
export const SAVE = createAsyncThunk(
  `${url}/save`,
  async ({ data, token }, thunkAPI) => {
    try {
      return await axioKit.save(url, data, token);
    } catch (error) {
      const message =
        (error.response && error.response.data && error.response.data.message) ||
        error.message ||
        error.toString();
      return thunkAPI.rejectWithValue(message);
    }
  }
);

// ✅ UPDATE
export const UPDATE = createAsyncThunk(
  `${url}/update`,
  async ({ data, token }, thunkAPI) => {
    try {
      return await axioKit.update(url, data, token);
    } catch (error) {
      const message =
        (error.response && error.response.data && error.response.data.message) ||
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
    SetSoaCluster: (state) => {
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
          ...JSON.parse(localStorage.getItem("billing") || "{}"),
          [state.vendor?._id]: cluster,
        })
      );
    },
    CHECK_SOA: (state, { payload }) => {
      if (!state.vendor._id)
        return "please select source first to proceed in picking voucher";
      const { date, deal, totalDeals } = payload;
      const _cluster = [...state.cluster];
      const _clusterIndex = _cluster.findIndex((item) => item?.date === date);
      if (_clusterIndex > -1) {
        const { deals = [] } = _cluster[_clusterIndex];
        const _deals = [...deals];
        const dealIndex = _deals.findIndex((item) => item?._id === deal?._id);
        dealIndex > -1 ? _deals.splice(dealIndex, 1) : _deals.push(deal);
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
          ...JSON.parse(localStorage.getItem("billing") || "{}"),
          [state.vendor?._id]: _cluster,
        })
      );
    },
    SetSTATUS: (state, { payload }) => {
      if (payload === "all") state.filtered = state.collections;
      else
        state.filtered = state.collections.filter(
          ({ status }) => status === payload
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
    SetMONTH: (state, { payload }) => {
      if (payload === "next") {
        if (state.month === 12) {
          state.month = 1;
          state.year += 1;
        } else {
          state.month += 1;
        }
      } else if (payload === "prev") {
        if (state.month === 1) {
          state.month = 12;
          state.year -= 1;
        } else {
          state.month -= 1;
        }
      }
    },
    SetMONTH_VALUE: (state, { payload }) => {
      state.month = payload;
    },
    SetYEAR: (state, { payload }) => {
      state.year = payload;
    },
    ResetDATE: (state) => {
      state.month = today.getMonth() + 1;
      state.year = today.getFullYear();
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
      .addCase(BROWSE.rejected, (state, { payload }) => {
        state.message = payload;
        state.isLoading = false;
      })
      .addCase(SAVE.pending, (state) => {
        state.isLoading = true;
        state.isSuccess = false;
        state.message = "";
      })
      .addCase(SAVE.fulfilled, (state, { payload }) => {
        const { success, payload: item } = payload;
        state.collections.unshift(item);
        state.isSuccess = true;
        state.message = success;
        state.isLoading = false;
      })
      .addCase(SAVE.rejected, (state, { payload }) => {
        state.message = payload;
        state.isLoading = false;
      })
      .addCase(UPDATE.pending, (state) => {
        state.formSubmitted = true;
        state.isSuccess = false;
        state.message = "";
      })
      .addCase(UPDATE.fulfilled, (state, { payload }) => {
        const { success, payload: updated } = payload;
        const update = (list) => {
          const index = list.findIndex((x) => x._id === updated._id);
          if (index !== -1) list[index] = { ...list[index], ...updated };
        };
        update(state.collections);
        update(state.filtered);
        state.isSuccess = true;
        state.formSubmitted = false;
        state.message = success;
      })
      .addCase(UPDATE.rejected, (state, { payload }) => {
        state.message = payload;
        state.formSubmitted = false;
      });
  },
});

// Exports
export const {
  SetMaxPage,
  SetActivePAGE,
  CHECK_BULK_SOA,
  CHECK_SOA,
  SetSoaCluster,
  SetFilterByOUTSOURCE,
  SetSELECTED,
  SetSTATUS,
  SetPAYMENT,
  SetMONTH,
  SetMONTH_VALUE,
  SetYEAR,
  ToggleMODAL,
  ResetDATE,
  RESET,
} = reduxSlice.actions;

export default reduxSlice.reducer;
