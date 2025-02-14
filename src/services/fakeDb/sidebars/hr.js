const hr = [
  {
    name: "Dashboard",
    icon: "tachometer-alt",
    path: "/dashboard",
  },
  {
    name: "File 201",
    path: "/file",
    icon: "tv",
    children: [
      {
        name: "Employee's",
        title: "stocks",
        icon: "boxes",
        path: "/file/employees",
      },
      {
        name: "Applicant",
        title: "stocks",
        icon: "boxes",
        path: "/file/apllicants",
      },
    ],
  },
  {
    name: "Accrued",
    path: "/accrued",
    icon: "tv",
    children: [
      {
        name: "Payroll",
        icon: "list",
        path: "/accrued/payroll",
      },
      {
        name: "Check",
        icon: "list",
        path: "/accrued/checks",
      },
    ],
  },
];

export default hr;
