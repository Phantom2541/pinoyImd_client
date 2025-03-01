import { createSlice, createAsyncThunk } from "@reduxjs/toolkit";
import { axioKit } from "../../../utilities";

const name = "liability/controls";

const initialState = {
  collections: [], // incase one query only
  filter: [], // filtered on collection to eliminate server load
  paginated: [], // paginated the filtered
  isSuccess: false,
  isLoading: false,
  message: "",
  // for BREAD
  selected: {},
  totalPages: 0,
  page: 0,
  showModal: false,
  willCreate: false,
  maxPage: 5, // Default value, computed dynamically when needed
};

// Async thunks
export const BROWSE = createAsyncThunk(
  `${name}/browse`,
  async ({ token, params }, thunkAPI) => {
    try {
      return await axioKit.universal(`${name}/browse`, token, params);
    } catch (error) {
      return thunkAPI.rejectWithValue(
        error.response?.data?.message || error.message
      );
    }
  }
);

export const SAVE = createAsyncThunk(`${name}/save`, async (form, thunkAPI) => {
  try {
    return await axioKit.save(name, form.data, form.token);
  } catch (error) {
    return thunkAPI.rejectWithValue(
      error.response?.data?.message || error.message
    );
  }
});

export const UPDATE = createAsyncThunk(
  `${name}/update`,
  async (form, thunkAPI) => {
    try {
      return await axioKit.update(name, form.data, form.token);
    } catch (error) {
      return thunkAPI.rejectWithValue(
        error.response?.data?.message || error.message
      );
    }
  }
);

export const DESTROY = createAsyncThunk(
  `${name}/destroy`,
  async ({ data, token }, thunkAPI) => {
    try {
      return await axioKit.destroy(name, data, token);
    } catch (error) {
      return thunkAPI.rejectWithValue(
        error.response?.data?.message || error.message
      );
    }
  }
);

// Redux slice
export const reduxSlice = createSlice({
  name,
  initialState,
  reducers: {
    SetEDIT: (state, { payload }) => {
      state.selected = payload;
      state.willCreate = false;
      state.showModal = true;
    },
    SetCREATE: (state, { payload }) => {
      state.selected = payload;
      state.willCreate = true;
      state.showModal = true;
    },
    SetFILTER: (state, { payload }) => {
      const { page, maxPage } = payload;
      if (page.length > 0) {
        state.totalPages = Math.ceil(payload.length / maxPage);
        if (state.page > state.totalPages) {
          state.page = state.totalPages;
        }
      }
      state.filter = page;
    },
    SetPAGE: (state, { payload }) => {
      state.page = payload;
    },
    RESET: (state) => {
      state.isSuccess = false;
      state.message = "";
    },
  },
  extraReducers: (builder) => {
    builder
      // BROWSE
      .addCase(BROWSE.pending, (state) => {
        state.isLoading = true;
      })
      .addCase(BROWSE.fulfilled, (state, { payload }) => {
        state.collections = payload;
        state.filter = payload;
        state.paginated = payload;
        state.isSuccess = true;
        state.isLoading = false;
      })
      .addCase(BROWSE.rejected, (state, { payload }) => {
        state.message = payload;
        state.isLoading = false;
      })

      // SAVE
      .addCase(SAVE.pending, (state) => {
        state.isLoading = true;
      })
      .addCase(SAVE.fulfilled, (state, { payload }) => {
        state.collections.unshift(payload);
        state.showModal = false;
        state.isSuccess = true;
        state.isLoading = false;
      })
      .addCase(SAVE.rejected, (state, { payload }) => {
        state.message = payload;
        state.isLoading = false;
      })

      // UPDATE
      .addCase(UPDATE.pending, (state) => {
        state.isLoading = true;
      })
      .addCase(UPDATE.fulfilled, (state, { payload }) => {
        const index = state.collections.findIndex(
          (item) => item._id === payload._id
        );
        if (index !== -1) {
          state.collections[index] = payload;
        }
        state.showModal = false;
        state.isSuccess = true;
        state.isLoading = false;
      })
      .addCase(UPDATE.rejected, (state, { payload }) => {
        state.message = payload;
        state.isLoading = false;
      })

      // DESTROY
      .addCase(DESTROY.pending, (state) => {
        state.isLoading = true;
      })
      .addCase(DESTROY.fulfilled, (state, { payload }) => {
        state.collections = state.collections.filter(
          (item) => item._id !== payload
        );
        state.isSuccess = true;
        state.isLoading = false;
      })
      .addCase(DESTROY.rejected, (state, { payload }) => {
        state.message = payload;
        state.isLoading = false;
      });
  },
});

// Export actions and reducer
export const { SetCREATE, SetEDIT, SetFILTER, SetPAGE, RESET } =
  reduxSlice.actions;
export default reduxSlice.reducer;
