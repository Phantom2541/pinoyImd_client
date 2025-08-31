import Dashboard from "../../../pages/platforms/SuperAdmin/dashboard";
import Companies from "../../../pages/platforms/SuperAdmin/companies";
import HealthCard from "../../../pages/platforms/SuperAdmin/healthCard";
import Products from "../../../pages/platforms/SuperAdmin/commerce/supplies/products";
import generics from "../../../pages/platforms/SuperAdmin/commerce/medicines/generics";
import machines from "../../../pages/platforms/SuperAdmin/commerce/assets/machines";
import PasswordReseter from "../../../pages/platforms/SuperAdmin/passwordReseter";
import FormTemplate from "../../../pages/platforms/SuperAdmin/formTemplate";

const admin = [
  {
    name: "Dashboard",
    title: "Overview of platform activity.",
    icon: "tachometer-alt",
    path: "/dashboard",
    component: Dashboard,
  },
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
    name: "Form Template",
    path: "/super/admin/form",
    icon: "code-branch",
    component: FormTemplate,
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
  {
    name: "Password Reseter",
    path: "/super/admin/password-reseter",
    icon: "key",
    component: PasswordReseter,
  },
];

export default admin;
