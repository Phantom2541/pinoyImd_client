const admin = [
  {
    name: "Companies",
    icon: "code-branch",
    path: "/admin/companies",
  },
  {
    name: "Applications",
    icon: "user-tie",
    path: "/admin/applications",
  },
  {
    name: "Patrons",
    icon: "users",
    path: "/admin/patrons",
  },
  {
    name: "Suggestions",
    icon: "list",
    path: "/admin/suggestions",
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
        icon: "user-secret",
      },
      {
        name: "Banned",
        path: "/users/banned",
        icon: "user-large-slash",
      },
    ],
  },
];

export default admin;
