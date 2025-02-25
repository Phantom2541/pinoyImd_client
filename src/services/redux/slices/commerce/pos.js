import { createSlice, createAsyncThunk } from "@reduxjs/toolkit";
import { axioKit } from "../../../utilities";

const name = "commerce/sales";
const defaultState = {
  branchId: JSON.parse(localStorage.getItem("auth"))?.branchId || "",
  cashierId: JSON.parse(localStorage.getItem("auth"))?._id || "",
  transaction: { _id: "default" },
  customerId: { _id: "default" },
  customer: {},
  hasActiveCustomer: false,
  category: 0,
  privilege: 0,
  payment: "cash",
  cash: 0,
  hasDiscount: false,
  discount: 0,
  authorizedBy: "",
  gross: 0,
  physicianId: "",
  sourceId: "",
  cart: [],
  isPickup: true,
  isPrint: true,
  isSuccess: false,
  isLoading: false,
  message: "",
};

const initialState = {
  // if needed but empty, then it will be updated from the database
  menus: JSON.parse(localStorage.getItem("menus")) || [],
  sources: JSON.parse(localStorage.getItem("sources")) || [],
  physicians: JSON.parse(localStorage.getItem("physicians")) || [],
  // needed every time
  ...defaultState,
};

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

export const TAGGING = createAsyncThunk(
  `${name}/tagging`,
  ({ key, token }, thunkAPI) => {
    try {
      return axioKit.universal(`${name}/tagging`, token, key);
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
export const CHECKOUT = createAsyncThunk(
  `${name}/checkout`,
  ({ key, token }, thunkAPI) => {
    try {
      return axioKit.universal(`${name}/checkout`, token, key);
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
    SETMENUS: (state, { payload }) => {
      state.menus = [...payload];
      localStorage.setItem("menus", JSON.stringify(payload));
    },
    SETCASHIER: (state, { payload }) => {
      state.cashierId = payload.cashierId;
      state.branchId = payload.branchId;
    },
    SETPATIENT: (state, { payload }) => {      
      state.customer = payload;
      state.customerId = payload._id;
    },
    SETCATEGORY: (state, { payload }) => {
      state.category = payload;
    },
    SETPRIVILEGE: (state, { payload }) => {
      state.privilege = payload;
    },
    SETPAYMENT: (state, { payload }) => {
      state.payment = payload;
    },
    SETCASH: (state, { payload }) => {
      state.cash = payload;
    },
    SETAUTHORIZEDBY: (state, { payload }) => {
      state.authorizedBy = payload;
    },
    SETGROSS: (state, { payload }) => {
      state.gross = payload;
    },
    SETPHYSICIAN: (state, { payload }) => {
      state.physicianId = payload;
    },
    SETSOURCE: (state, { payload }) => {
      state.sourceId = payload;
    },
    ADDTOCART: (state, { payload }) => {
      console.log("payload :", payload);
      const index = state.cart.findIndex((item) => item._id === payload._id);
      if (index === -1) {
        state.cart = [...state.cart, payload];
      } else {
        // update this item and increase the quantity
        state.cart[index] = payload;
      }
    },
    REMOVEFROMCART: (state, { payload }) => {
      //console.log("state.cart :", state.cart);
      //console.log("payload :", payload);

      state.cart = state.cart.filter((item) => item._id !== payload);
      //console.log("state.cart :", state.cart);
    },
    RESET: (state, { payload = {} }) => {
      state.isSuccess = false;
      state.message = "";

      if (payload?.resetCollections) state.collections = [];
    },
  },
  extraReducers: (builder) => {
    builder
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

      .addCase(UPDATE.pending, (state) => {
        // state.isLoading = true; comment this to stop loading and refreshing UI
        state.isSuccess = false;
        state.message = "";
      })
      .addCase(UPDATE.fulfilled, (state, action) => {
        console.log("action pos",action);
        
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

export const {
  SETMENUS,
  SETCASHIER,
  SETAUTHORIZEDBY,
  SETCATEGORY,
  SETPRIVILEGE,
  SETCASH,
  SETPAYMENT,
  SETPATIENT,
  SETGROSS,
  SETPHYSICIAN,
  SETSOURCE,
  ADDTOCART,
  REMOVEFROMCART,
  RESET,
} = reduxSlice.actions;

export default reduxSlice.reducer;
