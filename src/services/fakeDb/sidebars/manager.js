import Dashboard from "../../../pages/platforms/manager/dashboard";

import {
  Services,
  Menus,
  Applicants,
  Tieups,
} from "../../../pages/platforms/manager/settings";
import UserManual from "../../../pages/platforms/manager/manual/index";
import PurRequest from "../../../pages/platforms/manager/purchases/request";
import Payrolls from "../../../pages/platforms/finance/payroll";
import Banners from "../../../pages/platforms/manager/settings/profile/banner";

import {
  Employees,
  Equipments,
  Staffs,
  Physicians,
  Procurments,
  Heads,
} from "../../../pages/platforms/headquarter/file201";
import stockHolder from "../../../pages/platforms/manager/settings/personnel/stockHolder";

import {
  Remittances,
  Sales,
  ExperimentalLedger,
  Quest,
} from "../../../pages/platforms/manager/businessOperations";

import {
  ProductGenerics,
  Products,
} from "../../../pages/platforms/manager/commerce/merchandise";

import { Attendances } from "../../../pages/platforms/manager/humanResources";

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
  Utilities,
  Hotlines,
  Suppliers,
} from "../../../pages/platforms/cashier";
import ClearancePay from "../../../pages/platforms/manager/accrued/clearancePay";

const SidebarItems = [
  // === Main Navigation ===
  {
    name: "Dashboard",
    title: "Overview of platform activity.",
    icon: "tachometer-alt",
    path: "/dashboard",
    component: Dashboard,
  },
  // === Business Operations ===
  {
    name: "Operations",
    title: "Business-related operations and clinic activities.",
    icon: "cogs",
    path: "/operations",
    children: [
      {
        name: "Daily Sales",
        title: "View and manage daily clinic sales data.",
        path: "/sales",
        icon: "money-bill",
        component: Sales,
      },
      {
        name: "Remittances",
        title: "Track remittances from various departments.",
        path: "/remittances",
        icon: "pencil-alt",
        component: Remittances,
      },
      {
        name: "Ledger",
        title: "Review financial ledger transactions.",
        path: "/ledger",
        icon: "file-invoice-dollar",
        component: ExperimentalLedger,
      },
      {
        name: "Mobile Clinic (Quest)",
        title: "Mobile team operations for outreach clinics.",
        path: "/mobile",
        icon: "mobile-alt",
        component: Quest,
      },
    ],
  },
  // === Finance Management ===
  {
    name: "Finance",
    title: "Manage financial transactions and ledgers.",
    icon: "wallet",
    path: "/finance",
    children: [
      {
        name: "Accounts Payable",
        title: "List of pending payables to suppliers.",
        path: "/payables",
        icon: "file-invoice-dollar",
        component: Payables,
      },
      {
        name: "Accounts Receivable",
        title: "Track receivables from clients or HMOs.",
        path: "/receivables",
        icon: "money-bill",
        component: Receivables,
      },
      {
        name: "Payments",
        title: "View completed payments.",
        path: "/payments",
        icon: "dollar-sign",
        component: Payments,
      },
      {
        name: "Client SOA Generator",
        title:
          "Generate Statements of Account for HMO, Contract, and Membership Clients",
        path: "/vouchers",
        icon: "file-invoice",
        component: Vouchers,
      },
      {
        name: "SOA Records",
        title: "View and track all generated Statements of Account",
        path: "/soa",
        icon: "folder-open",
        component: SOA,
      },
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
  // === Procurement Process ===
  {
    name: "Procurement",
    title: "Track purchasing and supplier interactions.",
    icon: "book-open",
    path: "/procurement",
    children: [
      {
        name: "Requisition",
        title: "Submit and track purchase requisitions.",
        path: "/request",
        icon: "file-invoice",
        component: PurRequest,
      },
      {
        name: "Approval",
        title: "Approve or reject procurement requests.",
        path: "/process",
        icon: "file-invoice",
      },
      {
        name: "Tracking",
        title: "Monitor delivery status of procurements.",
        path: "/tracking",
        icon: "file-invoice",
      },
      {
        name: "Records",
        title: "View historical procurement records.",
        path: "/records",
        icon: "file-invoice",
      },
    ],
  },
  // === Asset Management ===
  {
    name: "Assets & Maintenance",
    title: "Asset inventory and maintenance schedules.",
    icon: "tools",
    path: "/assets",
    children: [
      {
        name: "Equipments",
        title: "Clinic equipment listing and status.",
        path: "/equipments",
        icon: "cpu",
        component: Equipments,
      },
      {
        name: "Procurement Records",
        title: "Procurement log for physical assets.",
        path: "/procurement",
        icon: "clipboard-list",
        component: Procurments,
      },
      {
        name: "Supplies",
        title: "Inventory of consumable supplies.",
        path: "/reagents",
        icon: "box",
      },
      {
        name: "PMS",
        title: "Preventive Maintenance Schedule logs.",
        path: "/preventive/maintenance/schedule",
        icon: "calendar-check",
      },
    ],
  },
  // === Human Resources ===
  {
    name: "Human Resources",
    title: "Employee records, attendance, and roles.",
    icon: "users",
    path: "/human-resources",
    children: [
      {
        name: "Attendance",
        title: "Employee daily attendance tracker.",
        path: "/attendances",
        icon: "clock",
        component: Attendances,
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
        icon: "user",
        component: Employees,
      },
      {
        name: "Signatories",
        title: "List of section signatories.",
        path: "/signatories",
        icon: "user-check",
        component: Heads,
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
        icon: "user",
        component: stockHolder,
      },
    ],
  },
  // === Commercial Section ===
  {
    name: "Commerce",
    title: "Services and products available in the clinic.",
    icon: "shopping-basket",
    path: "/commerce",
    children: [
      {
        name: "Menus",
        title: "Service menus and offerings.",
        path: "/menus",
        icon: "menu",
        component: Menus,
      },
      {
        name: "Services",
        title: "List of medical and lab services.",
        path: "/services",
        icon: "concierge-bell",
        component: Services,
      },
      {
        name: "Duty Schedule",
        title: "Scheduling of personnel duties.",
        path: "/duty",
        icon: "calendar-days",
      },
      {
        name: "Product Generics",
        title: "Generic product listings for resale.",
        path: "/products/generics",
        icon: "calendar-days",
        component: ProductGenerics,
      },
      {
        name: "Products",
        title: "All available retail products.",
        path: "/products",
        icon: "calendar-days",
        component: Products,
      },
    ],
  },
  // === Marketplace ===
  {
    name: "Marketplace",
    title: "Machines, medicines, and product listings.",
    icon: "shopping-cart",
    path: "/marketplace",
    children: [
      {
        name: "Machines",
        title: "Machine listings and models.",
        path: "/machines",
        icon: "laptop-code",
      },
      {
        name: "Products",
        path: "/products",
        icon: "cogs",
        component: Products,
      },
      {
        name: "Medicines",
        title: "Medicine inventory and sales.",
        path: "/medicines",
        icon: "pills",
        component: Products,
      },
    ],
  },
  // === System Settings ===
  {
    name: "Settings",
    title: "Configuration of system profiles and resources.",
    icon: "cogs",
    path: "/settings",
    children: [
      {
        name: "Profile Settings",
        path: "/profile",
        icon: "user-cog",
        children: [
          {
            name: "Banner",
            title: "Clinic branding banners.",
            path: "/banner",
            icon: "banners",
            component: Banners,
          },
        ],
      },
      {
        name: "Sources & Utilities",
        path: "/sources",
        icon: "cogs",
        children: [
          {
            name: "Outsourcing",
            title: "External service providers.",
            path: "/outsourcing",
            icon: "external-link",
            component: Outsources,
          },
          {
            name: "Insourcing",
            title: "In-house resource integration.",
            path: "/insourcing",
            icon: "download",
          },
          {
            name: "Suppliers",
            title: "Vendor contact and supply chain.",
            path: "/suppliers",
            icon: "briefcase",
            component: Suppliers,
          },
          {
            name: "Utilities",
            title: "Utilities used by the organization.",
            path: "/utilities",
            icon: "tools",
            component: Utilities,
          },
          {
            name: "Hotlines",
            title: "Emergency or support hotlines.",
            path: "/hotlines",
            icon: "phone",
            component: Hotlines,
          },
          {
            name: "Tie Ups",
            title: "Affiliate or corporate tie-ups.",
            path: "/tieup",
            icon: "handshake",
            component: Tieups,
          },
        ],
      },
    ],
  },
  // === Documentation ===
  {
    name: "User Manual",
    title: "Documentation and user guidance.",
    icon: "book-open",
    path: "/user/manual",
    component: UserManual,
  },
  // === Clinic Access ===
  {
    name: "Clinic",
    title: "General clinic functions and access.",
    icon: "book-open",
    path: "/clinic",
  },
];

export default SidebarItems;
