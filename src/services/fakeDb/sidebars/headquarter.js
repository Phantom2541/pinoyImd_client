import {
  Equipments,
  Heads,
  Physicians,
  Procurments as Procurement,
  Staffs,
  Hmo,
  Records,
} from "../../../pages/platforms/headquarter/file201";
import { banner } from "../../../pages/platforms/headquarter/settings/profile";
import {
  Outsources,
  Utilities,
  Hotlines,
  Suppliers,
} from "../../../pages/platforms/cashier";

import {
  Logo,
  Tagline,
  Description,
  Tieups,
} from "../../../pages/platforms/manager/settings";
import ProcurmentEquipments from "../../../pages/platforms/headquarter/procurement/equipments";
import { Branches } from "../../../pages/platforms/headquarter/humanResources";
import Applicants from "../../../pages/platforms/headquarter/settings/personnels/applicants";
// import { Title } from "chart.js";

// Suggested Components (you can enable these later)
// import Manuals from "../../../pages/platforms/headquarter/settings/manuals";
// import Reports from "../../../pages/platforms/headquarter/analytics/reports";
// import Documents from "../../../pages/platforms/headquarter/documents";
// import Roles from "../../../pages/platforms/headquarter/settings/users";
// import Announcements from "../../../pages/platforms/headquarter/settings/announcements";
// import AuditTrail from "../../../pages/platforms/headquarter/logs";
// import Calendar from "../../../pages/platforms/headquarter/calendar";
// import Finance from "../../../pages/platforms/headquarter/finance";
// import Compliance from "../../../pages/platforms/headquarter/compliance";
// import Warehouse from "../../../pages/platforms/headquarter/warehouse";
// import Feedback from "../../../pages/platforms/headquarter/feedback";

const headquarter = [
  {
    name: "Company",
    path: "/company/profile",
    icon: "users",
    title: "Manage company-wide settings and info",
    children: [
      {
        name: "Profile",
        path: "/profile",
        icon: "user-cog",
        title: "Company branding and identity",
        children: [
          {
            name: "Banner",
            path: "/banners",
            icon: "layout",
            component: banner,
            title: "Manage website or app banners",
          },
          {
            name: "Logos",
            path: "/logos",
            icon: "image",
            component: Logo,
            title: "Upload or change official company logos",
          },
          {
            name: "Tagline",
            path: "/taglines",
            icon: "quote",
            component: Tagline,
            title: "Set or edit company taglines",
          },
          {
            name: "Description",
            path: "/descriptions",
            icon: "file-text",
            component: Description,
            title: "Company introduction or overview",
          },
        ],
      },
      {
        name: "Branches",
        path: "/hr/branches",
        icon: "map",
        component: Branches,
        title: "List and manage all company branches",
      },
      {
        name: "Top Branch",
        path: "/hr/top/branch",
        icon: "crown",
        title: "Highlight the top-performing branch",
      },
      {
        name: "Best Employees",
        path: "/hr/employee",
        icon: "badge-check",
        title: "Showcase employees with outstanding performance",
      },
    ],
  },
  {
    name: "Settings",
    path: "/settings",
    icon: "sliders-horizontal",
    title: "Configure internal settings and lists",
    children: [
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
            component: Outsources,
            title: "External service providers (labs, HR, etc.)",
          },
          {
            name: "Insourcing",
            path: "/insourcing",
            icon: "download",
            title: "In-house resources assigned to projects",
          },
          {
            name: "HMO",
            path: "/hmo",
            icon: "heart-pulse",
            component: Hmo,
            title: "Health maintenance organizations tied to company",
          },
          {
            name: "Suppliers",
            path: "/suppliers",
            icon: "briefcase",
            component: Suppliers,
            title: "Suppliers of goods and services",
          },
          {
            name: "Utilities",
            path: "/utilities",
            icon: "tools",
            component: Utilities,
            title: "Water, electricity, internet, support providers",
          },
          {
            name: "Hotlines",
            path: "/hotlines",
            icon: "phone",
            component: Hotlines,
            title: "List of emergency and operational hotlines",
          },
          {
            name: "Tie Ups",
            path: "/tieup",
            icon: "handshake",
            component: Tieups,
            title: "Partner companies for shared operations",
          },
        ],
      },
      {
        name: "Personnel",
        path: "/faculties",
        icon: "users-round",
        title: "Human resource and employee management",
        children: [
          {
            name: "Staff",
            path: "/staff",
            icon: "user",
            component: Staffs,
            title: "Current employees across branches",
          },
          {
            name: "Signatories",
            path: "/heads",
            icon: "user-check",
            component: Heads,
            title: "Department or document approvers",
          },
          {
            name: "Physicians",
            path: "/physicians",
            icon: "stethoscope",
            component: Physicians,
            title: "Company-affiliated doctors",
          },
          {
            name: "Job Applicants",
            path: "/petitioners",
            icon: "user-plus",
            component: Applicants,
            title: "List of current and past applicants",
          },
          {
            name: "File 201",
            path: "/records",
            icon: "folder-person",
            component: Records,
            title: "Employee records including resigned/inactive",
          },
        ],
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
            component: Equipments,
            title: "List of all machines, computers, tools",
          },
          {
            name: "Procurement",
            path: "/procurement",
            icon: "clipboard-list",
            component: Procurement,
            title: "Manage purchases, orders, and suppliers",
          },
        ],
      },
      {
        name: "Documents",
        path: "/documents",
        icon: "folder-open",
        title:
          "Internal company forms and templates" /*, component: Documents */,
      },
      {
        name: "Manuals",
        path: "/manuals",
        icon: "book-open",
        title: "Operation or technical manuals" /*, component: Manuals */,
      },
      {
        name: "Compliance",
        path: "/compliance",
        icon: "check-circle",
        title:
          "Accreditation and legal compliance files" /*, component: Compliance */,
      },
      {
        name: "User Access",
        path: "/users",
        icon: "shield",
        title: "Manage access levels and permissions" /*, component: Roles */,
      },
      {
        name: "Announcements",
        path: "/announcements",
        icon: "megaphone",
        title: "Company-wide announcements" /*, component: Announcements */,
      },
      {
        name: "Activity Logs",
        path: "/logs",
        icon: "clock",
        title: "System or audit logs" /*, component: AuditTrail */,
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
        title: "Charts, summaries, and analytics" /*, component: Reports */,
      },
    ],
  },
  {
    name: "Commerce",
    path: "/commerce",
    icon: "shopping-basket",
    title: "Business operation-related scheduling",
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
        component: ProcurmentEquipments,
        title: "Unit-specific equipment list",
      },
      {
        name: "Preventive Maintenance",
        path: "/duty/maintenance",
        icon: "shield-check",
        title: "Scheduled checks and service logs",
      },
    ],
  },
  {
    name: "Calendar",
    title: "Calendar of activities (staff birthday, anniversary, etc.)",
    path: "/calendar",
    icon: "calendar" /*, component: Calendar */,
  },
  {
    name: "Finance",
    path: "/finance",
    icon: "credit-card",
    title: "Financial monitoring and transactions" /*, component: Finance */,
  },
];

export default headquarter;
