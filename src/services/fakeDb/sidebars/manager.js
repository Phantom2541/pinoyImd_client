import Dashboard from "../../../pages/platforms/manager/dashboard";

import {
  Services,
  Menus,
  Applicants,
  Tieups,
} from "../../../pages/platforms/manager/settings";
import UserManual from "../../../pages/platforms/manager/manual/index";
import PurRequest from "../../../pages/platforms/manager/purchases/request";
import Banners from "../../../pages/platforms/manager/settings/banner";
import TatServices from "../../../pages/platforms/manager/commerce/tatServices";

import {
  Employees,
  Staffs,
  Equipments,
  Physicians,
  Heads,
} from "../../../pages/platforms/hr/index.js";
import { Procurments } from "../../../pages/platforms/procurement";

import stockHolder from "../../../pages/platforms/hr/personnel/stockHolder";
import { Quest } from "../../../pages/platforms/laboratory/staffManagement";

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
  Payrolls,
  ClearancePay,
  Remittances,
  Sales,
  ExperimentalLedger,
} from "../../../pages/platforms/accounting";

import { Schedule } from "../../../pages/platforms/hr";

import {
  Philhealth,
  Outsources,
  Utilities,
  Hotlines,
  Suppliers,
} from "../../../pages/platforms/cashier";
import LIS from "../../../pages/platforms/manager/settings/lis";
import QrCodePage from "../../../pages/platforms/manager/settings/qrCode";

const ManagerSidebar = [
  {
    name: "Dashboard",
    title: "Overview of platform activity.",
    icon: "tachometer-alt",
    path: "/dashboard",
    component: Dashboard,
  },
  {
    name: "Operations",
    title: "Daily business and clinic operations.",
    icon: "cogs",
    path: "/operations",
    children: [
      {
        name: "Sales",
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
  {
    name: "Human Resources",
    title: "Employee records, attendance, and roles.",
    icon: "users",
    path: "/hr",
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
    ],
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
    name: "Procurement",
    title: "Track purchasing and supplier interactions.",
    icon: "truck-loading",
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
        icon: "check-circle",
      },
      {
        name: "Tracking",
        title: "Monitor delivery status of procurements.",
        path: "/tracking",
        icon: "map-marker-alt",
      },
      {
        name: "Records",
        title: "View historical procurement records.",
        path: "/records",
        icon: "clipboard-list",
      },
      {
        name: "Procurement Records",
        title: "Procurement log for physical assets.",
        path: "/procurement",
        icon: "file-alt",
        component: Procurments,
      },
    ],
  },
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
        icon: "cogs",
        component: Equipments,
      },
      {
        name: "Supplies",
        title: "Inventory of consumable supplies.",
        path: "/reagents",
        icon: "box",
      },
      {
        name: "Preventive Maintenance",
        title: "Preventive Maintenance Schedule logs.",
        path: "/preventive/maintenance/schedule",
        icon: "calendar-check",
      },
    ],
  },
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
        title: "All available retail products.",
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
  {
    name: "Clinic",
    title: "Listings and status of clinic services.",
    icon: "clinic-medical",
    path: "/clinic",
  },
  {
    name: "System Configuration",
    title: "Configuration of system profiles and resources.",
    icon: "sliders-h",
    path: "/config",
    children: [
      {
        name: "Profile Settings",
        path: "/profile",
        icon: "user-cog",
        children: [
          {
            name: "Banner",
            title: "Branch branding banners.",
            path: "/banner",
            icon: "image",
            component: Banners,
          },
          {
            name: "Details",
            title: "Branch profile details.",
            path: "/details",
            icon: "address-card",
            // component: Details,
          },
          {
            name: "PhilHealth",
            title: "PhilHealth accounts and contributions.",
            path: "/Philhealth",
            icon: "file-invoice",
            component: Philhealth,
          },
          {
            name: "Turn Around Times",
            title: "Turn around Time for services.",
            path: "/tat/Services",
            icon: "clock",
            component: TatServices,
          },
          {
            name: "Signatories",
            title: "List of section signatories.",
            path: "/signatories",
            icon: "pen",
            component: Heads,
          },
          {
            name: "Q R Code",
            title: "Qr Code for Homepage.",
            path: "/qrCode",
            icon: "pen",
            component: QrCodePage,
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
      {
        name: "Product & Services Setup",
        path: "/product-config",
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
          {
            name: "Product Generics",
            title: "Generic product listings for resale.",
            path: "/products/generics",
            icon: "cubes",
            component: ProductGenerics,
          },
          {
            name: "Products",
            title: "All available retail products.",
            path: "/products",
            icon: "box",
            component: Products,
          },
        ],
      },
      {
        name: "LIS",
        title: "Laboratory information system.",
        path: "/lis",
        icon: "tram",
        component: LIS,
      },
    ],
  },

  {
    name: "User Manual",
    title: "Documentation and user guidance.",
    icon: "book",
    path: "/user/manual",
    component: UserManual,
  },
];

export default ManagerSidebar;
