import {
  // Employee,
  Applicants,
  Equipments,
  Heads,
  Physicians,
  Procurments,
  Staffs,
} from "../../../pages/platforms/headquarter/file201";
import Services from "../../../pages/platforms/manager/settings/services";
import Menus from "../../../pages/platforms/manager/settings/menus";
import Banner from "../../../pages/platforms/manager/settings/banner";
import Logo from "../../../pages/platforms/manager/settings/logo";
import Tieups from "../../../pages/platforms/manager/settings/tieups";
import ProcurmentEquipments from "../../../pages/platforms/headquarter/procurement/equipments";

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
    icon: "code-*branch",
    children: [
      {
        name: "Branches",
        path: "/hr/branches",
        icon: "code-branch",
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
          name: "Equipments",
          path: "/equipments",
          component: Equipments,
        },
        {
          name: "Procurement",
          path: "/procurement",
          component: Procurments, 
        },
  
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
          name: "Suppliers",
          path: "/suppliers",
        },
        {
          name: "Sourcing",
          path: "/sourcing",
        },
        {
          name: "Tie Up",
          path: "/tieup",
          component: Tieups,
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
