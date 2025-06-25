import {
  Equipments,
  Heads,
  Physicians,
  Procurments as Procurement,
  Staffs,
  Hmo,
} from "../../../pages/platforms/headquarter/file201";
import { banner } from "../../../pages/platforms/headquarter/settings/profile";
import {
  Outsources,
  // Insources,
  Utilities,
  Hotlines,
  Suppliers,
} from "../../../pages/platforms/cashier";

import {
  Menus,
  Services,
  Logo,
  Tagline,
  Description,
  Tieups,
} from "../../../pages/platforms/manager/settings";
import ProcurmentEquipments from "../../../pages/platforms/headquarter/procurement/equipments";
import { Branches } from "../../../pages/platforms/headquarter/humanResources";
import Applicants from "../../../pages/platforms/headquarter/settings/personnels/applicants";
const headquarter = [
  {
    name: "Human Resources",
    path: "/hr",
    icon: "users",
    children: [
      {
        name: "Branches",
        path: "/hr/branches",
        icon: "map",
        component: Branches,
      },
      {
        name: "Top Branch",
        path: "/hr/top/branch",
        icon: "crown",
      },
      {
        name: "Best Employees",
        path: "/hr/employee",
        icon: "badge-check",
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
        path: "/commerce/duty",
        icon: "calendar-days",
      },
    ],
  },
  {
    name: "Procurement",
    path: "/duty",
    icon: "package",
    children: [
      {
        name: "Suppliers",
        path: "/duty/suppliers",
        icon: "truck",
      },
      {
        name: "Stock",
        path: "/duty/stock",
        icon: "warehouse",
      },
      {
        name: "Merchandise",
        path: "/duty/merchandise",
        icon: "shopping-bag",
      },
      {
        name: "Equipment",
        path: "/duty/equipments",
        icon: "hammer",
        component: ProcurmentEquipments,
      },
      {
        name: "Preventive Maintenance",
        path: "/duty/maintenance",
        icon: "shield-check",
      },
    ],
  },
  {
    name: "Settings",
    path: "/settings",
    icon: "sliders-horizontal",
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
            component: banner,
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
            component: Tagline,
          },
          {
            name: "Description",
            path: "/descriptions",
            icon: "file-text",
            component: Description,
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
            // component: Insources,
          },
          {
            name: "HMO",
            path: "/hmo",
            icon: "external-link",
            component: Hmo,
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
            component: Procurement,
          },
        ],
      },
    ],
  },
  {
    name: "Mortality",
    path: "/mortality",
    icon: "alert-triangle",
  },
];

export default headquarter;
