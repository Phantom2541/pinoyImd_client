import { createSlice, createAsyncThunk } from "@reduxjs/toolkit";
import { axioKit } from "../../../utilities";

const name = "monitorings/temperatures";

const initialState = {
  month: new Date().getMonth() + 1, // Month as a number (1-12)
  year: new Date().getFullYear(),
  collections: [],
  isSuccess: false,
  isLoading: false,
  message: "",
};

export const BROWSE = createAsyncThunk(
  `${name}/browse`,
  async ({ token, key }, thunkAPI) => {
    try {
      return await axioKit.universal(`${name}/browse`, token, key);
    } catch (error) {
      return thunkAPI.rejectWithValue(error.message || error.toString());
    }
  }
);

export const SEARCH = createAsyncThunk(
  `${name}/search`,
  async ({ token, companyId }, thunkAPI) => {
    try {
      return await axioKit.universal(`${name}/search`, token, { companyId });
    } catch (error) {
      return thunkAPI.rejectWithValue(error.message || error.toString());
    }
  }
);

export const SAVE = createAsyncThunk(
  `${name}/save`,
  async ({ data, token }, thunkAPI) => {
    try {
      return await axioKit.save(name, data, token);
    } catch (error) {
      return thunkAPI.rejectWithValue(error.message || error.toString());
    }
  }
);

export const UPDATE = createAsyncThunk(
  `${name}/update`,
  async ({ data, token }, thunkAPI) => {
    try {
      return await axioKit.update(name, data, token);
    } catch (error) {
      return thunkAPI.rejectWithValue(error.message || error.toString());
    }
  }
);

export const DESTROY = createAsyncThunk(
  `${name}/destroy`,
  async ({ data, token }, thunkAPI) => {
    try {
      return await axioKit.destroy(name, data, token);
    } catch (error) {
      return thunkAPI.rejectWithValue(error.message || error.toString());
    }
  }
);

export const reduxSlice = createSlice({
  name,
  initialState,
  reducers: {
    setMonth: (state, action) => {
      state.month = Number(action.payload);
    },
    setYear: (state, action) => {
      state.year = Number(action.payload);
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
      .addCase(BROWSE.fulfilled, (state, action) => {
        state.collections = action.payload;
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
        state.isLoading = true;
        state.isSuccess = false;
        state.message = "";
      })
      .addCase(SAVE.fulfilled, (state, action) => {
        state.message = action?.success;
        state.collections.unshift(action.payload);
        state.isSuccess = true;
        state.isLoading = false;
      })
      .addCase(SAVE.rejected, (state, action) => {
        state.message = action.error.message;
        state.isLoading = false;
      })
      .addCase(UPDATE.pending, (state) => {
        state.isLoading = true;
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
        state.isLoading = false;
      })
      .addCase(UPDATE.rejected, (state, action) => {
        state.message = action.error.message;
        state.isLoading = false;
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

export const { RESET, setMonth, setYear } = reduxSlice.actions;
export default reduxSlice.reducer;
