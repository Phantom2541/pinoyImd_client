import Companies from "../../../pages/platforms/SuperAdmin/companies";
import HealthCard from "../../../pages/platforms/SuperAdmin/healthCard";

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
];

export default admin;
