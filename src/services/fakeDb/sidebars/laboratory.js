import Bulletin from "../../../pages/platforms/cashier/bulletin";
import { Calender, Scheduler } from "../../../pages/platforms/dtr";
import { Heads } from "../../../pages/platforms/headquarter/file201";
import {
  Remittances,
  Sales,
} from "../../../pages/platforms/manager/businessOperations";
import { Quest } from "../../../pages/platforms/laboratory/staffManagement";
import {
  Services,
  Menus,
  Applicants,
} from "../../../pages/platforms/manager/settings";
import {
  Assurance,
  Controls,
  Temperature,
} from "../../../pages/platforms/diagnostics/management";
import {
  Contract,
  Membership,
  Outsources,
  Utilities,
  Wellness,
  Referrals,
  HMO,
  Hotlines,
  Suppliers,
  Onboarding,
} from "../../../pages/platforms/cashier";
import {
  Vouchers,
  Payables,
  Receivables,
  Reseco,
} from "../../../pages/platforms/manager/accrued";

const laboratory = [
  {
    name: "Dashboard",
    icon: "tachometer-alt",
    path: "/bulettin",
    title: "News and Updates",
    component: Bulletin,
  },
  {
    name: "Sales & Remittance",
    path: "/lab/sales",
    icon: "chart-line",
    title: "Daily income and collection tracking",
    children: [
      {
        name: "Sales Report",
        icon: "chart-bar",
        path: "/lab/sales/report",
        title: "Overview of laboratory sales",
        component: Sales,
      },
      {
        name: "Remittance",
        icon: "hand-holding-usd",
        path: "/lab/sales/remittance",
        title: "Cashier's daily remittance",
        component: Remittances,
      },
      {
        name: "Onboarding",
        path: "/onboarding",
        icon: "sign-in-alt",
        title: "Pre-Registered Patients from Partner Clinics",
        component: Onboarding,
      },
      {
        name: "Sendout",
        path: "/sendout",
        icon: "truck-loading",
        title: "Sendout Patients to Partner Clinics",
        // component: Onboarding,
      },
    ],
  },
  {
    name: "Accrued",
    path: "/accrued",
    icon: "file-invoice",
    title: "Liabilities and Obligations",
    children: [
      {
        name: "Accounts Payable (A/P)",
        path: "/payables",
        icon: "file-invoice-dollar",
        title: "Outstanding Payments to Suppliers & Utilities",
        component: Payables,
      },
      {
        name: "Accounts Receivable (A/R)",
        path: "/receivables",
        icon: "wallet",
        title: "Billing for Corporate & HMO Invoices",
        component: Receivables,
      },
      {
        name: "Vouchers",
        path: "/vouchers",
        icon: "receipt",
        title: "Monthly Vouchers for Referrals (Cashier only)",
        component: Vouchers,
      },
      {
        name: "Rebates",
        path: "/reseco",
        icon: "calendar-check",
        title: "Monthly Referral Rebates",
        component: Reseco,
      },
    ],
  },
  {
    name: "Inventory",
    path: "/lab/inventory",
    icon: "boxes",
    title: "Manage lab supplies and reagents",
    children: [
      {
        name: "Reagents",
        icon: "flask",
        path: "/lab/inventory/reagents",
        title: "List of chemical reagents",
      },
      {
        name: "Supplies",
        icon: "box-open",
        path: "/lab/inventory/supplies",
        title: "Medical and general supplies",
      },
    ],
  },
  {
    name: "Requests",
    path: "/lab/requests-management",
    icon: "file-signature",
    title: "Manage supply and maintenance requests",
    children: [
      {
        name: "Product Request",
        icon: "cart-plus",
        path: "/lab/requests-management/products",
        title: "Request consumables and products",
      },
      {
        name: "Maintenance Request",
        icon: "tools",
        path: "/lab/requests-management/maintenance",
        title: "Request machine servicing",
      },
    ],
  },
  {
    name: "Staff Management",
    path: "/lab/schedule",
    icon: "calendar-alt",
    title: "Staff scheduling and attendance",
    children: [
      {
        name: "Attendance",
        title: "Employee daily attendance tracker.",
        path: "/attendances",
        icon: "clock",
        component: Calender,
      },
      {
        name: "Scheduler",
        title: "Employee shift scheduling.",
        path: "/scheduler",
        icon: "calendar-check",
        component: Scheduler,
      },
      {
        name: "Signatories",
        title: "List of section signatories.",
        path: "/signatories",
        icon: "pen",
        component: Heads,
      },
      {
        name: "Mobile Clinic (Quest)",
        title: "Mobile team operations for outreach clinics.",
        path: "/mobile",
        icon: "mobile-alt",
        component: Quest,
      },
      {
        name: "Staff",
        title: "Active staff directory.",
        path: "/staff",
        icon: "user",
      },
      {
        name: "Applicants",
        title: "Job applicants and interview status.",
        path: "/petitioners",
        icon: "user-plus",
        component: Applicants,
      },
    ],
  },
  {
    name: "Service Management",
    path: "/lab/services",
    icon: "file-medical-alt",
    title: "Service pricing and reference values",
    children: [
      {
        name: "Service Prices",
        icon: "money-bill-wave",
        path: "/lab/services/pricing",
        title: "Manage cost per test",
      },
      {
        name: "Reference Values",
        icon: "sliders-h",
        path: "/lab/services/reference-values",
        title: "Update test reference ranges",
      },
    ],
  },
  {
    name: "Quality Management",
    icon: "tv",
    path: "/diagnostics/quality",
    title: "QA/QC program monitoring",
    children: [
      {
        name: "Quality Assurance ( Q A )",
        path: "/diagnostics/quality/external",
        icon: "check-circle",
        title: "External Quality Assurance",
        component: Assurance,
      },
      {
        name: "Quality Control ( Q C )",
        path: "/diagnostics/quality/internal",
        icon: "balance-scale",
        title: "Internal Quality Control",
        component: Controls,
      },
      {
        name: "Temperature",
        path: "/diagnostics/quality/temperature",
        icon: "thermometer-half",
        title: "Monitoring of lab temperature",
        component: Temperature,
      },
    ],
  },
  {
    name: "Catalogs",
    path: "/offers",
    icon: "list",
    title: "Masterlists for services, products, and consumables",
    children: [
      {
        name: "Menus",
        path: "/offers/menus",
        icon: "bars",
        title: "List of services offered",
        component: Menus,
      },
      {
        name: "Services",
        path: "/offers/services",
        icon: "list",
        title: "Service definitions and categories",
        component: Services,
      },
      {
        name: "Products",
        path: "/offers/products",
        icon: "cogs",
        title: "Product list",
      },
      {
        name: "Consumables",
        icon: "tv",
        path: "/offers/consumables",
        title: "Categorized consumables for lab",
        children: [
          {
            name: "Preanalytical",
            path: "/offers/consumables/preanalytical",
            icon: "check-circle",
            title: "Items before analysis",
            component: Assurance,
          },
          {
            name: "Analytical",
            path: "/offers/consumables/analytical",
            icon: "balance-scale",
            title: "Items during analysis",
            component: Controls,
          },
          {
            name: "Postanalytical",
            path: "/offers/consumables/postanalytical",
            icon: "thermometer-half",
            title: "Items after analysis",
          },
        ],
      },
    ],
  },
  {
    name: "Sources",
    path: "/sources",
    icon: "building",
    title: "Outsources & Insources",
    children: [
      {
        name: "Outsources",
        path: "/outsources",
        icon: "people-carry",
        title: "External Service Providers",
        component: Outsources,
      },
      {
        name: "Affiliated Patient Programs",
        path: "/insources",
        icon: "hand-holding-heart",
        title: "Patient Sources with Discounts or Privileges",
        children: [
          {
            name: "HMO Wellness",
            path: "/wellness",
            icon: "briefcase-medical",
            title: "Partner Companies with HMO Coverage",
            component: Wellness,
          },
          {
            name: "Membership Privileges",
            path: "/membership",
            icon: "id-card-alt",
            title: "Members with Discounted Rates",
            component: Membership,
          },
          {
            name: "Contracted Rates",
            path: "/contract",
            icon: "file-signature",
            title: "Special Pricing Agreements",
            component: Contract,
          },
          {
            name: "Referral",
            path: "/referrals",
            icon: "paper-plane",
            title: "Clinics or Doctors Who Referred Patients",
            component: Referrals,
          },
        ],
      },
      {
        name: "HMO",
        path: "/hmo",
        icon: "user-md",
        title: "Accredited Health Maintenance Organizations",
        component: HMO,
      },
      {
        name: "Suppliers",
        path: "/suppliers",
        icon: "boxes",
        title: "Suppliers for Goods & Services",
        component: Suppliers,
      },
      {
        name: "Utilities",
        path: "/utilities",
        icon: "plug",
        title: "Utilities & Support Services",
        component: Utilities,
      },
      {
        name: "Hotlines",
        path: "/hotlines",
        icon: "phone-alt",
        title: "Emergency & Support Hotlines",
        component: Hotlines,
      },
    ],
  },
  {
    name: "Reports",
    path: "/lab/reports",
    icon: "file-medical",
    title: "Summary and detailed reports",
    children: [
      {
        name: "Daily Summary",
        icon: "calendar-day",
        path: "/lab/reports/daily",
        title: "Daily operations summary",
      },
      {
        name: "Monthly Logs",
        icon: "calendar",
        path: "/lab/reports/monthly",
        title: "Monthly logs and summaries",
      },
    ],
  },
];

export default laboratory;
