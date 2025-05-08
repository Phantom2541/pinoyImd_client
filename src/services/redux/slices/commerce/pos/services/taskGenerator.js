import { createSlice, createAsyncThunk } from "@reduxjs/toolkit";
import { axioKit } from "../../../../../utilities";
import { Services } from "../../../../../fakeDb";

const url = "commerce/pos/services/deals";

const initialState = {
  collections: [],
  inhouse: [],
  outsource: [],
  _id: "default",
  source: "",
  physician: "",
  transaction: { _id: "default" },
  isSuccess: false,
  show: false,
  isLoading: false,
  message: "",
};

export const BROWSE = createAsyncThunk(`${url}`, ({ token, key }, thunkAPI) => {
  try {
    return axioKit.universal(`${url}/browse`, token, key);
  } catch (error) {
    const message =
      (error.response && error.response.data && error.response.data.message) ||
      error.message ||
      error.toString();

    return thunkAPI.rejectWithValue(message);
  }
});
export const TASKS = createAsyncThunk(
  `${url}/tasks`,
  ({ token, key }, thunkAPI) => {
    try {
      return axioKit.universal(`${url}/tasks`, token, key);
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

export const TAGGING = createAsyncThunk(
  `${url}/tagging`,
  ({ key, token }, thunkAPI) => {
    try {
      return axioKit.universal(`${url}/tagging`, token, key);
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
export const REFORM = createAsyncThunk(
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

export const reduxSlice = createSlice({
  name: url,
  initialState,
  reducers: {
    TOGGLE: (state) => {
      state.show = !state.show;
    },

    SetSELECTED: (state, { payload }) => {
      const list = payload.cart?.flatMap((item) => item.packages || []);
      const _inhouse = Services.whereIn(list);
      state.inhouse = _inhouse;
      state.outsource = [];
      state.selected = payload;
      state.show = true;
    },
    SetINHOUSE: (state, { payload }) => {
      const index = state.outsource.findIndex((item) => item.id === payload.id);
      if (index > -1) {
        state.outsource.splice(index, 1);
      }
      state.inhouse.push(payload);
    },
    SetOUTSOURCE: (state, { payload }) => {
      const index = state.inhouse.findIndex((item) => item.id === payload.id);
      if (index > -1) {
        state.inhouse.splice(index, 1);
      }
      state.outsource.push(payload);
    },

    SETSOURCE: (state, { payload }) => {
      state.source = payload.source;
      state._id = payload._id;
    },
    SETPHYSICIAN: (state, { payload }) => {
      state.physician = payload.physician;
      state._id = payload._id;
    },
    RESET: (state, { payload = {} }) => {
      state.isSuccess = false;
      state.message = "";

      if (payload?.resetCollections) state.collections = [];
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
        const { payload, department } = action.payload;
        // filter by department
        const _collections = payload.map((item) => ({
          ...item,
          cart: item?.cart?.filter(({ packages }) =>
            Services.filterByDepartment(
              packages,
              department === "Laboratory" ? "LAB" : "RAD"
            )
          ),
        }));

        state.collections = _collections;

        state.isLoading = false;
      })
      .addCase(BROWSE.rejected, (state, action) => {
        const { error } = action;
        state.message = error.message;
        state.isLoading = false;
      })
      .addCase(TAGGING.pending, (state) => {
        // state.isLoading = true;
        // state.isSuccess = false;
        state.message = "";
      })
      .addCase(TAGGING.fulfilled, (state, action) => {
        const { payload } = action.payload;
        const index = state.collections.findIndex((c) => c._id === payload._id);

        state.collections[index] = payload;

        state.isLoading = false;
      })
      .addCase(TAGGING.rejected, (state, action) => {
        const { error } = action;
        state.message = error.message;
        state.isLoading = false;
      })
      .addCase(TASKS.pending, (state) => {
        state.isLoading = true;
        state.isSuccess = false;
        state.message = "";
      })
      .addCase(TASKS.fulfilled, (state, action) => {
        const { payload } = action.payload;
        state.collections = payload;
        state.isLoading = false;
      })
      .addCase(TASKS.rejected, (state, action) => {
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
        const { success, payload } = action.payload;
        state.message = success;
        state.transaction = payload;
        state.isSuccess = true;
        state.isLoading = false;
      })
      .addCase(SAVE.rejected, (state, action) => {
        const { error } = action;
        state.message = error.message;
        state.isLoading = false;
      })
      .addCase(REFORM.pending, (state) => {
        state.isSuccess = false;
        state.message = "";
      })
      .addCase(REFORM.fulfilled, (state, action) => {
        const { success, payload } = action.payload;
        const index = state.collections.findIndex(
          (item) => item._id === payload._id
        );

        const oldCollections = state.collections[index];

        state.collections[index] = { ...oldCollections, ...payload };
        state.message = success;
        state.isSuccess = true;
        state.isLoading = false;
      })
      .addCase(REFORM.rejected, (state, action) => {
        const { error } = action;
        state.message = error.message;
        state.isLoading = false;
      });
  },
});

export const {
  RESET,
  SETSOURCE,
  SETPHYSICIAN,
  SetSELECTED,
  TOGGLE,
  SetOUTSOURCE,
  SetINHOUSE,
} = reduxSlice.actions;

export default reduxSlice.reducer;
