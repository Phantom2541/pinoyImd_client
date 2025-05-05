import Dashboard from "../../../pages/platforms/manager/dashboard";

import {
  Services,
  Menus,
  Banner,
  Logo,
  Applicants,
  Tieups,
} from "../../../pages/platforms/manager/settings";
import UserManual from "../../../pages/platforms/manager/manual/index";
import PurRequest from "../../../pages/platforms/manager/purchases/request";
import Payrolls from "../../../pages/platforms/manager/responsibilities/payroll";

import {
  Employees,
  Equipments,
  Staffs,
  Physicians,
  Procurments,
  Heads,
} from "../../../pages/platforms/headquarter/file201";

import {
  Remittances,
  Sales,
  ExperimentalLedger,
} from "../../../pages/platforms/manager/businessOperations";

import {
  ProductGenerics,
  Products,
} from "../../../pages/platforms/manager/commerce/merchandise";

import {
  Vouchers,
  Payables,
  Receivables,
  Payments,
  SOA,
  Reseco,
} from "../../../pages/platforms/manager/accrued";

import {
  Outsources,
  Insources,
  Utilities,
  Hotlines,
  Suppliers,
} from "../../../pages/platforms/cashier";

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
      {
        name: "Reseco",
        path: "/reseco",
        icon: "handshake",
        title: "Monthly Reseco Deals",
        component: Reseco,
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
    name: "Commerce",
    path: "/commerce",
    icon: "shopping-basket",
    children: [
      {
        name: "Menus",
        path: "/menus",
        icon: "menu",
        component: Menus,
      },
      {
        name: "Services",
        path: "/services",
        icon: "concierge-bell",
        component: Services,
      },
      {
        name: "Duty Schedule",
        path: "/duty",
        icon: "calendar-days",
      },
      {
        name: "ProductGenerics",
        path: "/products/generics",
        icon: "calendar-days",
        component: ProductGenerics,
      },
      {
        name: "Products",
        path: "/products",
        icon: "calendar-days",
        component: Products,
      },
    ],
  },
  {
    name: "Settings",
    path: "/settings",
    icon: "cogs",
    children: [
      {
        name: "Profile",
        icon: "user-cog",
        path: "/profile",
        children: [
          {
            name: "Banner",
            path: "/banners",
            icon: "layout",
            component: Banner,
          },
          {
            name: "Logos",
            path: "/logos",
            icon: "image",
            component: Logo,
          },
          {
            name: "Tagline",
            path: "/taglines",
            icon: "quote",
            component: Logo,
          },
          {
            name: "Description",
            path: "/descriptions",
            icon: "file-text",
            component: Logo,
          },
        ],
      },
      {
        name: "Sources",
        path: "/sources",
        icon: "cogs",
        children: [
          {
            name: "Outsourcing",
            path: "/outsourcing",
            icon: "external-link",
            component: Outsources,
          },
          {
            name: "Insourcing",
            path: "/insourcing",
            icon: "download",
            component: Insources,
          },
          {
            name: "Suppliers",
            path: "/suppliers",
            icon: "briefcase",
            component: Suppliers,
          },
          {
            name: "Utilities",
            path: "/utilities",
            icon: "tools",
            title: "List of Company that provides Utilities or supports",
            component: Utilities,
          },
          {
            name: "Hotlines",
            path: "/hotlines",
            icon: "phone",
            title: "List of Hotlines",
            component: Hotlines,
          },
          {
            name: "Tie Ups",
            path: "/tieup",
            icon: "handshake",
            component: Tieups,
          },
        ],
      },
      {
        name: "Personnel",
        icon: "users-round",
        path: "/faculties",
        children: [
          {
            name: "Staff",
            path: "/staff",
            icon: "user",
            component: Staffs,
          },
          {
            name: "File 201",
            path: "/file201",
            component: Employees,
          },
          {
            name: "Heads",
            path: "/heads",
            icon: "user-check",
            component: Heads,
          },
          {
            name: "Physicians",
            path: "/physicians",
            icon: "stethoscope",
            component: Physicians,
          },
          {
            name: "Job Applicants",
            path: "/petitioners",
            icon: "user-plus",
            component: Applicants,
          },
        ],
      },
      {
        name: "Assets",
        icon: "database",
        path: "/assets",
        children: [
          {
            name: "Equipment",
            path: "/equipments",
            icon: "cpu",
            component: Equipments,
          },
          {
            name: "Procurement",
            path: "/procurement",
            icon: "clipboard-list",
            component: Procurments,
          },
        ],
      },
    ],
  },
  {
    name: "User Manual",
    icon: "book-open",
    path: "/user/manual",
    component: UserManual,
  },
];

export default manager;
