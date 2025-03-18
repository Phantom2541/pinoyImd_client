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
  Onboard,
  Tasks,
  Reports,
} from "../../../pages/platforms/frontdesk/diagnostics";

import { Menus, Services } from "../../../pages/platforms/cashier";
import { Source, Outsource } from "../../../pages/platforms/frontdesk/vendors";
import Temperature from "../../../pages/platforms/frontdesk/utilities/temperature";

import {
  Assurance,
  Controls,
} from "../../../pages/platforms/diagnostics/management";
import Products from "../../../pages/platforms/frontdesk/market/products";

const frontdesk = [
  {
    name: "bulletin board",
    icon: "tachometer-alt",
    path: "/frontdesk/bulletin",
    component: Dashboard,
  },
  {
    name: "Diagnostics",
    path: "/diagnostics",
    icon: "cogs",
    children: [
      {
        name: "Onboarding",
        path: "/onboarding",
        component: Onboard,
      },
      {
        name: "Tasks",
        path: "/task",
        component: Tasks,
      },
      {
        name: "Reports",
        path: "/reports",
        component: Reports,
      },
      {
        name: "Temperature",
        path: "/temperature",
        component: Temperature,
      },
      {
        name: "Quality Management",
        icon: "tv",
        path: "/quality",
        children: [
          {
            name: "Quality Assurance(QA)",
            path: "/management/external",
            component: Assurance,
          },
          {
            name: "Quality Control(QC)",
            path: "/management/internal",
            component: Controls,
          },
        ],
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
    children: [
      {
        name: "Products",
        path: "/products",
        component: Products,
      },
    ],
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
