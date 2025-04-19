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
      },
      {
        name: "Representatives",
        path: "/users/patron",
      },
      {
        name: "Banned",
        path: "/users/banned",
      },
    ],
  },
];

export default admin;
