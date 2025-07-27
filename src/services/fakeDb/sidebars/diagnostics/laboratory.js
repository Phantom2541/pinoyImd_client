import Bulletin from "../../../../pages/platforms/cashier/bulletin";
import { Calender, Scheduler } from "../../../../pages/platforms/hr/dtr";
import {
  Remittances,
  Sales,
} from "../../../../pages/platforms/accounting/businessOperations";
import { Quest } from "../../../../pages/platforms/laboratory/staffManagement";
import { Applicants } from "../../../../pages/platforms/manager/settings";
import { Services, Menus } from "../../../../pages/platforms/accounting";
import { Heads } from "../../../../pages/platforms/headquarter";
import {
  Contract,
  Membership,
  Outsources,
  Utilities,
  Wellness,
  Referrals,
  Hotlines,
  Suppliers,
  Onboarding,
} from "../../../../pages/platforms/cashier";
import {
  Assurance,
  Controls,
  Temperature,
} from "../../../../pages/platforms/laboratory/management";
import Sendouts from "../../../../pages/platforms/laboratory/diagnostics/sendouts";
import WorkingArea from "../../../../pages/platforms/laboratory/working-area";
import Machines from "../../../../pages/platforms/laboratory/machines";
// import ClinicalMicroscopy from "../../../pages/platforms/laboratory/workingArea/clinicalMicroscopy";

const laboratory = [
  {
    name: "Dashboard",
    icon: "tachometer-alt",
    path: "/bulettin",
    title: "News and Updates",
    component: Bulletin,
    allowedFor: ["Junior MedTech", "Senior MedTech", "Chief MLS"],
  },
  {
    name: "Sales & Remittance",
    path: "/lab/sales",
    icon: "chart-line",
    title: "Daily income and collection tracking",
    allowedFor: ["Junior MedTech", "Senior MedTech", "Chief MLS"],
    children: [
      {
        name: "Sales Report",
        icon: "chart-bar",
        path: "/lab/sales/report",
        title: "Overview of laboratory sales",
        component: Sales,
        allowedFor: ["Chief MLS"],
      },
      {
        name: "Remittance",
        icon: "hand-holding-usd",
        path: "/lab/sales/remittance",
        title: "Cashier's daily remittance",
        component: Remittances,
        allowedFor: ["Chief MLS"],
      },
      {
        name: "Onboarding",
        path: "/onboarding",
        icon: "sign-in-alt",
        title: "Pre-Registered Patients & HMO Approvals",
        component: Onboarding,
        allowedFor: ["Junior MedTech", "Senior MedTech", "Chief MLS"],
      },
      {
        name: "Sendout",
        path: "/sendout",
        icon: "truck-loading",
        title: "Sendout Patients to Partner Clinics",
        component: Sendouts,
        allowedFor: ["Junior MedTech", "Senior MedTech", "Chief MLS"],
      },
      {
        name: "medical mission",
        path: "/quest",
        icon: "ambulance",
        title: "medical team operations for outreach clinics.",
        component: Quest,
        allowedFor: ["Junior MedTech", "Senior MedTech", "Chief MLS"],
      },
    ],
  },
  {
    name: "Quality Management",
    icon: "tv",
    path: "/diagnostics/quality",
    children: [
      {
        name: "Quality Assurance (QA)",
        path: "/diagnostics/quality/external",
        icon: "check-circle",
        title: "Quality Control External",
        component: Assurance,
      },
      {
        name: "Quality Control (QC)",
        path: "/diagnostics/quality/internal",
        icon: "balance-scale",
        title: "Quality Control Internal",
        component: Controls,
      },
      {
        name: "Temperature",
        path: "/diagnostics/quality/temperature",
        icon: "thermometer-half",
        component: Temperature,
      },
    ],
  },
  {
    name: "Inventory",
    path: "/lab/inventory",
    icon: "boxes",
    title: "Manage lab supplies and reagents",
    allowedFor: ["Junior MedTech", "Senior MedTech", "Chief MLS"],
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
    allowedFor: ["Senior MedTech", "Chief MLS"],
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
    allowedFor: ["Junior MedTech", "Senior MedTech", "Chief MLS"],
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
        allowedFor: ["Senior MedTech", "Chief MLS"],
      },
      {
        name: "Signatories",
        title: "List of section signatories.",
        path: "/signatories",
        icon: "pen",
        component: Heads,
        allowedFor: ["Senior MedTech", "Chief MLS"],
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
        allowedFor: ["Chief MLS"],
      },
    ],
  },
  {
    name: "Service Management",
    path: "/lab/services",
    icon: "file-medical-alt",
    title: "Service pricing and reference values",
    allowedFor: ["Senior MedTech", "Chief MLS"],
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
    name: "Catalogs",
    path: "/offers",
    icon: "list",
    title: "Masterlists for services, products, and consumables",
    allowedFor: ["Senior MedTech", "Chief MLS"],
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
          },
          {
            name: "Analytical",
            path: "/offers/consumables/analytical",
            icon: "balance-scale",
            title: "Items during analysis",
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
    title: "Outsources & Insources (Loyalty Programs)",
    allowedFor: ["Chief MLS"],
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
    allowedFor: ["Senior MedTech", "Chief MLS"],
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
  {
    name: "Working Area",
    path: "/lab/working-area",
    icon: "microscope",
    title: "Access different lab working sections",
    allowedFor: ["Junior MedTech", "Senior MedTech", "Chief MLS", "Frontdesk"], // optional if role-filtered
    component: WorkingArea,
    // children: [
    //   {
    //     name: "Clinical Microscopy",
    //     path: "/lab/working-area/clinical-microscopy",
    //     icon: "vial",
    //     title: "Routine urinalysis, stool exam, etc.",
    //     // component: ClinicalMicroscopy,
    //   },
    //   {
    //     name: "Hematology",
    //     path: "/lab/working-area/hematology",
    //     icon: "tint",
    //     title: "CBC, blood smears, ESR, etc.",
    //   },
    //   {
    //     name: "Clinical Chemistry",
    //     path: "/lab/working-area/clinical-chemistry",
    //     icon: "flask",
    //     title: "Glucose, enzymes, electrolytes, etc.",
    //   },
    //   {
    //     name: "Immunology & Serology",
    //     path: "/lab/working-area/immuno-sero",
    //     icon: "syringe",
    //     title: "Antibody-antigen testing",
    //   },
    //   {
    //     name: "Microbiology",
    //     path: "/lab/working-area/microbiology",
    //     icon: "bug",
    //     title: "Culture and sensitivity, gram stain",
    //   },
    //   {
    //     name: "Blood Banking",
    //     path: "/lab/working-area/blood-bank",
    //     icon: "hand-holding-medical",
    //     title: "Crossmatching and blood typing",
    //   },
    // ],
  },
  {
    name: "Machines",
    path: "/lab/machines",
    icon: "tools",
    title: "Access different lab working sections",
    component: Machines,
  },
  {
    name: "Settings",
    path: "/settings",
    icon: "sliders-h",
    title: "System settings and configuration",
    allowedFor: ["Chief MLS"],
    children: [
      {
        name: "System",
        path: "/settings/system",
        icon: "cogs",
        title: "System settings and configuration",
      },
    ],
  },
];

export default laboratory;
