import { createSlice, createAsyncThunk } from "@reduxjs/toolkit";
import { axioKit } from "../../../utilities";

const name = "commerce/sales";

const initialState = {
  collections: [],
  catalogs: [],
  transaction: { _id: "default" },
  totalPatient: 0,
  // this is used for ledger
  census: {
    daily: {},
    grossSales: 0,
    menus: {},
    services: {},
    expenses: 0,
    patients: 0,
    isEmpty: true,
  },
  isSuccess: false,
  isLoading: false,
  censusLoading: false, // dedicated loader for celsus
  message: "",
};

export const BROWSE = createAsyncThunk(
  `${name}`,
  ({ token, key }, thunkAPI) => {
    try {
      return axioKit.universal(`${name}/browse`, token, key);
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

export const CASHIER = createAsyncThunk(
  `${name}/cashier`,
  ({ token, key }, thunkAPI) => {
    try {
      return axioKit.universal(`${name}/cashier`, token, key);
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

export const TRACKER = createAsyncThunk(
  `${name}/tracker`,
  ({ token, key }, thunkAPI) => {
    try {
      return axioKit.universal(`${name}/tracker`, token, key);
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

export const CENSUS = createAsyncThunk(
  `${name}/ledger`,
  ({ token, key }, thunkAPI) => {
    try {
      return axioKit.universal(`${name}/ledger`, token, key);
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

export const OLDLEDGER = createAsyncThunk(
  `${name}/oldledger`,
  ({ token, key }, thunkAPI) => {
    try {
      return axioKit.universal(`${name}/oldledger`, token, key);
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

export const YEARLY = createAsyncThunk(
  `${name}/yearly`,
  ({ token, branchId, year }, thunkAPI) => {
    console.log("branchId", branchId);
    try {
      return axioKit.universal(`${name}/yearly`, token, {
        branchId,
        year,
      });
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

export const TASKS = createAsyncThunk(
  `${name}/tasks`,
  ({ token, key }, thunkAPI) => {
    try {
      return axioKit.universal(`${name}/tasks`, token, key);
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
  `${name}/save`,
  ({ data, token }, thunkAPI) => {
    try {
      return axioKit.save(name, data, token);
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

export const LABRESULT = createAsyncThunk(
  `${name}/labresult`,
  ({ token, data }, thunkAPI) => {
    try {
      return axioKit.save(
        `results/${data.department}/${data.form}`,
        data,
        token
      );
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

export const UPDATE = createAsyncThunk(
  `${name}/update`,
  ({ data, token }, thunkAPI) => {
    try {
      return axioKit.update(name, data, token);
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

export const MANAGERUPDATE = createAsyncThunk(
  `${name}/managerUpdate`,
  ({ key, token }, thunkAPI) => {
    try {
      return axioKit.universal(`${name}/managerUpdate`, token, key);
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
        const { payload } = action.payload;
        state.collections = payload;
        state.isLoading = false;
      })
      .addCase(BROWSE.rejected, (state, action) => {
        const { error } = action;
        state.message = error.message;
        state.isLoading = false;
      })

      .addCase(CASHIER.pending, (state) => {
        state.isLoading = true;
        state.isSuccess = false;
        state.message = "";
      })
      .addCase(CASHIER.fulfilled, (state, action) => {
        const { payload } = action.payload;
        state.collections = payload;
        state.isLoading = false;
      })
      .addCase(CASHIER.rejected, (state, action) => {
        const { error } = action;
        state.message = error.message;
        state.isLoading = false;
      })

      .addCase(MANAGERUPDATE.pending, (state) => {
        state.isLoading = true;
        state.isSuccess = false;
        state.message = "";
      })
      .addCase(MANAGERUPDATE.fulfilled, (state, action) => {
        const { success, payload } = action.payload,
          { _id, deletedAt, amount } = payload;

        const index = state.collections.findIndex((c) => c._id === _id);

        if (deletedAt) {
          state.collections.splice(index, 1);
        } else {
          state.collections[index].amount = amount;
        }

        state.message = success;
        state.isSuccess = true;
        state.isLoading = false;
      })
      .addCase(MANAGERUPDATE.rejected, (state, action) => {
        const { error } = action;
        state.message = error.message;
        state.isLoading = false;
      })

      .addCase(TRACKER.pending, (state) => {
        state.isLoading = true;
        state.isSuccess = false;
        state.message = "";
      })
      .addCase(TRACKER.fulfilled, (state, action) => {
        const { payload } = action.payload;
        state.collections = payload;
        state.isLoading = false;
      })
      .addCase(TRACKER.rejected, (state, action) => {
        const { error } = action;
        state.message = error.message;
        state.isLoading = false;
      })

      .addCase(CENSUS.pending, (state) => {
        state.census = {
          // this is used for ledger
          daily: {},
          grossSales: 0,
          menus: {},
          services: {},
          expenses: 0,
          patients: 0,
          isEmpty: true,
        };
        state.censusLoading = true;
        state.isSuccess = false;
        state.message = "";
      })

      .addCase(CENSUS.fulfilled, (state, action) => {
        // console.log("payload-census", action.payload.census);
        const { sales = [], ...rest } = action.payload.census;

        const daily = sales?.reduce((daily, { createdAt, amount, ...rest }) => {
          const day = new Date(createdAt).toDateString(),
            obj = daily[day] || (daily[day] = { sales: [], total: 0 });

          obj.sales.push({ createdAt, amount, ...rest });
          obj.total += amount;
          // console.log("daily", daily);

          return daily;
        }, {});

        state.census = { ...rest, daily };
        state.censusLoading = false;
      })
      .addCase(CENSUS.rejected, (state, action) => {
        const { error } = action;
        state.message = error.message;
        state.censusLoading = false;
      })

      .addCase(OLDLEDGER.pending, (state) => {
        state.census = {
          // this is used for ledger
          days: {},
          grossSales: 0,
          menus: {},
          services: {},
          expenses: 0,
          patients: 0,
          isEmpty: true,
        };
        state.isLoading = true;
        state.isSuccess = false;
        state.message = "";
      })

      .addCase(OLDLEDGER.fulfilled, (state, action) => {
        state.catalogs = action.payload;
        state.collections = action.payload;
        state.isLoading = false;
      })
      .addCase(OLDLEDGER.rejected, (state, action) => {
        const { error } = action;
        state.message = error.message;
        state.isLoading = false;
      })

      .addCase(YEARLY.pending, (state) => {
        state.isLoading = true;
        state.isSuccess = false;
        state.message = "";
      })
      .addCase(YEARLY.fulfilled, (state, action) => {
        const { payload } = action.payload;
        state.collections = payload;
        state.isLoading = false;
      })
      .addCase(YEARLY.rejected, (state, action) => {
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

      .addCase(LABRESULT.pending, (state) => {
        // state.isLoading = true;
        state.isSuccess = false;
        state.message = "";
      })
      .addCase(LABRESULT.fulfilled, (state, action) => {
        const { success, payload } = action.payload;
        state.message = success;
        const identifer = payload?.form === "Miscellaneous" ? "saleId" : "_id";

        const index = state.collections.findIndex(
          (item) => item._id === payload[identifer]
        );

        if (identifer === "saleId") {
          state.collections[index].miscellaneous[payload?.miscIndex] = payload;
        } else {
          state.collections[index][String(payload.form).toLowerCase()] =
            payload;
        }

        state.isSuccess = true;
        state.isLoading = false;
      })
      .addCase(LABRESULT.rejected, (state, action) => {
        const { error } = action;
        state.message = error.message;
        state.isLoading = false;
      })

      .addCase(UPDATE.pending, (state) => {
        // state.isLoading = true; comment this to stop loading and refreshing UI
        state.isSuccess = false;
        state.message = "";
      })
      .addCase(UPDATE.fulfilled, (state, action) => {
        const { success, payload } = action.payload;

        const index = state.collections.findIndex(
          (item) => item._id === payload._id
        );
        state.transaction = {
          ...payload,
          _id: state.transaction._id === payload._id ? "default" : payload._id,
        };

        const currentValue = { ...state.collections[index] };

        for (const key in payload) {
          if (currentValue.hasOwnProperty(key)) {
            currentValue[key] = payload[key];
          }
        }

        state.collections[index] = currentValue;
        state.message = success;
        state.isSuccess = true;
        state.isLoading = false;
      })
      .addCase(UPDATE.rejected, (state, action) => {
        const { error } = action;
        state.message = error.message;
        state.isLoading = false;
      });
  },
});

export const { RESET } = reduxSlice.actions;

export default reduxSlice.reducer;
