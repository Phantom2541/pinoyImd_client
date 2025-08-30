import { createSlice, createAsyncThunk } from "@reduxjs/toolkit";
import { axioKit } from "../../utilities";

const url = "Tracker";

const initialState = {
  tracker: {},
  isSuccess: false,
  isLoading: false,
};

export const BROWSE = createAsyncThunk(
  `${url}`,
  async ({ token, params }, thunkAPI) => {
    try {
      const response = await axioKit.universal(`${url}/browse`, token, params);
      return { payload: response, query: params }; // ensure query is included
    } catch (error) {
      const message =
        error.response?.data?.message || error.message || error.toString();
      return thunkAPI.rejectWithValue(message);
    }
  }
);

export const UPDATE = createAsyncThunk(
  `tracker/${url}/update`,
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

export const reduxSlice = createSlice({
  name: `tracker`,
  initialState,
  reducers: {
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
        state.tracker = action.payload;
        state.isLoading = false;
      })

      .addCase(BROWSE.rejected, (state, action) => {
        state.message = action.error.message;
        state.isLoading = false;
      })
      .addCase(UPDATE.pending, (state) => {
        state.isLoading = true;
        state.isSuccess = false;
        state.message = "";
      })
      .addCase(UPDATE.fulfilled, (state, action) => {
        state.tracker = action.payload;
        state.isLoading = false;
      })

      .addCase(UPDATE.rejected, (state, action) => {
        state.message = action.error.message;
        state.isLoading = false;
      });
  },
});

export const { RESET } = reduxSlice.actions;

export default reduxSlice.reducer;
