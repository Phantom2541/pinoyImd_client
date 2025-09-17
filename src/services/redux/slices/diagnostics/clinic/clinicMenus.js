import { createSlice, createAsyncThunk } from "@reduxjs/toolkit";
import { axioKit } from "../../../../utilities";

const url = "/diagnostics/clinic/menus";

// Fetch clinic menus
export const BROWSE = createAsyncThunk(
  "clinicMenus/browse",
  async ({ token, key }, thunkAPI) => {
    try {
      const { data } = await axioKit(token).get(url, { params: key });
      return data;
    } catch (err) {
      return thunkAPI.rejectWithValue(
        err.response?.data?.message || "Failed to fetch clinic menus"
      );
    }
  }
);

// Save new menu
export const SAVE = createAsyncThunk(
  "clinicMenus/save",
  async ({ data, token }, thunkAPI) => {
    try {
      const res = await axioKit(token).post(url, data);
      return res.data;
    } catch (err) {
      return thunkAPI.rejectWithValue(
        err.response?.data?.message || "Failed to save clinic menu"
      );
    }
  }
);

// Update menu
export const UPDATE = createAsyncThunk(
  "clinicMenus/update",
  async ({ data, token }, thunkAPI) => {
    try {
      const res = await axioKit(token).put(`${url}/${data._id}`, data);
      return res.data;
    } catch (err) {
      return thunkAPI.rejectWithValue(
        err.response?.data?.message || "Failed to update clinic menu"
      );
    }
  }
);

// Delete menu
export const DESTROY = createAsyncThunk(
  "clinicMenus/destroy",
  async ({ id, token }, thunkAPI) => {
    try {
      await axioKit(token).delete(`${url}/${id}`);
      return id;
    } catch (err) {
      return thunkAPI.rejectWithValue(
        err.response?.data?.message || "Failed to delete clinic menu"
      );
    }
  }
);

const clinicMenusSlice = createSlice({
  name: "clinicMenus",
  initialState: {
    collections: [],
    filtered: [],
    activePage: 1,
    maxPage: 10,
    message: "",
    isSuccess: false,
    isLoading: false,
    show: false,
    selected: null,
    willCreate: false,
  },
  reducers: {
    SetFILTERED: (state, { payload }) => {
      state.filtered = payload;
    },
    RESET: (state) => {
      state.message = "";
      state.isSuccess = false;
    },
    toggleModal: (state, { payload }) => {
      state.show = !state.show;
      state.selected = payload?.selected || null;
      state.willCreate = payload?.willCreate || false;
    },
    setActivePage: (state, { payload }) => {
      state.activePage = payload;
    },
  },
  extraReducers: (builder) => {
    builder
      .addCase(BROWSE.pending, (state) => {
        state.isLoading = true;
      })
      .addCase(BROWSE.fulfilled, (state, { payload }) => {
        state.isLoading = false;
        state.isSuccess = true;
        state.collections = payload || [];
        state.filtered = payload || [];
      })
      .addCase(BROWSE.rejected, (state, { payload }) => {
        state.isLoading = false;
        state.message = payload || "Failed to fetch clinic menus";
      })
      .addCase(SAVE.fulfilled, (state, { payload }) => {
        state.collections.unshift(payload);
        state.filtered.unshift(payload);
        state.isSuccess = true;
      })
      .addCase(UPDATE.fulfilled, (state, { payload }) => {
        state.collections = state.collections.map((item) =>
          item._id === payload._id ? payload : item
        );
        state.filtered = state.filtered.map((item) =>
          item._id === payload._id ? payload : item
        );
        state.isSuccess = true;
      })
      .addCase(DESTROY.fulfilled, (state, { payload }) => {
        state.collections = state.collections.filter(
          (item) => item._id !== payload
        );
        state.filtered = state.filtered.filter((item) => item._id !== payload);
        state.isSuccess = true;
      });
  },
});

export const { SetFILTERED, RESET, toggleModal, setActivePage } =
  clinicMenusSlice.actions;
export default clinicMenusSlice.reducer;
