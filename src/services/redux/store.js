import { configureStore } from "@reduxjs/toolkit";

// ADD THIS LINE ✅
import cases from "./slices/commerce/pos/services/cases";

// ASSETS
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

// REUSABLE
import { dragDrop, table } from "./slices/reusable";

// COMMERCE
import {
  menus,
  services,
  pos,
  sales,
  taskGenerator,
  deals,
  billings,
  dispenser,
  onBoardings,
  admission,
} from "./slices/commerce";

// DIAGNOSTICS
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
  ultrasound,
  ecg,
  miscellaneous,
  appointments,
} from "./slices/diagnostics";

// FINANCE
import {
  remittances,
  payables,
  payments,
  payrolls,
  ledger,
  soa,
  orgChart,
  duties,
} from "./slices/finance";

// MARKET
import {
  products,
  productsGenerics,
  machines,
  medicines,
  generics,
  mentainance,
  attendances,
} from "./slices/market";

// LIABILITY
import { access, liabilities } from "./slices/liability";

// OTHER
import portal from "./slices/emr/portal";
import { quest } from "./slices/diagnostics";

const store = configureStore({
  reducer: {
    duties,
    appointments,
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
    admission,
    services,
    onBoardings,
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
    products,
    xray,
    ultrasound,
    ecg,
    productsGenerics,
    machines,
    attendances,
    medicines,
    generics,
    mentainance,
    quest,
    portal,
    dragDrop,
    table,
    miscellaneous,
    orgChart,
    cases,
  },
  devTools: true,
});

export default store;
