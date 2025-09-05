import { configureStore } from "@reduxjs/toolkit";
import cases from "./slices/commerce/pos/services/cases";
import requestForm from "./slices/requestForm/requestForm";

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
  products,
  productGenerics,
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
  // productsGenerics,
  machines,
  medicines,
  generics,
  mentainance,
  attendances,
} from "./slices/market";
// LIABILITY
import { access, liabilities } from "./slices/liability";

// OTHER
import { quest } from "./slices/diagnostics";
import { idCalibrator, idGenerator } from "./slices/idCard";
import emr from "./slices/portal/emr";
import icard from "./slices/portal/icard";
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
    productGenerics,
    machines,
    attendances,
    medicines,
    generics,
    mentainance,
    quest,

    dragDrop,
    table,
    miscellaneous,
    orgChart,
    cases,
    requestForm,
    idCalibrator,
    idGenerator,
    //portal
    emr,
    icard,
  },
  devTools: true,
});

export default store;
