import { createSlice, createAsyncThunk } from "@reduxjs/toolkit";
import { axioKit } from "../../../../utilities";

const url = "/diagnostics/laboratory/monitoring/temperatures";
const today = new Date();

const initialState = {
  collections: [],
  selected: {},
  month: new Date().getMonth() + 1, // Month as a number (1-12)
  year: new Date().getFullYear(),
  isSuccess: false,
  formSubmitted: false,
  isLoading: false,
  message: "",
  // pagination
  maxPage: 0,
  activePage: 1,
};

export const BROWSE = createAsyncThunk(
  `${url}/browse`,
  async ({ token, data }, thunkAPI) => {
    try {
      const response = await axioKit.universal(`${url}/browse`, token, data);
      // console.log("API Response:", response);
      return response || []; // Ensure default array
    } catch (error) {
      console.error("API Fetch Error:", error);
      return thunkAPI.rejectWithValue(error.message || error.toString());
    }
  }
);

export const SEARCH = createAsyncThunk(
  `${url}/search`,
  async ({ token, companyId }, thunkAPI) => {
    try {
      return await axioKit.universal(`${url}/search`, token, { companyId });
    } catch (error) {
      return thunkAPI.rejectWithValue(error.message || error.toString());
    }
  }
);

export const SAVE = createAsyncThunk(
  `${url}/save`,
  async ({ data, token }, thunkAPI) => {
    try {
      return await axioKit.save(url, data, token);
    } catch (error) {
      return thunkAPI.rejectWithValue(error.message || error.toString());
    }
  }
);

export const UPDATE = createAsyncThunk(
  `${url}/update`,
  async ({ data, token }, thunkAPI) => {
    try {
      return await axioKit.update(url, data, token);
    } catch (error) {
      return thunkAPI.rejectWithValue(error.message || error.toString());
    }
  }
);

export const DESTROY = createAsyncThunk(
  `${url}/destroy`,
  async ({ data, token }, thunkAPI) => {
    try {
      return await axioKit.destroy(url, data, token);
    } catch (error) {
      return thunkAPI.rejectWithValue(error.message || error.toString());
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
    ResetDATE: (state) => {
      state.month = today.getMonth() + 1;
      state.year = today.getFullYear();
    },
    setYear: (state, action) => {
      state.year = Number(action.payload);
    },
    SetSelected: (state, { payload }) => {
      state.selected = payload;
    },
    /**
     *  for PAGINATION
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
  },
  extraReducers: (builder) => {
    builder
      .addCase(BROWSE.pending, (state) => {
        state.isLoading = true;
        state.isSuccess = false;
        state.message = "";
      })
      .addCase(BROWSE.fulfilled, (state, action) => {
        // console.log("payload: ", action.payload);
        state.collections = action.payload.data;
        state.isLoading = false;
      })
      .addCase(BROWSE.rejected, (state, action) => {
        state.message = action.error.message;
        state.isLoading = false;
      })
      .addCase(SEARCH.pending, (state) => {
        state.isLoading = true;
        state.isSuccess = false;
        state.message = "";
      })
      .addCase(SEARCH.fulfilled, (state, action) => {
        state.collections = action.payload;
        state.isLoading = false;
      })
      .addCase(SEARCH.rejected, (state, action) => {
        state.message = action.error.message;
        state.isLoading = false;
      })
      .addCase(SAVE.pending, (state) => {
        state.formSubmitted = true;
        state.message = "";
      })
      .addCase(SAVE.fulfilled, (state, action) => {
        state.message = action?.success;
        state.collections.unshift(action.payload);
        state.isSuccess = true;
        state.formSubmitted = false;
      })
      .addCase(SAVE.rejected, (state, action) => {
        state.message = action.error.message;
        state.isLoading = false;
      })
      .addCase(UPDATE.pending, (state) => {
        state.formSubmitted = true;
        state.isSuccess = false;
        state.message = "";
      })
      .addCase(UPDATE.fulfilled, (state, action) => {
        const index = state.collections.findIndex(
          (item) => item._id === action.payload._id
        );
        state.collections[index] = action.payload;
        state.message = action.success;
        state.isSuccess = true;
        state.formSubmitted = false;
      })
      .addCase(UPDATE.rejected, (state, action) => {
        state.message = action.error.message;
        state.formSubmitted = false;
      })
      .addCase(DESTROY.pending, (state) => {
        state.isLoading = true;
        state.isSuccess = false;
        state.message = "";
      })
      .addCase(DESTROY.fulfilled, (state, action) => {
        const { success, payload } = action.payload;
        const index = state.collections.findIndex(
          (item) => item._id === payload
        );
        state.collections.splice(index, 1);
        state.message = success;
        state.isSuccess = true;
        state.isLoading = false;
      })
      .addCase(DESTROY.rejected, (state, action) => {
        state.message = action.error.message;
        state.isLoading = false;
      });
  },
});

export const {
  RESET,
  SetMONTH,
  setYear,
  SetSelected,
  SetMaxPage,
  SetActivePAGE,
  ResetDATE,
} = reduxSlice.actions;
export default reduxSlice.reducer;
