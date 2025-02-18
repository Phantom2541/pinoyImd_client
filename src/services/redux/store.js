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
import { menus, sales, checkout } from "./slices/commerce";

import {
  hematology,
  urinalysis,
  fecalysis,
  electrolyte,
  serology,
  chemistry,
  preferences,
} from "./slices/results";

import { access, liabilities, payrolls } from "./slices/responsibilities";

import remmitance from "./slices/finance/remmitance";
import temperatures from "./slices/monitoring/temperature";

const store = configureStore({
  reducer: {
    remmitance,
    auth,
    personnels,
    access,
    users,
    preferences,
    menus,
    physicians,
    sales,
    checkout,
    heads,
    tieups,
    chemistry,
    companies,
    procurements,
    branches,
    payrolls,
    hematology,
    urinalysis,
    fecalysis,
    applicants,
    liabilities,
    electrolyte,
    serology,
    temperatures,
    providers,
  },
});

export default store;
