import Companies from "../../../pages/platforms/SuperAdmin/companies";
import HealthCard from "../../../pages/platforms/SuperAdmin/healthCard";
import Products from "../../../pages/platforms/frontdesk/market/products";
import machines from "../../../pages/platforms/frontdesk/market/machines";
import generics from "../../../pages/platforms/frontdesk/market/generics";

const admin = [
  {
    name: "Companies",
    path: "/super/admin/companies",
    icon: "code-branch",
    component: Companies,
  },
  {
    name: "Health Cards",
    path: "/super/admin/hmos",
    icon: "code-branch",
    component: HealthCard,
  },

  {
    name: "Users",
    path: "/users",
    icon: "users",
    children: [
      {
        name: "List",
        path: "/users/list",
        icon: "users",
      },
      {
        name: "Representatives",
        path: "/users/patron",
        icon: "user-tag",
      },
      {
        name: "Banned",
        path: "/users/banned",
        icon: "ban",
      },
    ],
  },
  {
    name: "Merchandise",
    path: "/merchandise",
    icon: "boxes",
    title:
      "Manage inventory and product listings like machines, medicines, and consumables.",
    children: [
      {
        name: "products",
        path: "/products",
        icon: "cogs",
        title: "Inventory of available products for use or sale.",
        component: Products,
      },
      {
        name: "Machines",
        path: "/merchandise/machines",
        icon: "laptop-code",
        title: "List and manage medical machines and diagnostic equipment.",
        component: machines, // add your component here
      },
      {
        name: "Medicines",
        path: "/medicines",
        icon: "laptop-code",
        title: "Manage pharmaceutical stocks and generic drugs.",
        component: generics, // add your component here
      },
    ],
  },
];

export default admin;
