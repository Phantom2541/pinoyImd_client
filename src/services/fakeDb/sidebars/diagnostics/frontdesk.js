import Dashboard from "../../../../pages/platforms/frontdesk/dashboard";

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
} from "../../../../pages/platforms/frontdesk/reports";

import {
  Onboard,
  Reports,
} from "../../../../pages/platforms/laboratory/diagnostics";
import { Tasks } from "../../../../pages/platforms/frontdesk/diagnostics";
import { Menus, Services } from "../../../../pages/platforms/cashier";
// import Products from "../../../../pages/platforms/frontdesk/market/products";
// import productsGenerics from "../../../../pages/platforms/frontdesk/market/productsGenerics";
// import machines from "../../../../pages/platforms/SuperAdmin/commerce/assets/machines";
// import generics from "../../../../pages/platforms/frontdesk/market/generics";
// import medicines from "../../../pages/platforms/frontdesk/market/medicine";
import mentainance from "../../../../pages/platforms/frontdesk/market/mentainance";
import { Billings } from "../../../../pages/platforms/frontdesk/Sendouts";
import { SOA } from "../../../../pages/platforms/cashier";
import {
  Status,
  Admission,
  Cases,
  Test,
} from "../../../../pages/platforms/frontdesk";
import laboratoryRequestForm from "../../../../pages/platforms/frontdesk/laboratoryRequestForm";
  


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
} from "../../../../pages/templates";
import Sendouts from "../../../../pages/platforms/laboratory/diagnostics/sendouts";
import {
  ImageMagnifier,
  ImageDragAndDrop,
  ImageText,
} from "../../../../components/images";
import DrugTest from "../../../../pages/templates/drugTest";
import SubExpired from "../../../../pages/templates/subExpired";
import Stocks from "../../../../pages/platforms/frontdesk/market/stocks";

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
    id: "frontdesk-diagnostics",
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
        allowedFor: ["Laboratory"],
      },
    ],
  },
  {
    name: "Outsourcing",
    icon: "tv",
    path: "/outsource",
    title:
      "obtain (goods or a service) from an outside or foreign laboratories, especially in place of an internal source",
    allowedFor: ["Laboratory"],
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
    name: "Supply Hub",
    path: "/supply-hub",
    icon: "warehouse",
    title:
      "Centralized platform for requesting clinic supplies handled by procurement.",
    children: [
      {
        name: "Browse Supplies",
        path: "/supply-hub/browse",
        icon: "boxes",
        title: "Browse available items for internal request.",
        // component: BrowseSuppliesComponent, // ← add when available
      },
      // { put on topbar, save on indexDb
      //   name: "My Cart",
      //   path: "/cart",
      //   icon: "shopping-basket",
      //   title: "Add items for your request and submit to procurement.",
      //   component: CartComponent,
      // },
      {
        name: "My Requests",
        path: "/supply-hub/requests",
        icon: "tasks",
        title: "Track and manage your submitted supply requests.",
        children: [
          {
            name: "Submitted",
            path: "/supply-hub/requests/submitted",
            icon: "file-invoice",
            title: "Requests that are awaiting procurement action.",
            // component: SubmittedRequestsComponent,
          },
          {
            name: "To Receive",
            path: "/supply-hub/requests/to-receive",
            icon: "clipboard-list",
            title:
              "Requests that have been approved and are ready for receipt.",
            // component: ToReceiveRequestsComponent,
          },
          {
            name: "Completed",
            path: "/supply-hub/requests/completed",
            icon: "check-circle",
            title: "Requests that have been successfully received.",
            // component: CompletedRequestsComponent,
          },
          {
            name: "Cancelled",
            path: "/supply-hub/requests/cancelled",
            icon: "ban",
            title: "Requests that were withdrawn or rejected.",
            // component: CancelledRequestsComponent,
          },
        ],
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
        // component: productsGenerics,
      },
      {
        name: "products",
        path: "/products",
        icon: "cogs",
        title: "Inventory of available products for use or sale.",
        // component: Products,
      },
      {
        name: "Machines",
        path: "/merchandise/machines",
        icon: "laptop-code",
        title: "List and manage medical machines and diagnostic equipment.",
        // component: machines, // add your component here
      },
      {
        name: "Medicines",
        path: "/medicines",
        icon: "laptop-code",
        title: "Manage pharmaceutical stocks and generic drugs.",
        // component: generics, // add your component here
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
        component: Stocks,
      },
    ],
  },
  {
    name: "Reports",
    path: "/reports",
    icon: "file-alt",
    children: [
      {
        name: "Chemistry",
        path: "/laboratory/chemistry",
        icon: "flask",
        component: Chemistry,
        allowedFor: ["Laboratory"],
      },
      {
        name: "Hematology",
        path: "/laboratory/hematology",
        icon: "blood",
        component: Hematology,
        allowedFor: ["Laboratory"],
      },
      {
        name: "Urinalysis",
        path: "/laboratory/urinalysis",
        icon: "toilet-paper",
        component: Urinalysis,
        allowedFor: ["Laboratory"],
      },
      {
        name: "Fecalysis",
        path: "/laboratory/fecalysis",
        icon: "smile",
        component: Fecalysis,
        allowedFor: ["Laboratory"],
      },
      {
        name: "Serology",
        path: "/laboratory/serology",
        icon: "microscope",
        component: Serology,
        allowedFor: ["Laboratory"],
      },
      {
        name: "Miscellaneous",
        path: "/laboratory/miscellaneous",
        icon: "list",
        component: Miscellaneous,
        allowedFor: ["Laboratory"],
      },
      {
        name: "ECG",
        path: "/radiology/ecg",
        icon: "heartbeat",
        component: Ecg,
        allowedFor: ["Radiology"],
      },
      {
        name: "Ultrasound",
        path: "/radiology/ultrasound",
        icon: "user-md",
        component: Ultrasound,
        allowedFor: ["Radiology"],
      },
      {
        name: "Xray",
        path: "/radiology/xray",
        icon: "x-ray",
        component: Xray,
        allowedFor: ["Radiology"],
      },
      {
        name: "CT",
        path: "/radiology/ct",
        icon: "user-md",
        // component: CtComponent, // add your component
        allowedFor: ["Radiology"],
      },
      {
        name: "MRI",
        path: "/radiology/mri",
        icon: "user-md",
        // component: MriComponent, // add your component here
        allowedFor: ["Radiology"],
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
    id: "frontdesk-templates",
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
      {
        name: "Drug Test",
        path: "/templates/drugTest",
        icon: "calendar-alt",
        component: DrugTest,
      },
      {
        name: "Sub Expired",
        path: "/templates/subExpired",
        icon: "calendar-alt",
        component: SubExpired,
      },
    ],
  },
  {
    name: "Cases",
    icon: "tachometer-alt",
    path: "/cases",
    component: Cases,
  },
  {
    name: "Admission",
    icon: "tachometer-alt",
    path: "/admission",
    component: Admission,
  },
  {
    name: "LaboratoryRequestForm",
    icon: "tachometer-alt",
    path: "/requestform",
    component: laboratoryRequestForm,
  },
];

export default frontdesk;
