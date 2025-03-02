import { createSlice, createAsyncThunk } from "@reduxjs/toolkit";
import { axioKit } from "../../../utilities";

const name = "liability/assurance";

const initialState = {
  collections: [],
  filter: [],
  paginated: [],
  isSuccess: false,
  isLoading: false,
  message: "",

  // Bread attributes
  selected: {}, // assurance
  totalPages: 0,
  page: 0,
  showModal: false,
  willCreate: false,
  maxPage: 5,
};

export const BROWSE = createAsyncThunk(
  `${name}`,
  ({ token, params }, thunkAPI) => {
    try {
      return axioKit.universal(`${name}/browse`, token, params);
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

export const SAVE = createAsyncThunk(`${name}/save`, (form, thunkAPI) => {
  try {
    return axioKit.save(name, form.data, form.token);
  } catch (error) {
    const message =
      (error.response && error.response.data && error.response.data.message) ||
      error.message ||
      error.toString();

    return thunkAPI.rejectWithValue(message);
  }
});

export const UPDATE = createAsyncThunk(`${name}/update`, (form, thunkAPI) => {
  try {
    return axioKit.update(name, form.data, form.token);
  } catch (error) {
    const message =
      (error.response && error.response.data && error.response.data.message) ||
      error.message ||
      error.toString();

    return thunkAPI.rejectWithValue(message);
  }
});

export const DESTROY = createAsyncThunk(
  `${name}/destroy`,
  ({ data, token }, thunkAPI) => {
    try {
      return axioKit.destroy(name, data, token);
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
      const { page, maxPage } = state;
      if (payload.length > 0) {
        let totalPages = Math.floor(payload.length / maxPage);
        if (payload.length % maxPage > 0) totalPages += 1;
        state.totalPages = totalPages;
        if (page > totalPages) {
          state.page = totalPages;
        }
      }
      state.filter = payload;
    },
    SetPagination: (state) => {
      // {
      //   payload;
      // }getPage
      const { page, max } = state;
      // if (getPage) return array;

      state.paginated = state.filter.slice(
        (page - 1) * max,
        max + (page - 1) * max
      );
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
      .addCase(BROWSE.pending, (state) => {
        state.isLoading = true;
        state.isSuccess = false;
        state.message = "";
      })
      .addCase(BROWSE.fulfilled, (state, action) => {
        const { payload } = action;
        state.collections = payload;
        state.filter = payload;
        state.paginated = payload;
        state.isSuccess = true;
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
        const { success, payload } = action;
        state.message = success;
        state.collections.unshift(payload);
        state.showModal = false;
        state.isSuccess = true;
        state.isLoading = false;
      })
      .addCase(SAVE.rejected, (state, action) => {
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
          (item) => item._id === payload._id
        );

        state.collections[index] = payload;
        state.showModal = false;
        state.message = success;
        state.isSuccess = true;
        state.isLoading = false;
      })
      .addCase(UPDATE.rejected, (state, action) => {
        const { error } = action;
        state.message = error.message;
        state.isLoading = false;
      })
      .addCase(DESTROY.pending, (state) => {
        state.isLoading = true;
        state.isSuccess = false;
        state.message = "";
      })
      .addCase(DESTROY.fulfilled, (state, action) => {
        const { success } = action;
        const index = state.collections.findIndex(
          (item) => item?._id === action.payload
        );
        state.collections.splice(index, 1);
        state.message = success;
        state.isSuccess = true;
        state.isLoading = false;
      })
      .addCase(DESTROY.rejected, (state, action) => {
        const { error } = action;
        state.message = error.message;
        state.isLoading = false;
      });
  },
});

export const { SetCREATE, SetEDIT, SetFILTER, SetPAGE, RESET } =
  reduxSlice.actions;

export default reduxSlice.reducer;
