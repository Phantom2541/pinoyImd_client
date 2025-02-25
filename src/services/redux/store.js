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
import { menus, sales, pos, taskGenerator } from "./slices/commerce";

import {
  hematology,
  urinalysis,
  fecalysis,
  electrolyte,
  serology,
  chemistry,
  preferences,
} from "./slices/results";

import {
  access,
  liabilities,
  payrolls,
  controls,
  assurance,
} from "./slices/responsibilities";

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
    pos,
    taskGenerator,
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
    controls,
    assurance,
  },
});

export default store;
