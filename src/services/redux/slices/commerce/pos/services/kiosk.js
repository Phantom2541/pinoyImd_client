import { createSlice } from "@reduxjs/toolkit";
import { findIndex } from "lodash";
const url = "portal/ICard";
const createRefNo = () => ({
  number: "",
  appNo: "",
  exp: "",
  amount: 0,
  pp: "cash",
  careOf: {
    category: "employee",
    user: "",
  },
});

var initialState = {
  menus: [],
  cart: [],
  isAuthorization: false,
  isSendOut: false,
  showModal: false,
  selected: {},
  payment: "",
  refNo: createRefNo(),
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
      const { services: _services = [], notCovered = [] } = state.selected;
      const services = [..._services, ...notCovered];
      const cart = [];
      const isInitialize = services?.length > 0 || state.isAuthorization;

      if (!isInitialize) return state;

      for (const menu of menus) {
        const { packages, isProfile = false } = menu;

        if (isSubset(packages, services) && !isProfile) {
          if (isSubset(packages, notCovered)) {
            //this is not covered in approval
            cart.push({ ...menu, isApproved: false });
            console.log("packages", packages);
          } else {
            cart.push(menu);
          }
          if (cart.length === services.length) break;
        }
      }

      const _matchMenus = [...menus].filter(
        ({ packages, isProfile = false }) =>
          isSubset(packages, services) && !isProfile
      );
      const _menus = !state.isSendOut
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
      state.payment = state.isSendOut ? "voucher" : payload;
    },
    SetREFNO: (state, { payload }) => {
      const { haveCard = true } = state.selected;
      const isMixed = state.payment === "mixed";
      state.refNo = {
        ...payload,
        ...(!haveCard && { pp: isMixed ? "co" : "cash" }),
      };
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
      state.showModal = false;
      state.selected = {};
      state.isAuthorization = false;
      state.isSendOut = false;
    },
    ResetREFNO: (state) => {
      const { haveCard = false } = state.selected;
      state.refNo = createRefNo();

      if (state.payment === "mixed") {
        state.refNo.pp = haveCard ? "cash" : "co";
      }
      if (!state.isAuthorization) {
        const { refNo = {} } = state.selected;
        state.refNo.appNo = refNo.appNo;
        state.refNo.exp = refNo.exp;
      }
    },
    RESET: (state) => {
      state.menus = [];
      state.cart = [];
      state.isAuthorization = false;
      state.isSendOut = false;
      state.selected = {};
      state.payment = "";
      state.refNo = createRefNo();

      state.cash = 0;
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
