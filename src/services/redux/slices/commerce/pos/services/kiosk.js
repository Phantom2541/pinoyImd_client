import { createSlice } from "@reduxjs/toolkit";
import { findIndex } from "lodash";
const url = "portal/ICard";
const _refNo = {
  number: "",
  amount: 0,
  pp: "cash", //cash or credit patient Payable
  careOf: {
    category: "employee",
    user: "",
  },
};

const initialState = {
  menus: [],
  cart: [],
  isAuthorization: false,
  isSendOut: false,
  showModal: false,
  selected: {},
  payment: "",
  refNo: _refNo,
  cash: 0,
};

const isSubset = (packages, servicesId) => {
  return (
    packages.length === 1 && packages.every((id) => servicesId.includes(id))
  );
};

export const reduxSlice = createSlice({
  name: url,
  initialState,
  reducers: {
    SetSELECTED: (state, { payload }) => {
      const { data, isAuthorization, isSendOut } = payload;
      state.isAuthorization = isAuthorization;
      state.selected = data;
      state.showModal = true;
      state.isSendOut = isSendOut;
    },
    InitializeCART: (state, { payload: menus }) => {
      const { servicesId = [] } = state.selected;
      const cart = [];
      const isInitialize = servicesId?.length > 0 || state.isAuthorization;

      if (!isInitialize) return state;

      for (const menu of menus) {
        const { packages, isProfile = false } = menu;

        if (isSubset(packages, servicesId) && !isProfile) {
          cart.push(menu);
          if (cart.length === servicesId.length) break;
        }
      }

      const _matchMenus = [...menus].filter(
        ({ packages, isProfile = false }) =>
          isSubset(packages, servicesId) && !isProfile
      );
      const _menus = state.isAuthorization
        ? menus.filter(({ packages }) => packages.length === 1)
        : _matchMenus;

      state.cart = cart;
      state.menus = _menus;
    },
    RemoveCART: (state, { payload }) => {
      const _cart = [...state.cart];
      const index = findIndex(_cart, { _id: payload });
      _cart.splice(index, 1);
      state.cart = _cart;
    },
    SetCART: (state, { payload }) => {
      state.cart = payload;
    },
    SetPAYMENT: (state, { payload }) => {
      state.payment = payload;
    },
    SetREFNO: (state, { payload }) => {
      state.refNo = payload;
    },
    SetCASH: (state, { payload }) => {
      state.cash = payload;
    },
    SetCHECK: (state, { payload }) => {
      const _cart = [...state.cart];
      const index = _cart.findIndex((item) => item._id === payload);
      _cart[index] = { ..._cart[index], isApproved: !_cart[index]?.isApproved };
      state.cart = _cart;
    },
    TOGGLE: (state) => {
      state.showModal = !state.showModal;
      state.selected = {};
      state.isAuthorization = false;
      state.isSendOut = false;
    },
    ResetREFNO: (state) => {
      state.refNo = _refNo;
    },
    RESET: (state) => {
      state.isSuccess = false;
      state.isLoading = false;
      state.message = "";
    },
  },
});

export const {
  SetSELECTED,
  TOGGLE,
  InitializeCART,
  SetCART,
  RemoveCART,
  SetCHECK,
  SetPAYMENT,
  SetREFNO,
  SetCASH,
  ResetREFNO,
  RESET,
} = reduxSlice.actions;

export default reduxSlice.reducer;
