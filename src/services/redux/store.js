import { configureStore } from "@reduxjs/toolkit";
import {
  auth,
  personnels,
  users,
  physicians,
  heads,
  applicants,
  companies,
  procurements,
  branches,
  providers,
  tieups,
} from "./slices/assets";
import { dragDrop } from "./slices/reusable";
import {
  menus,
  services,
  pos,
  sales,
  taskGenerator,
  deals,
  billings,
  dispenser,
} from "./slices/commerce";

import {
  hematology,
  urinalysis,
  fecalysis,
  electrolyte,
  serology,
  chemistry,
  preferences,
  validator,
  temperatures,
  controls,
  assurances,
  xray,
} from "./slices/diagnostics";

import { access, liabilities } from "./slices/liability";
import {
  remittances,
  payables,
  payments,
  payrolls,
  ledger,
  soa,
} from "./slices/finance";
import products from "./slices/market/products";

const store = configureStore({
  reducer: {
    remittances,
    payables,
    payments,
    payrolls,
    billings,
    auth,
    personnels,
    access,
    users,
    ledger,
    soa,
    preferences,
    validator,
    physicians,
    menus,
    services,
    sales,
    taskGenerator,
    deals,
    pos,
    dispenser,
    heads,
    tieups,
    chemistry,
    companies,
    procurements,
    branches,
    hematology,
    urinalysis,
    fecalysis,
    applicants,
    liabilities,
    electrolyte,
    serology,
    temperatures,
    providers,
    controls,
    assurances,
    dragDrop,
    products,
    xray,
  },
});

export default store;
