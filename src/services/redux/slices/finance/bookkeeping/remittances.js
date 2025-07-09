import { createSlice, createAsyncThunk } from "@reduxjs/toolkit";
import { axioKit } from "../../../../utilities";

const url = "finance/bookkeeping/remittances";
const today = new Date();

const initialState = {
  collections: [],
  selected: {},
  deals: [],
  day: 1,
  month: today.getMonth() + 1,
  year: today.getFullYear(),
  title: "",
  onPrint: false,
  showModal: false,
  showCensus: false,
  formSubmitted: false,
  isSuccess: false,
  isLoading: false,
  message: "",
  description: "",
};

export const BROWSE = createAsyncThunk(
  `${url}/browse`,
  ({ token, key }, thunkAPI) => {
    try {
      return axioKit.universal(`${url}/browse`, token, key);
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
export const CENSUS = createAsyncThunk(
  `${url}/census`,
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
export const AUTOSELECT = createAsyncThunk(
  `${url}/autoSelect`,
  ({ token, key }, thunkAPI) => {
    try {
      return axioKit.universal(`${url}/autoSelect`, token, key);
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
    SetLEDGER: (state, { payload }) => {
      const index = state.collections.findIndex(
        ({ _id }) => _id === payload._id
      );
      const oldRemittance = { ...state.collections[index] };
      state.collections[index] = { ...oldRemittance, ...payload };
    },
    SetSELECTED: (state, { payload }) => {
      const { key, value, deals } = payload;
      if (key === "census") {
        state.deals = deals;
        state.showCensus = true;
      } else if (key === "close") {
        state.showModal = true;
        state.title = "Closing Cash Register";
      } else if (key === "remit") {
        state.showModal = true;
      }
      state.selected = value;
    },
    SetActiveDATE: (state, { payload }) => {
      state.day = payload;
    },
    TOGGLE: (state, { payload = {} }) => {
      const { key, value, description = "" } = payload;
      if (key === "closed") {
        state.showModal = !state.showModal;
        state.description = "";
      } else {
        if (key === "census") {
          state.showCensus = !state.showCensus;
          return;
        }
        // state.showModal = !state.showModal;
        if (value) {
          state.title =
            key === "open" ? "Floating Cash" : "Closing Cash Register";
          state.day = value;
          state.showModal = true;
          state.description = description;
        }
      }
    },

    RESET: (state) => {
      state.isSuccess = false;
      state.message = "";
    },
    ResetDATE: (state) => {
      state.month = today.getMonth() + 1;
      state.year = today.getFullYear();
    },
    SetPrinting: (state, { payload }) => {
      const { status } = payload;
      state.onPrint = status;
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
        state.collections = payload;
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
        const { success, data } = action.payload;
        state.message = success;
        state.collections.unshift(data);
        state.selected = data;
        state.showModal = false;
        state.isSuccess = true;
        state.formSubmitted = false;
        localStorage.setItem("floatingcash", JSON.stringify(data));
      })
      .addCase(SAVE.rejected, (state, action) => {
        const { error } = action;
        state.message = error.message;
        state.formSubmitted = false;
      })
      .addCase(AUTOSELECT.pending, (state) => {
        state.isLoading = true;
        state.isSuccess = false;
        state.message = "";
      })
      .addCase(AUTOSELECT.fulfilled, (state, { payload }) => {
        const { data } = payload;
        state.selected = data;
        state.isSuccess = true;
        state.isLoading = false;
      })
      .addCase(AUTOSELECT.rejected, (state, action) => {
        const { error } = action;
        state.message = error.message;
        state.isLoading = false;
      })

      .addCase(CENSUS.pending, (state) => {
        state.formSubmitted = true;
        state.isSuccess = false;
        state.message = "";
      })
      .addCase(CENSUS.fulfilled, (state, action) => {
        const { success, payload } = action.payload;
        const index = state.collections.findIndex(
          ({ _id }) => _id === payload._id
        );
        state.collections[index] = {
          ...state.collections[index],
          ...payload,
        };
        state.selected = payload;
        state.message = success;
        state.isSuccess = true;
        state.formSubmitted = false;
      })
      .addCase(CENSUS.rejected, (state, action) => {
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
        const { payload } = action.payload;
        const index = state.collections.findIndex(
          (item) => item?._id === payload._id
        );
        state.collections[index] = { ...payload, ...state.collections[index] };
        state.message = "Remittance Successfully Updated";
        state.isSuccess = true;
        state.formSubmitted = false;
        //  printing remittances
        state.selected = payload;
      })
      .addCase(UPDATE.rejected, (state, action) => {
        const { error } = action;
        state.message = error.message;
        state.formSubmitted = false;
      });
  },
});

export const {
  SetMONTH,
  SetYEAR,
  TOGGLE,
  SetSELECTED,
  ResetDATE,
  SetActiveDATE,
  RESET,
  SetLEDGER,
  SetPrinting,
} = reduxSlice.actions;

export default reduxSlice.reducer;
