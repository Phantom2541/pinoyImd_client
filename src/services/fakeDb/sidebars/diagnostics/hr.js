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
        name: "ID Calibrator",
        title: "ID Calibrator",
        path: "/idCalibrator",
        icon: "user-tie",
        component: IdCalibrator,
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
];

export default humanresources;
