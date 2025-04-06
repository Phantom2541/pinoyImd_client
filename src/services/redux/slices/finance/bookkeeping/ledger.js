import { createSlice, createAsyncThunk } from "@reduxjs/toolkit";
import { axioKit } from "../../../../utilities";

const url = "finance/bookkeeping/ledgers";
const today = new Date();

const initialState = {
  collections: [],
  selected: {},
  day: 1,
  month: today.getMonth() + 1,
  year: today.getFullYear(),
  title: "",
  showModal: false,
  showCensus: false,
  isSuccess: false,
  isLoading: false,
  message: "",
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

export const LEDGER = createAsyncThunk(
  `${url}/leddger`,
  ({ data, token }, thunkAPI) => {
    try {
      return axioKit.save(url, data, token, "ledger");
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
      console.log("SetMONTH payload", payload);
      state.month = payload;
    },
    SetYEAR: (state, { payload }) => {
      console.log("SetYEAR payload", payload);
      state.year = payload;
    },

    SetActiveDATE: (state, { payload }) => {
      state.day = payload;
    },
    TOGGLE: (state, { payload = {} }) => {
      const { key, value } = payload;
      if (key === "census") {
        state.showCensus = !state.showCensus;
        return;
      }
      state.showModal = !state.showModal;

      if (value) {
        state.title =
          key === "open" ? "Floating Cash" : "Closing Cash Register";
        state.day = value;
        state.showModal = true;
      }
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
        state.collections = payload;
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
        const { success, data } = action.payload;

        state.message = success;
        state.collections.unshift(data);
        state.selected = data;
        state.showModal = false;
        state.isSuccess = true;
        state.isLoading = false;
      })
      .addCase(SAVE.rejected, (state, action) => {
        const { error } = action;
        state.message = error.message;
        state.isLoading = false;
      })
      .addCase(AUTOSELECT.pending, (state) => {
        state.isLoading = true;
        state.isSuccess = false;
        state.message = "";
      })
      .addCase(AUTOSELECT.fulfilled, (state, action) => {
        const { payload } = action.payload;
        state.selected = payload;
        state.isSuccess = true;
        state.isLoading = false;
      })
      .addCase(AUTOSELECT.rejected, (state, action) => {
        const { error } = action;
        state.message = error.message;
        state.isLoading = false;
      })

      .addCase(CENSUS.pending, (state) => {
        state.isLoading = true;
        state.isSuccess = false;
        state.message = "";
      })
      .addCase(CENSUS.fulfilled, (state, action) => {
        const { success, payload } = action.payload;
        state.selected = payload;
        state.message = success;
        state.isSuccess = true;
        state.isLoading = false;
      })
      .addCase(CENSUS.rejected, (state, action) => {
        const { error } = action;
        state.message = error.message;
        state.isLoading = false;
      })
      .addCase(UPDATE.pending, (state) => {
        state.isLoading = true;
        state.isSuccess = false;
        state.message = "";
      })
      .addCase(UPDATE.fulfilled, (state, action) => {
        const { success, payload } = action;
        const index = state.collections.findIndex(
          (item) => item?._id === payload._id
        );

        state.collections[index] = payload;
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

export const { SetMONTH, SetYEAR, TOGGLE, SetActiveDATE, RESET } =
  reduxSlice.actions;

export default reduxSlice.reducer;
