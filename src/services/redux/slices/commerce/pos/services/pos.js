import { createSlice, createAsyncThunk } from "@reduxjs/toolkit";
import { axioKit, getAge, socket } from "../../../../../utilities";
import { Services } from "../../../../../fakeDb";
// import _ from "lodash";
const url = "commerce/pos/services/deals";
// Get data once
function safeParseJSON(item, fallback = {}) {
  if (!item || item === undefined) return fallback;
  // try {
  //   return JSON.parse(item) || fallback;
  // } catch (error) {
  //   console.error("Invalid JSON:", item, error);
  //   return fallback;
  // }
}

const authData = safeParseJSON(localStorage.getItem("auth"));
const activePlatform =
  localStorage.getItem("activePlatform") !== "undefined" &&
  safeParseJSON(localStorage.getItem("activePlatform"));
const branch = activePlatform?.branch || {};

const defaultCustomer = {
  fullName: {
    fname: "",
    mname: "",
    lname: "",
    suffix: "",
  },
  address: {
    region: branch?.address?.region,
    province: branch?.address?.province,
    city: branch?.address?.city,
    barangay: "",
    street: "",
  },
  dob: "",
  isMale: false,
  mobile: "",
  privilege: 0,
  email: "",
};
const defaultState = {
  branchId: authData?.branchId || undefined,
  cashierId: authData?._id || undefined,
  transaction: { _id: "default" },
  customerId: { _id: "default" },
  customer: {},
  ssx: undefined,
  hasActiveCustomer: false,
  category: 0,
  privilege: 0,
  hmo: "",
  contract: "",
  payment: "cash",
  cash: 0,
  amount: 0,
  hasDiscount: false,
  discount: 0,
  authorizedBy: undefined,
  gross: 0,
  physicianId: undefined,
  sourceId: undefined,
  membership: undefined,
  cart: [],
  isPickup: true,
  isPrint: true,
  isSuccess: false,
  isLoading: false,
  formSubmitted: false,
  message: undefined,
  department: [],
};

const initialState = {
  menus: safeParseJSON(localStorage.getItem("menus")),
  sources: safeParseJSON(localStorage.getItem("sources")),
  physicians: safeParseJSON(localStorage.getItem("physicians")),
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
    SETHMO: (state, { payload }) => {
      state.hmo = payload;
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
      const { _id, membership, contract } = payload;
      state.sourceId = _id;
      state.membership = membership;
      state.contract = contract;
    },
    OVERRIDE_CART: (state, { payload }) => {
      state.cart = payload;
    },
    ADDTOCART: (state, { payload }) => {
      const index = state.cart.findIndex((item) => item._id === payload._id);
      if (index === -1) {
        state.cart = [...state.cart, payload];
      } else {
        // Update the item and increase the quantity
        state.cart[index] = payload;
      }

      // Get department(s) related to the new item
      const _department = Services.getDepartment(payload.packages);

      // Only update if department data exists and is not empty
      if (_department && _department.length > 0) {
        const department = [...new Set([..._department, ...state.department])];
        state.department = department;
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
      state.amount = 0;
      state.cart = [];
      state.cash = 0;
      state.customer = {};
      state.ssx = "";
      if (payload?.resetCollections) state.collections = [];
    },
    RESET_INSOURCE: (state) => {
      state.sourceId = null;
      state.membership = null;
      state.hmo = null;
      state.contract = null;
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
        state.formSubmitted = true;
        state.isSuccess = false;
        state.message = "";
      })
      .addCase(SAVE.fulfilled, (state, action) => {
        const { success, payload, dealForOnboard } = action.payload;
        const fakeDB = localStorage.getItem("activePlatform");
        if (fakeDB) {
          const { department } = JSON.parse(fakeDB);
          //this is realtime send it to the onboarding
          socket.emit("send_onboard", { ...dealForOnboard, department });
        }
        state.sourceId = "";
        state.message = success;
        state.transaction = payload;
        state.ssx = "";
        state.isSuccess = true;
        state.formSubmitted = false;
      })
      .addCase(SAVE.rejected, (state, action) => {
        const { error } = action;
        state.message = error.message;
        state.formSubmitted = false;
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
  SETHMO,
  ADDTOCART,
  REMOVEFROMCART,
  OVERRIDE_CART,
  RESET,
  RESET_INSOURCE,
} = reduxSlice.actions;

export default reduxSlice.reducer;
