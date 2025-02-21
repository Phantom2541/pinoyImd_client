import { configureStore } from "@reduxjs/toolkit";
// import auth from "./slices/assets/persons/auth";
// import personnels from "./slices/assets/persons/personnels";
// import sources from "./slices/assets/persons/source";
// import access from "./slices/responsibilities/access";
// import users from "./slices/assets/persons/users";
// import companies from "./slices/assets/companies";
// import preferences from "./slices/results/preferences";
// import menus from "./slices/commerce/menus";
// import providers from "./slices/assets/providers";
// import physicians from "./slices/assets/persons/physicians";
// import sales from "./slices/commerce/sales";
// import heads from "./slices/assets/persons/heads";
// import tieups from "./slices/assets/tieups/companies";
// import chemistry from "./slices/results/laboratory/chemistry";

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
// import pos from "./slices/commerce/pos";

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
    sources,
    pos,
  },
});

export default store;
