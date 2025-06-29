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
import productsGenerics from "../../../pages/platforms/frontdesk/market/productsGenerics";
import machines from "../../../pages/platforms/frontdesk/market/machines";
import generics from "../../../pages/platforms/frontdesk/market/generics";
// import medicines from "../../../pages/platforms/frontdesk/market/medicine";
import mentainance from "../../../pages/platforms/frontdesk/market/mentainance";
import { Billings } from "../../../pages/platforms/frontdesk/Sendouts";
import { SOA } from "../../../pages/platforms/cashier";

import {
  Tablestemplate,
  Collapsable,
  Calendar,
  DragDrop,
  Search,
  Cards,
} from "../../../pages/templates";
import { temperatures } from "../../redux/slices/diagnostics";
import Sendouts from "../../../pages/platforms/frontdesk/diagnostics/sendouts";

const frontdesk = [
  {
    name: "Bulletin Board",
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
        path: "/diagnostics/onboarding",
        icon: "tv",
        component: Onboard,
      },
      {
        name: "Tasks",
        path: "/diagnostics/tasks",
        icon: "clipboard-list",
        component: Tasks,
      },
      {
        name: "Tracker",
        path: "/diagnostics/reports",
        icon: "file-alt",
        component: Reports,
      },
      {
        name: "Sendouts",
        path: "/diagnostics/sendouts",
        icon: "arrow-left",
        component: Sendouts,
      },
      {
        name: "Quality Management",
        icon: "tv",
        path: "/diagnostics/quality",
        children: [
          {
            name: "Quality Assurance (QA)",
            path: "/diagnostics/quality/external",
            icon: "check-circle",
            component: Assurance,
          },
          {
            name: "Quality Control (QC)",
            path: "/diagnostics/quality/internal",
            icon: "balance-scale",
            component: Controls,
          },
          {
            name: "Temperature",
            path: "/diagnostics/quality/temperature",
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
        name: "Billing",
        path: "/outsource/billing",
        icon: "file-invoice",
        component: Billings,
      },
      {
        name: "Logbook",
        path: "/outsource/logbook",
        icon: "balance-scale",
        component: SOA,
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
        // component: RequestComponent, // add your component here
      },
      {
        name: "Received",
        path: "/received",
        icon: "truck-loading",
        // component: ReceivedComponent, // add your component here
      },
      {
        name: "Completed",
        path: "/completed",
        icon: "check-circle",
        // component: CompletedComponent, // add your component here
      },
    ],
  },
  {
    name: "Merchandise",
    path: "/merchandise",
    icon: "boxes",
    children: [
      {
        name: "productsGenerics",
        path: "/productsGenerics",
        icon: "cogs",
        // component: productsGenerics
      },
      {
        name: "products",
        path: "/products",
        icon: "cogs",
        component: Products,
      },
      {
        name: "Machines",
        path: "/merchandise/machines",
        icon: "laptop-code",
        component: machines, // add your component here
      },
      {
        name: "Medicines",
        path: "/medicines",
        icon: "laptop-code",
        component: generics, // add your component here
      },
      // {
      //   name: "Medicines",
      //   path: "/medicines",
      //   icon: "laptop-code",
      //   component: medicines, // add your component here
      // },
      {
        name: "Mentainance",
        path: "/merchandise/mentainance",
        icon: "laptop-code",
        component: mentainance,
      },
      {
        name: "Stocks",
        path: "/merchandise/stocks",
        icon: "box",
        // component: StocksComponent, // add your component here
      },
    ],
  },
  {
    name: "Reports",
    path: "/reports",
    icon: "file-alt",
    children: [
      {
        name: "Laboratory",
        path: "/reports/laboratory",
        icon: "flask",
        children: [
          {
            name: "Chemistry",
            path: "/reports/laboratory/chemistry",
            icon: "flask",
            component: Chemistry,
          },
          {
            name: "Hematology",
            path: "/reports/laboratory/hematology",
            icon: "blood",
            component: Hematology,
          },
          {
            name: "Urinalysis",
            path: "/reports/laboratory/urinalysis",
            icon: "toilet-paper",
            component: Urinalysis,
          },
          {
            name: "Fecalysis",
            path: "/reports/laboratory/fecalysis",
            icon: "smile",
            component: Fecalysis,
          },
          {
            name: "Serology",
            path: "/reports/laboratory/serology",
            icon: "microscope",
            component: Serology,
          },
          {
            name: "Miscellaneous",
            path: "/reports/laboratory/miscellaneous",
            icon: "list",
            // component: MiscellaneousComponent, // add your component here
          },
        ],
      },
      {
        name: "Radiology",
        path: "/reports/radiology",
        icon: "x-ray",
        children: [
          {
            name: "ECG",
            path: "/reports/radiology/ecg",
            icon: "heartbeat",
            component: Ecg,
          },
          {
            name: "Ultrasound",
            path: "/reports/radiology/ultrasound",
            icon: "user-md",
            component: Ultrasound,
          },
          {
            name: "Xray",
            path: "/reports/radiology/xray",
            icon: "x-ray",
            component: Xray,
          },
          {
            name: "CT",
            path: "/reports/radiology/ct",
            icon: "user-md",
            // component: CtComponent, // add your component here
          },
          {
            name: "MRI",
            path: "/reports/radiology/mri",
            icon: "user-md",
            // component: MriComponent, // add your component here
          },
        ],
      },
    ],
  },
  {
    name: "Catalogs",
    path: "/offers",
    icon: "list",
    children: [
      {
        name: "Menus",
        path: "/offers/menus",
        icon: "bars",
        component: Menus,
      },
      {
        name: "Services",
        path: "/offers/services",
        icon: "list",
        component: Services,
      },
      {
        name: "Products",
        path: "/offers/products",
        icon: "cogs",
        // component: products,
      },
      {
        name: "Consumables",
        icon: "tv",
        path: "/offers/consumables",
        children: [
          {
            name: "Preanalytical",
            path: "/offers/consumables/preanalytical",
            icon: "check-circle",
            component: Assurance,
          },
          {
            name: "Analytical",
            path: "/offers/consumables/analytical",
            icon: "balance-scale",
            component: Controls,
          },
          {
            name: "Postanalytical",
            path: "/offers/consumables/postanalytical",
            icon: "thermometer-half",
            component: Temperature,
          },
        ],
      },
    ],
  },
  {
    name: "Templates",
    path: "/templates",
    icon: "list",
    children: [
      {
        name: "Tables",
        path: "/templates/tables",
        icon: "list",
        component: Tablestemplate,
      },
      {
        name: "Collapsables",
        path: "/templates/collapsables",
        icon: "align-justify",
        component: Collapsable,
      },
      {
        name: "Calendars",
        path: "/templates/calendars",
        icon: "calendar-alt",
        component: Calendar,
      },
      {
        name: "DragDrop",
        path: "/templates/dragdrop",
        icon: "drag",
        component: DragDrop,
      },
      {
        name: "Search",
        path: "/templates/search",
        icon: "search",
        component: Search,
      },
      {
        name: "Cards",
        path: "/templates/cards",
        icon: "card",
        component: Cards,
      },
    ],
  },
];

export default frontdesk;
