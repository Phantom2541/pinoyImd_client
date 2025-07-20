import Dashboard from "../../../pages/platforms/hr/dashboard";
// import Payrolls from "../../../pages/platforms/hr/accured/payrolls";
import Payrolls from "../../../pages/platforms/accounting/payroll";
import { Employees } from "../../../pages/platforms/headquarter/file201";
import { Staffs, Physicians } from "../../../pages/platforms/hr";
import stockHolder from "../../../pages/platforms/hr/personnel/stockHolder";
import { Schedule } from "../../../pages/platforms/hr/dtr";
import {
  Services,
  Menus,
  Applicants,
} from "../../../pages/platforms/manager/settings";
import OrgChart from "../../../pages/platforms/hr/organizationChart";
const hr = [
  {
    name: "Dashboard",
    icon: "tachometer-alt",
    path: "/hr/bulletin",
    component: Dashboard,
  },
  {
    name: "Employees",
    path: "/file",
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
        component: OrgChart,
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
        name: "Employment",
        icon: "list",
        path: "/finance/employment",
      },
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
];

export default hr;
