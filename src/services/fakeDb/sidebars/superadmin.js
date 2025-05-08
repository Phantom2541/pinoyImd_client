import Companies from "../../../pages/platforms/SuperAdmin/companies";

const admin = [
  {
    name: "Companies",
    path: "/super/admin/companies",
    icon: "code-branch",
    component: Companies,
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
