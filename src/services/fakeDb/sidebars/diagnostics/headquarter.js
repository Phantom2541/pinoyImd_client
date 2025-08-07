import {
  Heads,
  Applicants,
  Physicians,
  Records,
  Staffs,
} from "../../../../pages/platforms/hr/index";
import {
  Equipments,
  // Procurments as Procurement,
  Hmo,
} from "../../../../pages/platforms/headquarter/file201";
import { banner } from "../../../../pages/platforms/headquarter/settings/profile";
import {
  Outsources,
  Utilities,
  Hotlines,
  Suppliers,
} from "../../../../pages/platforms/cashier";

import { Tieups } from "../../../../pages/platforms/manager/settings";
import {
  Logo,
  Tagline,
  Description,
} from "../../../../pages/platforms/headquarter/settings";

// import ProcurmentEquipments from "../../../../pages/platforms/procurement/equipments";
import { Branches } from "../../../../pages/platforms/headquarter/humanResources";
import PatientCategories from "../../../../pages/platforms/headquarter/patientCategories";
import Dashboard from "../../../../pages/platforms/headquarter/dashboard";
import hpWalkthrough from "../../../../pages/platforms/headquarter/hpWalkthrough";

const headquarter = [
  {
    name: "Dashboard",
    path: "/dashboard",
    icon: "layout-dashboard",
    title: "Overview of key metrics and activities",
    component: Dashboard,
  },
  {
    name: "Personnel",
    path: "/faculties",
    icon: "users-round",
    title: "HR and employee management",
    children: [
      {
        name: "Staff",
        path: "/staff",
        icon: "user",
        title: "Current employees across branches",
        component: Staffs,
      },
      {
        name: "Job Applicants",
        path: "/petitioners",
        icon: "user-plus",
        title: "List of current and past applicants",
        component: Applicants,
      },
      {
        name: "Signatories",
        path: "/heads",
        icon: "user-check",
        title: "Department or document approvers",
        component: Heads,
      },
      {
        name: "Physicians",
        path: "/physicians",
        icon: "stethoscope",
        title: "Company-affiliated doctors",
        component: Physicians,
      },
      {
        name: "File 201",
        path: "/records",
        icon: "folder-person",
        title: "Employee records including resigned/inactive",
        component: Records,
      },
    ],
  },
  {
    name: "Procurement",
    path: "/duty",
    icon: "package",
    title: "Inventory, delivery, and procurement operations",
    children: [
      {
        name: "Suppliers",
        path: "/duty/suppliers",
        icon: "truck",
        title: "Linked suppliers for this unit",
      },
      {
        name: "Stock",
        path: "/duty/stock",
        icon: "warehouse",
        title: "Warehouse inventory list",
      },
      {
        name: "Merchandise",
        path: "/duty/merchandise",
        icon: "shopping-bag",
        title: "Available sale or service items",
      },
      {
        name: "Equipment",
        path: "/duty/equipments",
        icon: "hammer",
        title: "Unit-specific equipment list",
        // component: ProcurmentEquipments,
      },
      {
        name: "Preventive Maintenance",
        path: "/duty/maintenance",
        icon: "shield-check",
        title: "Scheduled checks and service logs",
      },
      {
        name: "Assets",
        path: "/assets",
        icon: "database",
        title: "Physical and digital asset registry",
        children: [
          {
            name: "Equipment",
            path: "/equipments",
            icon: "cpu",
            title: "List of all machines, computers, tools",
            component: Equipments,
          },
          {
            name: "Procurement",
            path: "/procurement",
            icon: "clipboard-list",
            title: "Manage purchases, orders, and suppliers",
            // component: Procurement,
          },
        ],
      },
    ],
  },
  {
    name: "Analytics",
    path: "/analytics",
    icon: "bar-chart-3",
    title: "Business intelligence and reporting",
    children: [
      {
        name: "Reports",
        path: "/analytics/reports",
        icon: "file-bar-chart",
        title: "Charts, summaries, and analytics",
      },
    ],
  },
  {
    name: "System Configuration",
    icon: "settings",
    path: "/system-configuration",
    title: "Company branding, structure, and general setup",
    children: [
      {
        name: "Profile Settings",
        path: "/profile",
        icon: "user-cog",
        children: [
          {
            name: "Company Details",
            path: "/descriptions",
            icon: "file-text",
            title: "Company introduction or overview",
            component: Description,
          },
          {
            name: "Patient Categories",
            path: "/patient-categoreis",
            icon: "file-text",
            title: "Company introduction or overview",
            component: PatientCategories,
          },
          {
            name: "Logo",
            path: "/logos",
            icon: "image",
            title: "Upload or change official company logos",
            component: Logo,
          },
          {
            name: "Banner",
            path: "/banners",
            icon: "layout",
            title: "Manage website or app banners",
            component: banner,
          },
          {
            name: "Tagline",
            path: "/taglines",
            icon: "quote",
            title: "Set or edit company taglines",
            component: Tagline,
          },
          {
            name: "Branches",
            path: "/hr/branches",
            icon: "map",
            title: "List and manage all company branches",
            component: Branches,
          },
        ],
      },
      {
        name: "Sources",
        path: "/sources",
        icon: "cogs",
        title: "Manage company sourcing partners",
        children: [
          {
            name: "Outsourcing",
            path: "/outsourcing",
            icon: "external-link",
            title: "External service providers (labs, HR, etc.)",
            component: Outsources,
          },
          {
            name: "Insourcing",
            path: "/insourcing",
            icon: "download",
            title: "In-house resources assigned to projects",
          },
          {
            name: "Suppliers",
            path: "/suppliers",
            icon: "briefcase",
            title: "Suppliers of goods and services",
            component: Suppliers,
          },
          {
            name: "Utilities",
            path: "/utilities",
            icon: "tools",
            title: "Water, electricity, internet, support providers",
            component: Utilities,
          },
          {
            name: "Hotlines",
            path: "/hotlines",
            icon: "phone",
            title: "List of emergency and operational hotlines",
            component: Hotlines,
          },
          {
            name: "Tie Ups",
            path: "/tieup",
            icon: "handshake",
            title: "Partner companies for shared operations",
            component: Tieups,
          },
        ],
      },
      {
        name: "Utilities & Partners",
        path: "/utilities-partners",
        icon: "plug",
        title: "Health, government, and service affiliations",
        children: [
          {
            name: "H M O",
            path: "/hmo",
            icon: "heart-pulse",
            title: "Accredited health maintenance organizations",
            component: Hmo,
          },
          {
            name: "PhilHealth Accredited",
            path: "/philhealth",
            icon: "shield-plus",
            title: "List of PhilHealth-accredited hospitals and clinics",
            // component: PhilHealthAccredited,
          },
          {
            name: "Pag-IBIG Partners",
            path: "/pagibig",
            icon: "building",
            title: "Housing loan and employee savings partners",
            // component: PagibigPartners,
          },
          {
            name: "S S S Partners",
            path: "/sss",
            icon: "id-card",
            title: "Social Security System partners or points of contact",
            // component: SssPartners,
          },
          {
            name: "Tie Ups",
            path: "/tieup",
            icon: "handshake",
            title: "Partner companies for shared operations",
            component: Tieups,
          },
        ],
      },

      {
        name: "User Access",
        path: "/users",
        icon: "shield",
        title: "Manage access levels and permissions",
      },
      {
        name: "Activity Logs",
        path: "/logs",
        icon: "clock",
        title: "System or audit logs",
      },
    ],
  },
  {
    name: "Calendar",
    path: "/calendar",
    icon: "calendar",
    title: "Calendar of activities (birthdays, events)",
  },
  {
    name: "Announcements",
    path: "/announcements",
    icon: "megaphone",
    title: "Company-wide announcements",
  },
  {
    name: "Commerce",
    path: "/commerce",
    icon: "shopping-basket",
    title: "Business operation-related scheduling (view only)",
    children: [
      {
        name: "Duty Schedule",
        path: "/commerce/duty",
        icon: "calendar-days",
        title: "Shifts and task assignments",
      },
    ],
  },
  {
    name: "Finance",
    path: "/finance",
    icon: "credit-card",
    title: "Financial monitoring and transactions (view only)",
  },
  {
    name: "Walkthrough",
    path: "/hpWalkthrough",
    icon: "credit-card",
    title: "Homepage walkthroughs(view only)",
    component: hpWalkthrough,
  },
  
];

export default headquarter;
