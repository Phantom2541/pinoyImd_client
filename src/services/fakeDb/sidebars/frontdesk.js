import Dashboard from "../../../pages/platforms/frontdesk/dashboard";
import Fecalysis from "../../../pages/platforms/frontdesk/logbooks/fecalysis";
import Hermatology from "../../../pages/platforms/frontdesk/logbooks/hermatology";
import Urinalysis from "../../../pages/platforms/frontdesk/logbooks/urinalysis";
import Chemistry from "../../../pages/platforms/frontdesk/logbooks/chemistry";
import Electrolite from "../../../pages/platforms/frontdesk/logbooks/electrolite";
import Serology from "../../../pages/platforms/frontdesk/logbooks/serology";
import ExperimentalPOS from "../../../pages/platforms/cashier/pos/ExperimentalCashier";

import {
  Task,
  Report,
  Tracker,
} from "../../../pages/platforms/frontdesk/transactions";

import {
  // Cashier,
  Sales,
  Ledger,
  Menus,
  Services,
} from "../../../pages/platforms/cashier";
import { Source, Outsource } from "../../../pages/platforms/frontdesk/vendors";
import Expenses from "../../../pages/platforms/frontdesk/liabilities/accrueds";
import Temperature from "../../../pages/platforms/frontdesk/utilities/temperature";
import Accrued from "../../../pages/platforms/frontdesk/liabilities/accrueds";

const frontdesk = [
  {
    name: "Dashboard",
    icon: "tachometer-alt",
    path: "/dashboard",
    component: Dashboard,
  },
  {
    name: "POS", // Point Of Sales
    path: "/pos",
    icon: "cogs",
    children: [
      {
        name: "Cashier",
        path: "/patients",
        component: ExperimentalPOS,
      },
      {
        name: "Sales",
        path: "/sales",
        component: Sales,
      },
      {
        name: "Ledger",
        path: "/ledger",
        component: Ledger,
      },
    ],
  },
  {
    name: "Transactions",
    path: "/transactions",
    icon: "cogs",
    children: [
      {
        name: "Tasks",
        path: "/task",
        component: Task,
      },
      {
        name: "Reports",
        path: "/reports",
        component: Report,
      },
      {
        name: "Tracker",
        path: "/tracker",
        component: Tracker,
      },
    ],
  },
  {
    name: "Offers", //viewing only
    path: "/offers",
    icon: "list",
    children: [
      {
        name: "Menus",
        path: "/menus",
        component: Menus,
      },
      {
        name: "Services",
        path: "/services",
        component: Services,
      },
    ],
  },
  {
    name: "Liability",
    icon: "tv",
    path: "/liability",
    children: [
      /**
       * obligation for services or goods received but not yet paid for by the accounting period's en
       * Electric bill
       * Water bill
       * WIFI bill
       * Rental
       */
      {
        name: "Accrued",
        title: "stocks",
        path: "/accrued",
        component: Accrued,
      },
      /**
       * an obligation that has already been settled or fulfilled
       * Paid Electric bill
       * Paid Water bill
       * Salary
       * Voucher / petty cash
       * etc.
       */
      {
        name: "Settled",
        title: "stocks",
        path: "/settled",
      },
      // {
      //   name: "Expenses",
      //   path: "/expenses",
      //   component: Expenses,
      // },
    ],
  },
  {
    name: "Statement",
    icon: "tv",
    path: "/statement",
    children: [
      {
        name: "Account",
        title: "stocks",
        path: "/account",
      },
      {
        name: "Billing",
        title: "stocks",
        path: "/billing",
      },
    ],
  },

  {
    name: "Purchases",
    path: "/purchases",
    icon: "cogs",
    children: [
      {
        name: "Request",
        path: "/request",
      },
      {
        name: "Received",
        path: "/received",
      },
      {
        name: "Completed",
        path: "/completed",
      },
    ],
  },
  {
    name: "Market",
    path: "/market",
    icon: "list",
  },
  {
    name: "Merchandise",
    path: "/merchandise",
    icon: "list",
    children: [
      {
        name: "Products",
        path: "/products",
      },
      {
        name: "Machines",
        path: "/machines",
      },
      {
        name: "Stocks",
        path: "/stocks",
      },
    ],
  },
  {
    name: "Logbooks",
    path: "/logbooks",
    icon: "books",
    children: [
      {
        name: "Chemistry",
        path: "/chemistry",
        component: Chemistry,
      },
      {
        name: "Electrolites",
        path: "/electrolite",
        component: Electrolite,
      },
      {
        name: "Hematology",
        path: "/hematology",
        component: Hermatology,
      },
      {
        name: "Urinalysis",
        path: "/urinalysis",
        component: Urinalysis,
      },
      {
        name: "Fecalysis",
        path: "/fecalysis",
        component: Fecalysis,
      },
      {
        name: "Serology",
        path: "/serology",
        component: Serology,
      },
      {
        name: "Miscellaneous",
        path: "/miscellaneous",
      },
    ],
  },
  {
    name: "Utilities",
    path: "/utilities",
    icon: "tools",
    children: [
      {
        name: "Temperature",
        path: "/temperature",
        component: Temperature,
      },
      {
        name: "Quality Control",
        path: "/qc",
      },
    ],
  },
  {
    name: "Vendors",
    path: "/vendors",
    icon: "handshake",
    children: [
      {
        name: "Outsource",
        path: "/outsource",
        component: Outsource,
      },
      {
        name: "Source",
        path: "/source",
        component: Source,
      },
    ],
  },
];

export default frontdesk;
