import Services from "../../../pages/platforms/manager/settings/services";
import Menus from "../../../pages/platforms/manager/settings/menus";
import Dashboard from "../../../pages/platforms/hr/dashboard";
import Payrolls from "../../../pages/platforms/hr/accured/payrolls";

const hr = [
  {
    name: "Dashboard",
    icon: "tachometer-alt",
    path: "/dashboard",
    component: Dashboard,
  },
  {
    name: "File 201",
    path: "/file",
    icon: "tv",
    children: [
      {
        name: "Employee's",
        title: "stocks",
        icon: "boxes",
        path: "/file/employees",
      },
      {
        name: "Applicant",
        title: "stocks",
        icon: "boxes",
        path: "/file/apllicants",
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
        icon: "list",
        path: "/payroll",
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
        component: Menus,
      },
      {
        name: "Services",
        path: "/finance/services",
        component: Services,
      },
    ],
  },
];

export default hr;
