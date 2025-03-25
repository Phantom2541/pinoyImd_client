import { createSlice, createAsyncThunk } from "@reduxjs/toolkit";
import { axioKit, getAge } from "../../../../../utilities";
import { Services } from "../../../../../fakeDb";
// import _ from "lodash";
const defaultCustomer = {
  fullName: {
    fname: "",
    mname: "",
    lname: "",
    suffix: "",
  },
  address: {
    region: "REGION III (CENTRAL LUZON)",
    province: "NUEVA ECIJA",
    city: "CABANATUAN CITY",
    barangay: "",
    street: "",
  },
  dob: "",
  isMale: false,
  mobile: "",
  privilege: 0,
  email: "",
};
const url = "commerce/pos/services/deals";
const defaultState = {
  branchId: JSON.parse(localStorage.getItem("auth"))?.branchId || undefined,
  cashierId: JSON.parse(localStorage.getItem("auth"))?._id || undefined,
  transaction: { _id: "default" },
  customerId: { _id: "default" },
  customer: {},
  ssx: undefined,
  hasActiveCustomer: false,
  category: 0,
  privilege: 0,
  payment: "cash",
  cash: 0,
  amount: 0,
  hasDiscount: false,
  discount: 0,
  authorizedBy: undefined,
  gross: 0,
  physicianId: undefined,
  sourceId: undefined,
  cart: [],
  isPickup: true,
  isPrint: true,
  isSuccess: false,
  isLoading: false,
  message: undefined,
  department: [],
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
  `${url}/cashier`,
  ({ token, key }, thunkAPI) => {
    try {
      return axioKit.universal(`${url}/cashier`, token, key);
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
export const CHECKOUT = createAsyncThunk(
  `${url}/checkout`,
  ({ key, token }, thunkAPI) => {
    try {
      return axioKit.universal(`${url}/checkout`, token, key);
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
    SETMENUS: (state, { payload }) => {
      state.menus = [...payload];
      localStorage.setItem("menus", JSON.stringify(payload));
    },
    SETSSX: (state, { payload }) => {
      state.ssx = payload;
    },
    SETCART: (state, { payload }) => {
      state.cart = [];
    },
    SETCASHIER: (state, { payload }) => {
      state.cashierId = payload.cashierId;
      state.branchId = payload.branchId;
    },
    SETPATIENT: (state, { payload }) => {
      state.customer = payload;
      state.customerId = payload?._id;
      const isSenior = getAge(payload.dob, true) > 59; // Use payload instead of customer
      state.privilege = payload.privilege || (isSenior ? 2 : 0);
    },

    SETSEARCHKEY: (state, { payload }) => {
      state.customer = {
        ...defaultCustomer,
        fullName: {
          fname: payload.fname,
          mname: payload.mname || "",
          lname: payload.lname,
        },
      };
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
      const index = state.cart.findIndex((item) => item._id === payload._id);
      if (index === -1) {
        state.cart = [...state.cart, payload];
      } else {
        // update this item and increase the quantity
        state.cart[index] = payload;
      }
      // Get the department(s) related to the new item
      const _department = Services.getDepartment(payload.packages);

      // Combine the current department array with the new department array and ensure uniqueness
      const department = [...new Set([..._department, ...state.department])];

      // Update the department state with the unique departments
      state.department = department;
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
      state.amount = 0;
      state.cart = [];
      state.cash = 0;
      state.customer = {};
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
      });
  },
});

export const {
  SETSSX,
  SETCART,
  SETMENUS,
  SETCASHIER,
  SETAUTHORIZEDBY,
  SETCATEGORY,
  SETPRIVILEGE,
  SETCASH,
  SETPAYMENT,
  SETPATIENT,
  SETSEARCHKEY,
  SETGROSS,
  SETPHYSICIAN,
  SETSOURCE,
  ADDTOCART,
  REMOVEFROMCART,
  RESET,
} = reduxSlice.actions;

export default reduxSlice.reducer;
