import { createSlice, createAsyncThunk } from "@reduxjs/toolkit";
import { axioKit } from "../../../utilities";

const url = "monitorings/temperatures";

const initialState = {
  month: new Date().getMonth() + 1, // Month as a number (1-12)
  year: new Date().getFullYear(),
  collections: [],
  isSuccess: false,
  isLoading: false,
  message: "",
};

export const BROWSE = createAsyncThunk(
  `${url}/browse`,
  async ({ token, key }, thunkAPI) => {
    try {
      console.log("📡 Calling API with key:", key);
      const response = await axioKit.universal(`${url}/browse`, token, key);

      // Check kung ano ang structure ng response
      console.log("✅ Raw API Response:", response);

      if (!response || response.length === 0) {
        console.warn("⚠️ Warning: No data received from API");
      }

      return response || []; // Ensure collections is always an array
    } catch (error) {
      console.error("❌ API Fetch Error:", error);
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
        console.log("🔥 BROWSE.fulfilled: Fetched Data:", action.payload);

        if (!action.payload || action.payload.length === 0) {
          console.warn("⚠️ Warning: collections array is empty!");
        }

        state.collections = action.payload || []; // Ensure it's always an array
        state.isLoading = false;
      })

      .addCase(BROWSE.rejected, (state, action) => {
        console.error("BROWSE Fetch Failed:", action.error.message);
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
