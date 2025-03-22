import { createSlice, createAsyncThunk } from "@reduxjs/toolkit";
import { axioKit } from "../../../../utilities";
import { Statements } from "../../../../fakeDb";
const url = "finance/journals/payments";

const initialState = {
  collections: [],
  filtered: [],
  isSuccess: false,
  isLoading: false,
  paginated: [], // paginated the filtered

  selected: {},
  totalPages: 0,
  page: 0,
  showModal: false,
  willCreate: false,
  maxPage: 5,
};

export const BROWSE = createAsyncThunk(
  `${url}/browse`,
  async ({ token, key }, thunkAPI) => {
    try {
      return await axioKit.universal(`${url}/browse`, token, key);
    } catch (error) {
      return thunkAPI.rejectWithValue(
        error.response?.data?.message || error.message || error.toString()
      );
    }
  }
);

export const LIST = createAsyncThunk(`${url}/list`, async (token, thunkAPI) => {
  try {
    return await axioKit.universal(`${url}/list`, token);
  } catch (error) {
    return thunkAPI.rejectWithValue(
      error.response?.data?.message || error.message || error.toString()
    );
  }
});

export const SAVE = createAsyncThunk(`${url}/save`, async (form, thunkAPI) => {
  try {
    return await axioKit.save(url, form.data, form.token);
  } catch (error) {
    return thunkAPI.rejectWithValue(
      error.response?.data?.message || error.message || error.toString()
    );
  }
});

export const UPDATE = createAsyncThunk(
  `${url}/update`,
  async (form, thunkAPI) => {
    try {
      return await axioKit.update(url, form.data, form.token);
    } catch (error) {
      return thunkAPI.rejectWithValue(
        error.response?.data?.message || error.message || error.toString()
      );
    }
  }
);

export const Daily = createAsyncThunk(
  `${url}/daily`,
  async ({ token, key }, thunkAPI) => {
    try {
      return await axioKit.universal(`${url}/daily`, token, key);
    } catch (error) {
      return thunkAPI.rejectWithValue(
        error.response?.data?.message || error.message || error.toString()
      );
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
    SetFILTERByCategories: (state, { payload }) => {
      const categoryId = Statements.getAllIdByCategory(payload);
      // console.log("categoryId:", categoryId);

      const collections = JSON.stringify(state.collections, null, 2);
      const filtered = JSON.parse(collections).filter(({ fsId }) =>
        categoryId.includes(fsId)
      );
      // console.log("filtered:", filtered);
      state.filtered = filtered;
    },
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
      state.filtered = page;
    },
    SetPAGE: (state, { payload }) => {
      state.page = payload;
    },
    SETSOURCES: (state, { payload }) => {
      state.collections = payload;
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
      })

      .addCase(BROWSE.fulfilled, (state, { payload }) => {
        state.collections = payload;
        state.filtered = payload;
        state.isLoading = false;
      })

      .addCase(BROWSE.rejected, (state, { payload }) => {
        state.message = payload;
        state.isLoading = false;
      })

      .addCase(LIST.pending, (state) => {
        state.isLoading = true;
      })
      .addCase(LIST.fulfilled, (state, { payload }) => {
        state.collections = payload;
        state.isLoading = false;
      })
      .addCase(LIST.rejected, (state, { payload }) => {
        state.message = payload;
        state.isLoading = false;
      })
      .addCase(SAVE.pending, (state) => {
        state.isLoading = true;
      })
      .addCase(SAVE.fulfilled, (state, { payload }) => {
        state.collections.unshift(payload);
        state.isSuccess = true;
        state.isLoading = false;
      })
      .addCase(SAVE.rejected, (state, { payload }) => {
        state.message = payload;
        state.isLoading = false;
      })

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
        state.isSuccess = true;
        state.isLoading = false;
      })
      .addCase(UPDATE.rejected, (state, { payload }) => {
        state.message = payload;
        state.isLoading = false;
      })
      .addCase(Daily.pending, (state) => {
        state.isLoading = true;
      })

      .addCase(Daily.fulfilled, (state, { payload }) => {
        state.filtered = payload;
        state.isLoading = false;
      })

      .addCase(Daily.rejected, (state, { payload }) => {
        state.message = payload;
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
        const { error } = action;
        state.message = error.message;
        state.isLoading = false;
      });
  },
});

export const {
  SetEDIT,
  SetCREATE,
  SetFILTER,
  SetFILTERByCategories,
  SetPAGE,
  SETSOURCES,
  RESET,
} = reduxSlice.actions;
export default reduxSlice.reducer;
