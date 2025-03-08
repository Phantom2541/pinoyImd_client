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
} from "./slices/results";

import { access, liabilities, controls, assurances } from "./slices/liability";

import { payrolls, remittances } from "./slices/finance";

import temperatures from "./slices/monitoring/temperature";

const store = configureStore({
  reducer: {
    remittances,
    payrolls,
    auth,
    personnels,
    access,
    users,
    preferences,
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
  },
});

export default store;
