import Dashboard from "../../../pages/platforms/accounting/dashboard";

import {
  Vouchers,
  Payables,
  Receivables,
  Payments,
  SOA,
  Reseco,
  ClearancePay,
  Payrolls,
  Menus,
  Services,
} from "../../../pages/platforms/accounting";
import OrgChart from "../../../pages/platforms/accounting/organizationChart";

const accounting = [
  {
    name: "Dashboard",
    title: "Overview of platform activity.",
    icon: "tachometer-alt",
    path: "/dashboard",
    component: Dashboard,
  },
  {
    name: "Finance & Accounting",
    title: "Manage financial transactions and ledgers.",
    icon: "wallet",
    path: "/finance",
    children: [
      // mga pa-utang
      {
        name: "S O A Generator (vouchers)",
        title:
          "Generate Statements of Account for HMO, Contract, and Membership Clients",
        path: "/vouchers",
        icon: "file-invoice",
        component: Vouchers,
      },
      {
        name: "S O A Records",
        title: "View and track all generated Statements of Account",
        path: "/soa",
        icon: "folder-open",
        component: SOA,
      },
      {
        name: "Accounts Receivable",
        title: "Track receivables from clients or HMOs.",
        path: "/receivables",
        icon: "money-check",
        component: Receivables,
      },
      // mga utang
      {
        name: "Accounts Payable",
        title: "List of pending payables to suppliers.",
        path: "/payables",
        icon: "file-invoice-dollar",
        component: Payables,
      },
      {
        name: "Payments",
        title: "View completed payments.",
        path: "/payments",
        icon: "dollar-sign",
        component: Payments,
      },
      // tips
      {
        name: "Referral Rebates",
        title:
          "Generate and track monthly rebates for referring doctors and companies",
        path: "/reseco",
        icon: "hand-holding-usd",
        component: Reseco,
      },
      {
        name: "Payroll",
        title: "Employee payroll records.",
        path: "/payroll",
        icon: "money-bill",
        component: Payrolls,
      },
      {
        name: "Final Pay",
        title:
          "Compute and process final pay for resigned or separated employees",
        path: "/clearance-pay",
        icon: "file-export",
        component: ClearancePay,
      },
    ],
  },
  {
    name: "Catalogs",
    path: "/catalogs",
    icon: "shopping-cart",
    children: [
      {
        name: "Menus",
        title: "Service menus and offerings.",
        path: "/menus",
        icon: "bars",
        component: Menus,
      },
      {
        name: "Services",
        title: "List of medical and lab services.",
        path: "/services",
        icon: "concierge-bell",
        component: Services,
      },
    ],
  },
  {
    name: "Org Chart",
    title: "Organizational chart.",
    icon: "sitemap",
    path: "/organizationChart",
    component: OrgChart,
  },
];

export default accounting;
