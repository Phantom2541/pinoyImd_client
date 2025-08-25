import { createSlice, createAsyncThunk } from "@reduxjs/toolkit";
import { axioKit } from "../../../utilities";

const url = "/liability/attendances";
const today = new Date();

const initialState = {
  filter: [],
  paginated: [],
  selected: {},
  page: 0,
  willCreate: false,
  showModal: false,

  collections: [],
  filtered: [],
  maxPage: 5,
  totalPages: 0,
  activePage: 1,
  isSuccess: false,
  isLoading: false,
  message: "",

  month: today.getMonth() + 1,
  year: today.getFullYear(),
  activeDate: null,
  activeEmployee: null,
};


const enrichEmployeeName = (rec) => {
  const user = rec.userId || rec.user || {};
  const fullName = user.fullName || {};

  const nameParts = [
    fullName.fname,
    fullName.mname,
    fullName.lname,
    fullName.suffix,
  ].filter(Boolean);

  return {
    ...rec,
    employeeName: rec.employeeName || nameParts.join(" ") || "Unknown"
  };
};


export const BROWSE = createAsyncThunk(
  `${url}`,
  async ({ token, params }, thunkAPI) => {
    try {
      return await axioKit.universal(`${url}/browse`, token, params);
    } catch (error) {
      const message = error.response?.data?.message || error.message || error.toString();
      return thunkAPI.rejectWithValue(message);
    }
  }
);

export const SAVE = createAsyncThunk(
  `${url}/save`,
  async (form, thunkAPI) => {
    try {
      return await axioKit.save(url, form.data, form.token);
    } catch (error) {
      const message = error.response?.data?.message || error.message || error.toString();
      return thunkAPI.rejectWithValue(message);
    }
  }
);

export const UPDATE = createAsyncThunk(
  `${url}/update`,
  async (form, thunkAPI) => {
    try {
      return await axioKit.update(url, form.data, form.token);
    } catch (error) {
      const message = error.response?.data?.message || error.message || error.toString();
      return thunkAPI.rejectWithValue(message);
    }
  }
);

export const DESTROY = createAsyncThunk(
  `${url}/destroy`,
  async ({ data, token }, thunkAPI) => {
    try {
      return await axioKit.destroy(url, data, token);
    } catch (error) {
      const message = error.response?.data?.message || error.message || error.toString();
      return thunkAPI.rejectWithValue(message);
    }
  }
);

// ================= SLICE =================
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
        lo: "",
        norm: "",
        hi: "",
        serviceId: payload.serviceId,
      };
      state.willCreate = true;
      state.showModal = true;
    },
    SetFILTER: (state, { payload }) => {
      const { page, maxPage } = state;
      if (payload.length > 0) {
        let totalPages = Math.floor(payload.length / maxPage);
        if (payload.length % maxPage > 0) totalPages += 1;
        state.totalPages = totalPages;
        if (page > totalPages) state.page = totalPages;
      }
      state.filtered = payload;
    },
    SetPagination: (state) => {
      const { page, maxPage } = state;
      state.paginated = state.filter.slice((page - 1) * maxPage, page * maxPage);
    },
    SetPAGE: (state, { payload }) => {
      state.page = payload;
    },
    RESET: (state) => {
      state.isSuccess = false;
      state.message = "";
    },
    SetMONTH: (state, { payload }) => {
      if (payload === "next") {
        if (state.month === 12) {
          state.month = 1;
          state.year += 1;
        } else state.month += 1;
      } else if (payload === "prev") {
        if (state.month === 1) {
          state.month = 12;
          state.year -= 1;
        } else state.month -= 1;
      } else if (typeof payload === "number") {
        state.month = payload;
      }
    },
    ResetDATE: (state) => {
      state.month = today.getMonth() + 1;
      state.year = today.getFullYear();
      state.activeDate = null;
      state.activeEmployee = null;
    },
    setYear: (state, { payload }) => {
      state.year = payload;
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

    SetActiveDATE: (state, { payload }) => {
      state.activeDate = payload;
      state.activeEmployee = null;
    },
    SetActiveEmployee: (state, { payload }) => {
      state.activeEmployee = payload;
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
        const enrichedPayload = payload.map(enrichEmployeeName);
        state.collections = state.filtered = enrichedPayload;
        state.totalPages = Math.ceil(enrichedPayload.length / state.maxPage) || 1;
        state.activePage = Math.min(state.activePage, state.totalPages);
        state.isSuccess = success;
        state.isLoading = false;
      })
      .addCase(BROWSE.rejected, (state, action) => {
        state.message = action.payload;
        state.isLoading = false;
      })
      .addCase(SAVE.pending, (state) => {
        state.isLoading = true;
        state.isSuccess = false;
        state.message = "";
      })
      .addCase(SAVE.fulfilled, (state, action) => {
        const { payload } = action.payload;
        const enrichedPayload = enrichEmployeeName(payload);
        state.collections.unshift(enrichedPayload);
        state.filtered.unshift(enrichedPayload);
        state.showModal = false;
        state.isSuccess = true;
        state.isLoading = false;
      })
      .addCase(SAVE.rejected, (state, action) => {
        state.message = action.payload;
        state.isLoading = false;
      })
      .addCase(UPDATE.pending, (state) => {
        state.isLoading = true;
        state.isSuccess = false;
        state.message = "";
      })
      .addCase(UPDATE.fulfilled, (state, action) => {
        const { success, payload } = action.payload;
        const enrichedPayload = enrichEmployeeName(payload);
        const fIndex = state.filtered.findIndex((item) => item._id === enrichedPayload._id);
        if (fIndex !== -1) state.filtered[fIndex] = enrichedPayload;
        state.showModal = false;
        state.message = success;
        state.isSuccess = true;
        state.isLoading = false;
      })
      .addCase(UPDATE.rejected, (state, action) => {
        state.message = action.payload;
        state.isLoading = false;
      })
      .addCase(DESTROY.pending, (state) => {
        state.isLoading = true;
        state.isSuccess = false;
        state.message = "";
      })
      .addCase(DESTROY.fulfilled, (state, action) => {
        const { success, payload } = action.payload;
        const index = state.collections.findIndex((item) => item?._id === payload);
        const fIndex = state.filtered.findIndex((item) => item._id === payload);
        if (index !== -1) state.collections.splice(index, 1);
        if (fIndex !== -1) state.filtered.splice(fIndex, 1);
        state.message = success;
        state.isSuccess = true;
        state.isLoading = false;
      })
      .addCase(DESTROY.rejected, (state, action) => {
        state.message = action.payload;
        state.isLoading = false;
      });
  },
});

export const {
  SetCREATE,
  SetEDIT,
  SetFILTER,
  SetPAGE,
  SetMaxPage,
  SetActivePAGE,
  TOGGLE,
  RESET,
  SetMONTH,
  ResetDATE,
  setYear,
  SetActiveDATE,
  SetActiveEmployee,
} = reduxSlice.actions;

export default reduxSlice.reducer;
