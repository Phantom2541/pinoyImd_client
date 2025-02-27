import Dashboard from "../../../pages/platforms/manager/dashboard";
import Services from "../../../pages/platforms/manager/settings/services";
import Menus from "../../../pages/platforms/manager/settings/menus";
import Banner from "../../../pages/platforms/manager/settings/banner";
import Logo from "../../../pages/platforms/manager/settings/logo";
import Tieups from "../../../pages/platforms/manager/settings/tieups";
import Physicians from "../../../pages/platforms/headquarter/file201/physicians";
import UserManual from "../../../pages/platforms/manager/manual/index";
import PurRequest from "../../../pages/platforms/manager/purchases/request";
import Heads from "../../../pages/platforms/headquarter/file201/heads";
import Procurments from "../../../pages/platforms/headquarter/file201/procurments";

// import Staff from "../../../pages/platforms/manager/file201/oldstaff";
import ExperentalStaff from "../../../pages/platforms/headquarter/file201/staff";

import Equipments from "../../../pages/platforms/headquarter/file201/equipments";
import Payrolls from "../../../pages/platforms/manager/responsibilities/payroll";
//import Assurance from "../../../pages/platforms/manager/responsibilities/liability/quality/assurance";
// Controls from "../../../pages/platforms/manager/responsibilities/liability/quality/controls";
import Sales from "../../../pages/platforms/manager/pos/sales";
// import Ledger from "../../../pages/platforms/manager/pos/ledger";
// import newLedger from "../../../pages/platforms/cashier/pos/newledger";
import Employees from "../../../pages/platforms/headquarter/file201/employees";
import Applicants from "../../../pages/platforms/manager/settings/applicants";
import Branches from "../../../pages/platforms/manager/branches";
import Providers from "../../../pages/platforms/manager/provider";
import SABranches from "../../../pages/platforms/manager/SABranches";
import SACompany from "../../../pages/platforms/manager/SACompany";
import ExperimentalLedger from "../../../pages/platforms/manager/pos/ExperimentalLedger";
import Remmitances from "../../../pages/platforms/manager/pos/remittances";

const manager = [
  {
    name: "Dashboard",
    icon: "tachometer-alt",
    path: "/dashboard",
    component: Dashboard,
  },
  {
    name: "User Manual",
    icon: "book-open",
    path: "/user/manual",
    component: UserManual,
  },
  {
    name: "Procurement",
    icon: "book-open",
    path: "/po",
    children: [
      {
        name: "Requisition", // 1. Pending, 2. submit
        path: "/request",
        component: PurRequest,
      },
      {
        name: "Approval ", // 1. Pending, 2. Approved 3. Denied
        path: "/process",
      },
      {
        name: "Tracking", // 1. confirmation, 2. preparation, 3. shipped, 4. delivered
        path: "/tracking",
      },
      {
        name: "Records", // monthly view
        path: "/records",
      },
    ],
  },
  {
    name: "Responsibilities",
    icon: "wrench",
    path: "/liability",
    children: [
      {
        name: "Supplies",
        path: "/reagents",
      },
      {
        name: "P M S",
        path: "/preventive/maintenenace/schedule",
      },
      // {
      //   name: "Q A",
      //   path: "/quality/assurance",
      //   component: Assurance,
      // },
      // {
      //   name: "Q C",
      //   path: "/quality/controls",
      //   component: Controls,
      // },
      {
        name: "Payroll",
        path: "/payroll",
        component: Payrolls,
      },
      {
        name: "Cashier",
        path: "/cashier",
      },
    ],
  },
  {
    name: "Settings",
    path: "/settings",
    icon: "cogs",
    children: [
      {
        name: "Staff",
        path: "/expstaff",
        component: ExperentalStaff,
      },
      {
        name: "Heads",
        path: "/heads",
        component: Heads,
      },
      {
        name: "File 201",
        path: "/file201",
        component: Employees,
      },
      {
        name: "Physicians",
        path: "/physicians",
        component: Physicians,
      },
      {
        name: "Applicants",
        path: "/applicants",
        component: Applicants,
      },
      {
        name: "Equipments",
        path: "/equipments",
        component: Equipments,
      },
      {
        name: "Procurement",
        path: "/procurement",
        component: Procurments,
      },
      {
        name: "Menus",
        path: "/menus",
        component: Menus,
      },
      {
        name: "Services",
        path: "/services",
        component: Services,
      },
      {
        name: "Banner",
        path: "/banners",
        component: Banner,
      },
      {
        name: "Logos",
        path: "/logos",
        component: Logo,
      },
      {
        name: "Suppliers",
        path: "/suppliers",
      },
      {
        name: "Sourcing",
        path: "/sourcing",
      },
      {
        name: "Tie Up",
        path: "/tieup",
        component: Tieups,
      },
    ],
  },
  {
    name: "POS",
    path: "/pos",
    icon: "cogs",
    children: [
      {
        name: "Sales",
        path: "/sales",
        component: Sales,
      },
      {
        name: "Remmitances",
        path: "/remmitances",
        component: Remmitances,
      },
      {
        name: "Ledger",
        path: "/ledger",
        component: ExperimentalLedger,
      },
    ],
  },
  {
    name: "Provider",
    path: "/provider",
    icon: "university",
    component: Providers,
  },
  {
    name: " Branch",
    path: "/branch",
    icon: "building",
    component: Branches,
  },
  {
    name: "SA Branches", //Super Admin
    path: "/SABranches",
    icon: "university",
    component: SABranches,
  },
  {
    name: "SA Company", //Super Admin
    path: "/SACompany",
    icon: "building",
    component: SACompany,
  },
];

export default manager;
