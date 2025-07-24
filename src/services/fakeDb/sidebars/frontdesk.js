import Dashboard from "../../../pages/platforms/frontdesk/dashboard";

import {
  Fecalysis,
  Hematology,
  Urinalysis,
  Chemistry,
  Serology,
  Xray,
  Ultrasound,
  Ecg,
  Miscellaneous,
} from "../../../pages/platforms/frontdesk/reports";
;

import {
  Onboard,
  Tasks,
  Reports,
} from "../../../pages/platforms/frontdesk/diagnostics";

import { Menus, Services } from "../../../pages/platforms/cashier";
import Products from "../../../pages/platforms/frontdesk/market/products";
import productsGenerics from "../../../pages/platforms/frontdesk/market/productsGenerics";
import machines from "../../../pages/platforms/frontdesk/market/machines";
import generics from "../../../pages/platforms/frontdesk/market/generics";
// import medicines from "../../../pages/platforms/frontdesk/market/medicine";
import mentainance from "../../../pages/platforms/frontdesk/market/mentainance";
import { Billings } from "../../../pages/platforms/frontdesk/Sendouts";
import { SOA } from "../../../pages/platforms/cashier";
import { Status } from "../../../pages/platforms/frontdesk";

import {
  Tablestemplate,
  Collapsable,
  Calendar,
  DragDrop,
  Search,
  Cards,
  Schedule,
  Loader,
  InputSearch,
  // QrCodePage,
  HMOCapture,
} from "../../../pages/templates";
import Sendouts from "../../../pages/platforms/frontdesk/diagnostics/sendouts";
import {
  ImageMagnifier,
  ImageDragAndDrop,
  ImageText,
} from "../../../components/images";

const frontdesk = [
  {
    name: "Bulletin Board",
    icon: "tachometer-alt",
    path: "/bulletin",
    title:
      "Displays announcements and system-wide updates for the frontdesk team.",
    component: Dashboard,
  },
  {
    name: "Diagnostics",
    path: "/diagnostics",
    icon: "cogs",
    title:
      "Manage patient diagnostics – onboarding, task queue, tracking, and sendouts.",
    children: [
      {
        name: "Onboarding",
        path: "/onboarding",
        icon: "tv",
        title: "Register and onboard patients for diagnostic procedures.",
        component: Onboard,
      },
      {
        name: "Tasks",
        path: "/tasks",
        icon: "clipboard-list",
        title: "View and manage pending diagnostic tasks for patients.",
        component: Tasks,
      },
      {
        name: "Tracker",
        path: "/reports",
        icon: "file-alt",
        title: "Monitor the progress and reports of diagnostics performed.",
        component: Reports,
      },
      {
        name: "Sendouts",
        path: "/sendouts",
        icon: "arrow-left",
        title: "Manage sendouts to external laboratories for outsourced tests.",
        component: Sendouts,
      },
    ],
  },
  {
    name: "Outsource",
    icon: "tv",
    path: "/outsource",
    title:
      "Monitor, record, and bill sendouts to outsourced diagnostic partners.",
    children: [
      {
        name: "Status",
        path: "/status",
        icon: "file-invoice",
        title: "Track acceptance or rejection of outsourced tests.",
        component: Status,
      },
      {
        name: "Logbook",
        path: "/logbook",
        icon: "balance-scale",
        title: "View monthly records of sendouts and charging status.",
        component: SOA,
      },
      {
        name: "Billing (SOA)",
        path: "/billing",
        icon: "file-invoice",
        title: "Generate and view billing statements for outsourced services.",
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
    title:
      "Manage inventory and product listings like machines, medicines, and consumables.",
    children: [
      {
        name: "productsGenerics",
        path: "/productsGenerics",
        icon: "cogs",
        title: "List of generic categories for medical products.",
        component: productsGenerics,
      },
      {
        name: "products",
        path: "/products",
        icon: "cogs",
        title: "Inventory of available products for use or sale.",
        component: Products,
      },
      {
        name: "Machines",
        path: "/merchandise/machines",
        icon: "laptop-code",
        title: "List and manage medical machines and diagnostic equipment.",
        component: machines, // add your component here
      },
      {
        name: "Medicines",
        path: "/medicines",
        icon: "laptop-code",
        title: "Manage pharmaceutical stocks and generic drugs.",
        component: generics, // add your component here
      },
      {
        name: "Mentainance",
        path: "/merchandise/mentainance",
        icon: "laptop-code",
        title: "Track machine maintenance and calibration schedules.",
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
          component: Miscellaneous,
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
          },
          {
            name: "Analytical",
            path: "/offers/consumables/analytical",
            icon: "balance-scale",
          },
          {
            name: "Postanalytical",
            path: "/offers/consumables/postanalytical",
            icon: "thermometer-half",
            // component: ,
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
        name: "Image Drag and Drop",
        path: "/templates/image",
        icon: "calendar-alt",
        component: ImageDragAndDrop,
      },
      {
        name: "Cards",
        path: "/templates/cards",
        icon: "card",
        component: Cards,
      },
      {
        name: "Schedule",
        path: "/templates/schedule",
        icon: "calendar-alt",
        component: Schedule,
      },
      {
        name: "Loader",
        path: "/templates/loader",
        icon: "calendar-alt",
        component: Loader,
      },
      {
        name: "InputSearch",
        path: "/templates/inputSearch",
        icon: "calendar-alt",
        component: InputSearch,
      },
      {
        name: "OCR",
        path: "/templates/imgText",
        icon: "calendar-alt",
        component: ImageText,
      },
      {
        name: "Image Magnifier",
        path: "/templates/imageMagnifier",
        icon: "calendar-alt",
        component: ImageMagnifier,
      },
      {
        name: "HMO Capture",
        path: "/templates/camera",
        icon: "calendar-alt",
        component: HMOCapture,
      },
    ],
  },
];

export default frontdesk;
