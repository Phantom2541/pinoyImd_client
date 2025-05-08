import Dashboard from "../../../pages/platforms/frontdesk/dashboard";

import {
  Fecalysis,
  Hematology,
  Urinalysis,
  Chemistry,
  Electrolyte,
  Serology,
  Xray,
  Ultrasound,
  Ecg,
} from "../../../pages/platforms/frontdesk/reports";

import {
  Onboard,
  Tasks,
  Reports,
} from "../../../pages/platforms/frontdesk/diagnostics";

import { Menus, Services } from "../../../pages/platforms/cashier";
import Temperature from "../../../pages/platforms/diagnostics/management/temperature";

import {
  Assurance,
  Controls,
} from "../../../pages/platforms/diagnostics/management";
import Products from "../../../pages/platforms/frontdesk/market/products";
import { Billings } from "../../../pages/platforms/frontdesk/Sendouts";
import { SOA } from "../../../pages/platforms/cashier";

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
    path: "/bulletin",
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
        name: "Tracker",
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
    name: "Sendouts (SOA)",
    icon: "tv",
    path: "/outsource",
    children: [
      {
        name: "Logbook",
        path: "/logbook",
        title: "stocks",
        icon: "balance-scale",
        component: SOA,
      },

      {
        name: "Billing",
        path: "/billing",
        title: "stocks",
        icon: "file-invoice",
        component: Billings,
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
        name: "laboratory",
        path: "/laboratory",
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
      {
        name: "Radiology",
        path: "/radiology",
        icon: "list",
        children: [
          {
            name: "ECG",
            path: "/ecg",
            icon: "heartbeat",
            component: Ecg,
          },
          {
            name: "Ultrasound",
            path: "/ultrasound",
            icon: "user-md",
            component: Ultrasound,
          },
          {
            name: "Xray",
            path: "/xray",
            icon: "user-md",
            component: Xray,
          },
          {
            name: "CT",
            path: "/ct",
            icon: "user-md",
          },
          {
            name: "MRI",
            path: "/mri",
            icon: "user-md",
          },
        ],
      },
    ],
  },
  {
    name: "Catalogs", //viewing only
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
        name: "Services",
        path: "/services",
        icon: "list",
        component: Services,
      },
      {
        name: "Products",
        path: "/products",
        icon: "cogs",
        component: Products,
      },
      {
        name: "Consumables",
        icon: "tv",
        path: "/consumables",
        children: [
          {
            name: "Preanalytical",
            path: "/preanalytical",
            icon: "check-circle",
            component: Assurance,
          },
          {
            name: "Analytical",
            path: "Analytical",
            icon: "balance-scale",
            component: Controls,
          },
          {
            name: "Postanalytical",
            path: "/postanalytical",
            icon: "thermometer-half",
            component: Temperature,
          },
        ],
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
        icon: "list",
        component: Tablestemplate,
      },
      {
        name: "Collapsables",
        path: "/collapsables",
        icon: "align-justify",
        component: Collapsable,
      },
      {
        name: "Calendars",
        path: "/calendars",
        icon: "calendar-alt",
        component: Calendar,
      },
      {
        name: "DragDrop",
        path: "/DragDrop",
        icon: "drag",
        component: DragDrop,
      },
      {
        name: "Search",
        path: "/search",
        icon: "search",
        component: Search,
      },
      {
        name: "Cards",
        path: "/card",
        icon: "card",
        // component: Card,
      },
    ],
  },
];

export default frontdesk;
