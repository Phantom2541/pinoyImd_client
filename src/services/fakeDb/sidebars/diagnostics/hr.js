import Dashboard from "../../../../pages/platforms/hr/dashboard";
import Payrolls from "../../../../pages/platforms/accounting/payroll";
import stockHolder from "../../../../pages/platforms/hr/personnel/stockHolder";
import {
  Schedule,
  Staffs,
  Physicians,
  Employees,
  Heads,
  Applicants,
} from "../../../../pages/platforms/hr";
import { Services, Menus } from "../../../../pages/platforms/accounting";
import IdCalibrator from "../../../../pages/platforms/hr/personnel/idCalibrator";
import IdGenerator from "../../../../pages/platforms/hr/personnel/idGenerator";
import { Admission, Cases } from "../../../../pages/platforms/frontdesk";
import {
  Tablestemplate,
  Collapsable,
  Calendar,
  DragDrop,
  Search,
  Cards,
  Loader,
  InputSearch,
  // QrCodePage,
  HMOCapture,
} from "../../../../pages/templates";
import {
  ImageMagnifier,
  ImageDragAndDrop,
  ImageText,
} from "../../../../components/images";
import DrugTest from "../../../../pages/templates/drugTest";
import SubExpired from "../../../../pages/templates/subExpired";

const humanresources = [
  {
    name: "Dashboard",
    icon: "tachometer-alt",
    path: "/bulletin",
    component: Dashboard,
  },
  {
    name: "Employees",
    path: "/employees",
    icon: "tv",
    children: [
      {
        name: "Attendance",
        title: "Employee daily attendance tracker.",
        path: "/attendances",
        icon: "clock",
        // component: Calender,
      },
      {
        name: "Schedule",
        title: "Employee daily attendance tracker.",
        path: "/schedule",
        icon: "clock",
        component: Schedule,
      },
      {
        name: "Staff",
        title: "Active staff directory.",
        path: "/staff",
        icon: "user",
        component: Staffs,
      },
      {
        name: "Heads",
        title: "Active staff directory.",
        path: "/heads",
        icon: "user",
        component: Heads,
      },
      {
        name: "File 201",
        title: "Comprehensive employee records.",
        path: "/file201",
        icon: "folder",
        component: Employees,
      },
      {
        name: "Physicians",
        title: "In-house medical doctors.",
        path: "/physicians",
        icon: "stethoscope",
        component: Physicians,
      },
      {
        name: "Applicants",
        title: "Job applicants and interview status.",
        path: "/petitioners",
        icon: "user-plus",
        component: Applicants,
      },
      {
        name: "Stockholders",
        title: "Company stakeholders and investors.",
        path: "/stockHolder",
        icon: "user-tie",
        component: stockHolder,
      },
      {
        name: "Org Chart",
        title: "Organization Chart",
        path: "/organizationChart",
        icon: "user-tie",
        // component: OrgChart,
      },
      {
        name: "Card",
        path: "/card/Calibrator",
        icon: "tv",
        children: [
          {
            name: " Calibrator",
            title: "CARD Calibrator",
            path: "/card/Calibrator",
            icon: "user-tie",
            component: IdCalibrator,
          },
          {
            name: "Generator",
            title: "CARD Generator",
            path: "/card/Generator",
            icon: "user-tie",
            component: IdGenerator,
          },
        ],
      },
    ],
  },
  {
    name: "Accrued",
    path: "/accrued",
    icon: "tv",
    children: [
      {
        name: "Payroll",
        path: "/payroll",
        icon: "money-bill",
        component: Payrolls,
      },
      {
        name: "Check",
        icon: "list",
        path: "/checks",
      },
    ],
  },
  {
    name: "Finance",
    path: "/finance",
    icon: "tv",
    children: [
      {
        name: "Menus",
        path: "/finance/menus",
        icon: "cogs",
        component: Menus,
      },
      {
        name: "Services",
        path: "/finance/services",
        icon: "tools",
        component: Services,
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
    ],
  },
];

export default humanresources;
