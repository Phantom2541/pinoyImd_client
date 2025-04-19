import Dashboard from "../../../pages/platforms/manager/dashboard";
import Services from "../../../pages/platforms/manager/settings/services";
import Menus from "../../../pages/platforms/manager/settings/menus";
import Banner from "../../../pages/platforms/manager/settings/banner";
import Logo from "../../../pages/platforms/manager/settings/logo";
import UserManual from "../../../pages/platforms/manager/manual/index";
import PurRequest from "../../../pages/platforms/manager/purchases/request";
import Procurments from "../../../pages/platforms/headquarter/file201/procurments";
import ExperentalStaff from "../../../pages/platforms/headquarter/file201/staff";
import Equipments from "../../../pages/platforms/headquarter/file201/equipments";
import Payrolls from "../../../pages/platforms/manager/responsibilities/payroll";
import Employees from "../../../pages/platforms/headquarter/file201/employees";
import Providers from "../../../pages/platforms/manager/provider";
import {
  Remittances,
  Sales,
  ExperimentalLedger,
} from "../../../pages/platforms/manager/businessOperations";
import {
  Vouchers,
  Payables,
  Receivables,
  Payments,
  SOA,
} from "../../../pages/platforms/manager/accrued";

const manager = [
  {
    name: "Dashboard",
    icon: "tachometer-alt",
    path: "/dashboard",
    component: Dashboard,
  },
  {
    name: "Business Operations",
    path: "/operations",
    icon: "cogs",
    children: [
      {
        name: "Sales",
        path: "/sales",
        component: Sales,
      },
      {
        name: "Remittances",
        path: "/remittances",
        component: Remittances,
      },
      {
        name: "Ledger",
        path: "/ledger",
        component: ExperimentalLedger,
      },
    ],
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
    name: "Accrued", // liabilities
    path: "/accrued",
    icon: "tv",
    title: "liabilities and obligations",
    children: [
      /**
       * obligation for services or goods received but not yet paid for by the accounting period's en
       *  unpaid bills (Water, Electricity, SOA  & etc.)
       * Electric bill
       * Water bill
       * WIFI bill
       * Rental
       */
      {
        name: "Accounts Payable (A/P)",
        path: "/payables",
        icon: "file-invoice-dollar",
        title: "Outstanding payments for suppliers and utilities.",
        component: Payables,
      },
      {
        name: "Payments",
        path: "/payments",
        icon: "dollar-sign",
        title: "List of payments made.",
        component: Payments,
      },
      /**
       * SOA from A/P
       * confirming the SOA listed in A/P
       */
      {
        name: "Statement of Account",
        path: "/soa",
        icon: "balance-scale",
        title: "Outsourced services from monthly sales",
        component: SOA,
      },
      /**
       * Generated monthly Collections from vouchers  (SOA)
       */
      {
        name: "Accounts Receivable (A/R)",
        path: "/receivables",
        icon: "money-bill",
        title: "Unpaid invoices from corporate accounts or HMOs",
        component: Receivables,
      },
      /**
       * Unproessed Vouchers
       * from daily sales
       */
      {
        name: "Vouchers",
        path: "/vouchers",
        icon: "receipt",
        title: "Vouchers from daily sales",
        component: Vouchers,
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
        name: "File 201",
        path: "/file201",
        component: Employees,
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
        name: "Logo",
        path: "/logo",
        component: Logo,
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
    name: "User Manual",
    icon: "book-open",
    path: "/user/manual",
    component: UserManual,
  },
];

export default manager;
