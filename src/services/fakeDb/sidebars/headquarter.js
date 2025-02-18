// import Staff from "../../../pages/platforms/headquarter/file201/exstaffs";

import Equipments from "../../../pages/platforms/headquarter/file201/equipments";
import Heads from "../../../pages/platforms/headquarter/file201/heads";
import Physicians from "../../../pages/platforms/headquarter/file201/physicians";
import Procurments from "../../../pages/platforms/headquarter/file201/procurments";
import Staffs from "../../../pages/platforms/headquarter/file201/staff";
import Sources from "../../../pages/platforms/headquarter/file201/sources";
import Applicants from "../../../pages/platforms/headquarter/file201/applicants";

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
        component: Sources,
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
      },
      {
        name: "Menus",
        path: "/hr/menus",
        icon: "list",
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
      },
      {
        name: "Preventive Maintenance",
        path: "/duty/maintenance",
        icon: "code-branch",
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
