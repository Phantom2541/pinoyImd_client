import { createSlice, createAsyncThunk } from "@reduxjs/toolkit";
import { axioKit } from "../../../../utilities";

const url = "finance/bookkeeping/duties";
const today = new Date();

const initialState = {
  collections: [],
  filtered: [],
  isFirstSched: today.getDate() <= 15,
  formSubmitted: false,
  didSearch: false,
  selected: {},
  page: 0,
  month: new Date().getMonth() + 1, // 0-based index (Jan = 0)
  year: new Date().getFullYear(),
  isSuccess: false,
  // main loading
  isLoading: false,
  // form loading
  isLoadingForm: false,
  willCreate: false,
  message: "",
  showModal: false,
  department: "LAB",
  /**
   * Footer
   */
  maxPage: 5,
  activePage: 1,
  totalPages: 0,
};

export const BROWSE = createAsyncThunk(
  `${url}/browse`,
  ({ token, params }, thunkAPI) => {
    try {
      return axioKit.universal(`${url}/browse`, token, params);
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
    SetFIRST_SCHED: (state, { payload }) => {
      const isFirstSched = payload === null ? state.isFirstSched : payload;
      const selected =
        state.collections.find((item) => item.isFirstSched === isFirstSched) ||
        {};

      state.selected = selected;
      state.isFirstSched = isFirstSched;
      if (!selected._id) {
        state.showModal = true;
      }
    },
    ResetDATE: (state) => {
      state.month = today.getMonth() + 1;
      state.year = today.getFullYear();
    },
    TOGGLE: (state) => {
      state.showModal = !state.showModal;
    },

    RESET: (state) => {
      state.isSuccess = false;
      state.isLoading = false;
      state.formSubmitted = false;
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
      .addCase(BROWSE.fulfilled, (state, action) => {
        state.collections = action.payload;
        state.isLoading = false;
      })
      .addCase(BROWSE.rejected, (state, action) => {
        const { error } = action;
        state.message = error.message;
        state.isLoading = false;
      })

      .addCase(SAVE.pending, (state) => {
        state.formSubmitted = true;
        state.isSuccess = false;
        state.message = "";
      })
      .addCase(SAVE.fulfilled, (state, action) => {
        const { success, payload } = action.payload;
        state.message = success;
        state.collections.unshift(payload);
        state.selected = payload;
        state.isSuccess = true;
        state.formSubmitted = false;
      })
      .addCase(SAVE.rejected, (state, action) => {
        const { error } = action;
        state.message = error.message;
        state.formSubmitted = false;
      })

      .addCase(UPDATE.pending, (state) => {
        state.formSubmitted = true;
        state.isSuccess = false;
        state.message = "";
      })
      .addCase(UPDATE.fulfilled, (state, action) => {
        const { success, payload } = action.payload;

        //       payload: {
        //   _id,
        //   sched: updatedBreakdown.sched,
        //   ro: updatedBreakdown.ro,
        //   breakdownID,
        // },
        const index = state.collections.findIndex(
          (item) => item._id === payload._id
        );
        const { breakdown = [], ...rest } = state.collections[index];
        const _breakdown = [...breakdown];
        const bIndex = _breakdown.findIndex(
          (item) => item._id === payload.breakdownID
        );
        _breakdown[bIndex] = {
          ..._breakdown[bIndex],
          sched: payload.sched,
          ro: payload.ro,
        };

        state.collections[index] = { ...rest, breakdown: _breakdown };
        if (state.selected._id === payload._id) {
          state.selected = { ...state.selected, breakdown: _breakdown };
        }

        state.message = success;
        state.isSuccess = true;
        state.formSubmitted = false;
      })
      .addCase(UPDATE.rejected, (state, action) => {
        const { error } = action;
        state.message = error.message;
        state.formSubmitted = false;
      })

      .addCase(DESTROY.pending, (state) => {
        state.isSuccess = false;
        state.message = "";
      })
      .addCase(DESTROY.fulfilled, (state, action) => {
        const { success, payload } = action.payload;
        const index = state.collections.findIndex(
          (item) => item._id === payload
        );
        const findex = state.filtered.findIndex((item) => item._id === payload);

        state.collections.splice(index, 1);
        state.filtered.splice(findex, 1);

        state.message = success;
        state.isSuccess = true;
      })
      .addCase(DESTROY.rejected, (state, action) => {
        const { error } = action;
        state.message = error.message;
        state.isLoading = false;
      });
  },
});

export const { SetFIRST_SCHED, TOGGLE, RESET, SetMONTH, ResetDATE } =
  reduxSlice.actions;

export default reduxSlice.reducer;
