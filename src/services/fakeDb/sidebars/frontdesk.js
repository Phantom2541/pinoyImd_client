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

import {
  Tablestemplate,
  Collapsable,
  Calendar,
  DragDrop,
  Search,
} from "../../../pages/templates";

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
        icon: "tv",
        component: Onboard,
      },
      {
        name: "Tasks",
        path: "/task",
        icon: "clipboard-list",
        component: Tasks,
      },
      {
        name: "Reports",
        path: "/reports",
        icon: "file-alt",
        component: Reports,
      },
      {
        name: "Quality Management",
        icon: "tv",
        path: "/quality",
        children: [
          {
            name: "Quality Assurance(QA)",
            path: "/management/external",
            icon: "check-circle",
            component: Assurance,
          },
          {
            name: "Quality Control(QC)",
            path: "/management/internal",
            icon: "balance-scale",
            component: Controls,
          },
          {
            name: "Temperature",
            path: "/temperature",
            icon: "thermometer-half",
            component: Temperature,
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
        icon: "bars",
        component: Menus,
      },
      /**
       *  a single service
       */
      {
        name: "examinations",
        path: "/services",
        icon: "list",
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
        icon: "dollar-sign",
        path: "/account",
      },
      {
        name: "Billing",
        title: "stocks",
        icon: "file-invoice",
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
        icon: "shopping-cart",
      },
      {
        name: "Received",
        path: "/received",
        icon: "truck-loading",
      },
      {
        name: "Completed",
        path: "/completed",
        icon: "check-circle",
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
        icon: "cogs",
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
        icon: "cogs",
      },
      {
        name: "Machines",
        path: "/machines",
        icon: "laptop-code",
      },
      {
        name: "Stocks",
        path: "/stocks",
        icon: "box",
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
            icon: "flask",
            component: Chemistry,
          },
          {
            name: "Electrolytes",
            path: "/Electrolyte",
            icon: "vials",
            component: Electrolyte,
          },
          {
            name: "Hematology",
            path: "/hematology",
            icon: "blood",
            component: Hematology,
          },
          {
            name: "Urinalysis",
            path: "/urinalysis",
            icon: "toilet-paper",
            component: Urinalysis,
          },
          {
            name: "Fecalysis",
            path: "/fecalysis",
            icon: "smile",
            component: Fecalysis,
          },
          {
            name: "Serology",
            path: "/serology",
            icon: "microscope",
            component: Serology,
          },
          {
            name: "Miscellaneous",
            path: "/miscellaneous",
            icon: "list",
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
  /**
   * For refereces of new components
   */
  {
    name: "Templates ",
    path: "/templates ",
    icon: "list",
    children: [
      {
        name: "Tables",
        path: "/tables",
        component: Tablestemplate,
        icon: "table",
      },
      {
        name: "Collapsables",
        path: "/collapsables",
        component: Collapsable,
        icon: "align-justify",
      },
      {
        name: "Calendars",
        path: "/calendars",
        component: Calendar,
        icon: "calendar-alt",
      },
      {
        name: "DragDrop",
        path: "/DragDrop",
        component: DragDrop,
        icon: "calendar-alt",
      },
      {
        name: "Search",
        path: "/search",
        component: Search,
        icon: "calendar-alt",
      },
    ],
  },
];

export default frontdesk;
