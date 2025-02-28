import { createSlice, createAsyncThunk } from "@reduxjs/toolkit";
import { axioKit } from "../../../utilities";

const name = "assets/providers";

const initialState = {
  collections: [],
  isSuccess: false,
  isLoading: false,
  message: "",
  selected: {},
  totalPages: 0,
  page: 0,
  showModal: false,
  willCreate: false,
  maxPage: 5,
};

export const OUTSOURCE = createAsyncThunk(
  `${name}/outsource`,
  async ({ key, token }, thunkAPI) => {
    try {
      return await axioKit.universal(`${name}/outsource`, token, key);
    } catch (error) {
      return thunkAPI.rejectWithValue(
        error.response?.data?.message || error.message || error.toString()
      );
    }
  }
);

export const INSOURCE = createAsyncThunk(
  `${name}/insource`,
  async ({ key, token }, thunkAPI) => {
    try {
      return await axioKit.universal(`${name}/insource`, token, key);
    } catch (error) {
      return thunkAPI.rejectWithValue(
        error.response?.data?.message || error.message || error.toString()
      );
    }
  }
);

export const TIEUPS = createAsyncThunk(
  `${name}/tieups`,
  async ({ token, key }, thunkAPI) => {
    try {
      return await axioKit.universal(`${name}/tieups`, token, key);
    } catch (error) {
      return thunkAPI.rejectWithValue(
        error.response?.data?.message || error.message || error.toString()
      );
    }
  }
);

export const LIST = createAsyncThunk(
  `${name}/list`,
  async (token, thunkAPI) => {
    try {
      return await axioKit.universal(`${name}/list`, token);
    } catch (error) {
      return thunkAPI.rejectWithValue(
        error.response?.data?.message || error.message || error.toString()
      );
    }
  }
);

export const SAVE = createAsyncThunk(`${name}/save`, async (form, thunkAPI) => {
  try {
    return await axioKit.save(name, form.data, form.token);
  } catch (error) {
    return thunkAPI.rejectWithValue(
      error.response?.data?.message || error.message || error.toString()
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
        error.response?.data?.message || error.message || error.toString()
      );
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
      .addCase(OUTSOURCE.pending, (state) => {
        state.isLoading = true;
      })
      .addCase(OUTSOURCE.fulfilled, (state, { payload }) => {
        state.collections = payload;
        state.isLoading = false;
      })
      .addCase(OUTSOURCE.rejected, (state, { payload }) => {
        state.message = payload;
        state.isLoading = false;
      })
      .addCase(TIEUPS.pending, (state) => {
        state.isLoading = true;
      })
      .addCase(TIEUPS.fulfilled, (state, { payload }) => {
        state.collections = payload;
        state.isLoading = false;
      })
      .addCase(TIEUPS.rejected, (state, { payload }) => {
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
      });
  },
});

export const { SetEDIT, SetCREATE, SetFILTER, SetPAGE, SETSOURCES, RESET } =
  reduxSlice.actions;
export default reduxSlice.reducer;
