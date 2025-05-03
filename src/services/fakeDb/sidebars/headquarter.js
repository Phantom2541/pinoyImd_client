import {
  // Employee,
  // Applicants,
  Equipments,
  Heads,
  Physicians,
  Procurments,
  Staffs,
} from "../../../pages/platforms/headquarter/file201";
import Services from "../../../pages/platforms/manager/settings/services";
import Applicants from "../../../pages/platforms/manager/settings/applicants";
import Menus from "../../../pages/platforms/manager/settings/menus";
import Banner from "../../../pages/platforms/manager/settings/banner";
import Logo from "../../../pages/platforms/manager/settings/logo";
import Tieups from "../../../pages/platforms/manager/settings/tieups";
import ProcurmentEquipments from "../../../pages/platforms/headquarter/procurement/equipments";
import { Branches } from "../../../pages/platforms/headquarter/humanResources";

const headquarter = [
  {
    name: "File 201",
    path: "/file201",
    icon: "book-open",
    children: [
      {
        name: "Staff",
        path: "/staff",
        component: Staffs,
      },
      {
        name: "Heads",
        path: "/heads",
        component: Heads,
      },
      {
        name: "Applicants",
        path: "/petitioners",
        component: Applicants,
      },
      {
        name: "Physicians",
        path: "/physicians",
        component: Physicians,
      },
      {
        name: "Sources",
        path: "/source",
        // component: Sources,
      },
      {
        name: "Referral",
        path: "/referral",
        // component: Sources,
      },
      {
        name: "Outsources",
        path: "/outsource",
        // component: Sources,
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
    ],
  },
  {
    name: "Human Resources",
    path: "/hr",
    icon: "code-branch",
    children: [
      {
        name: "Branches",
        path: "/hr/branches",
        icon: "code-branch",
        component: Branches,
      },
      {
        name: "Top Branch",
        path: "/hr/top/branch",
        icon: "list",
      },
      {
        name: "Best Employee's",
        path: "/hr/employee",
        icon: "list",
      },
    ],
  },
  {
    name: "Commerce",
    path: "/commerce",
    icon: "tv",
    children: [
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
        name: "Sales", // daily
        path: "/commerce/sales",
        icon: "list",
      },
      {
        name: "Ledger", // daily
        path: "/commerce/ledger",
        icon: "list",
      },
      {
        name: "Census", // services avail
        path: "/commerce/census",
        icon: "list",
      },
      {
        name: "Duty", // daily duty
        path: "/commerce/duty",
        icon: "list",
      },
      {
        name: "Products",
        path: "/commerce/products",
        icon: "list",
      },
    ],
  },
  {
    name: "procurement's",
    path: "/duty",
    icon: "code-branch",
    children: [
      {
        name: "Supplier's",
        path: "/duty/suppliers",
        icon: "list",
      },
      {
        name: "Stock",
        path: "/duty/stock",
        icon: "list",
      },
      {
        name: "Merchandise",
        path: "/duty/merchandise",
        icon: "list",
      },
      {
        name: "Equipments",
        path: "/duty/equipments",
        icon: "list",
        component: ProcurmentEquipments,
      },
      {
        name: "Preventive Maintenance",
        path: "/duty/maintenance",
        icon: "code-branch",
      },
    ],
  },
  {
    name: "Settings",
    path: "/settings",
    icon: "cogs",
    children: [
      {
        name: "About Us",
        icon: "tv",
        path: "/aboutus",
        children: [
          {
            name: "Banner",
            path: "/banners",
            component: Banner,
          },
          {
            name: "Logos",
            path: "/logos",
            component: Logo,
          },
          {
            name: "tagline",
            path: "/taglines",
            component: Logo,
          },
          {
            name: "Description",
            path: "/descriptions",
            component: Logo,
          },
        ],
      },
      {
        name: "Sources",
        icon: "tv",
        path: "/sources",
        children: [
          {
            name: "Outsourcing",
            path: "/outsourcing",
          },
          {
            name: "Insourcing",
            path: "/insourcing",
          },
          {
            name: "Suppliers",
            path: "/suppliers",
          },
          {
            name: "Tie Up",
            path: "/tieup",
            component: Tieups,
          },
        ],
      },
      {
        name: "Faculties",
        icon: "tv",
        path: "/faculties",
        children: [
          {
            name: "Staff",
            path: "/faculties/staff",
            component: Equipments,
          },
          {
            name: "Heads",
            path: "/faculties/heads",
            component: Procurments,
          },
          {
            name: "Physicians",
            path: "/faculties/physicians",
            component: Physicians,
          },
        ],
      },
      {
        name: "Assets",
        icon: "tv",
        path: "/assets",
        children: [
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
        ],
      },
    ],
  },
  {
    name: "Mortality",
    icon: "code-branch",
    path: "/mortality",
  },
];

export default headquarter;
