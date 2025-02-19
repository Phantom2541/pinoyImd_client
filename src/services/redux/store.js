import { configureStore } from "@reduxjs/toolkit";
import auth from "./slices/assets/persons/auth";
import personnels from "./slices/assets/persons/personnels";
import sources from "./slices/assets/persons/source";
import access from "./slices/responsibilities/access";
import users from "./slices/assets/persons/users";
import companies from "./slices/assets/companies";
import preferences from "./slices/results/preferences";
import menus from "./slices/commerce/menus";
import providers from "./slices/assets/providers";
import physicians from "./slices/assets/persons/physicians";
import sales from "./slices/commerce/sales";
import heads from "./slices/assets/persons/heads";
import tieups from "./slices/assets/tieups/companies";
import chemistry from "./slices/results/laboratory/chemistry";

import procurements from "./slices/assets/procurements";
import branches from "./slices/assets/branches";
import liabilities from "./slices/responsibilities/liabilities";
import payrolls from "./slices/responsibilities/payroll";
import applicants from "./slices/assets/persons/applicants";
import hematology from "./slices/results/laboratory/hematology";
import urinalysis from "./slices/results/laboratory/urinalysis";
import fecalysis from "./slices/results/laboratory/fecalysis";
import electrolyte from "./slices/results/laboratory/electrolyte";
import serology from "./slices/results/laboratory/serology";

import remmitance from "./slices/finance/remmitance";
import checkout from "./slices/commerce/checkout";

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
    checkout,
  },
});

export default store;
