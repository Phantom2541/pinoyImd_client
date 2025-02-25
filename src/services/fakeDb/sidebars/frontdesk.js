import Dashboard from "../../../pages/platforms/frontdesk/dashboard";

import {
  Fecalysis,
  Hematology,
  Urinalysis,
  Chemistry,
  Electrolyte,
  Serology,
} from "../../../pages/platforms/frontdesk/reports";

import {
  Task,
  Report,
  Tracker,
} from "../../../pages/platforms/frontdesk/diagnostics";

import { Menus, Services } from "../../../pages/platforms/cashier";
import { Source, Outsource } from "../../../pages/platforms/frontdesk/vendors";
import Temperature from "../../../pages/platforms/frontdesk/utilities/temperature";
import Accrued from "../../../pages/platforms/frontdesk/liabilities/accrueds";
import Controls from "../../../pages/platforms/manager/responsibilities/liability/quality/controls";
import Assurance from "../../../pages/platforms/manager/responsibilities/liability/quality/assurance";

const frontdesk = [
  {
    name: "Dashboard",
    icon: "tachometer-alt",
    path: "/dashboard",
    component: Dashboard,
  },
  {
    name: "Diagnostics",
    path: "/transactions",
    icon: "cogs",
    children: [
      {
        name: "Onboarding",
        path: "/onboarding",
        component: Task,
      },
      {
        name: "Tasks",
        path: "/task",
        component: Report,
      },
      {
        name: "Reports",
        path: "/reports",
        component: Tracker,
      },
    ],
  },
  {
    name: "Services", //viewing only
    path: "/offers",
    icon: "list",
    children: [
      /**
       * a group of related services
       */
      {
        name: "Menus",
        path: "/menus",
        component: Menus,
      },
      /**
       *  a single service
       */
      {
        name: "examinations",
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
    name: "Reports",
    path: "/reports",
    icon: "cogs",
    children: [
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
            name: "Electrolytes",
            path: "/Electrolyte",
            component: Electrolyte,
          },
          {
            name: "Hematology",
            path: "/hematology",
            component: Hematology,
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
    ],
  },
  {
    name: "Vendors",
    path: "/vendors",
    icon: "handshake",
    children: [
      /**
       * where client came from
       */
      {
        name: "Source",
        path: "/source",
        component: Source,
      },
      /**
       * where we send services that are not available on the store
       */
      {
        name: "Outsource",
        path: "/outsource",
        component: Outsource,
      },
      {
        name: "Controls",
        path: "/controls",
        component: Controls,
      },
      {
        name: "Assurance",
        path: "/assurance",
        component: Assurance,
      },
      /**
       * have a multi-vendor relationship
       */
      {
        name: "Tieup",
        path: "/tieup",
        // component: Source,
      },
    ],
  },
];

export default frontdesk;
