const pharmacist = [
  {
    name: "Dashboard",
    icon: "tachometer-alt",
    path: "/dashboard",
  },
  {
    name: "POS", // Transactions || Point Of Sales
    path: "/transactions",
    icon: "cogs",
    children: [
      {
        name: "Bills",
        path: "/transactions/patients",
      },
      {
        name: "Ledgers",
        path: "/transactions/sales",
      },
    ],
  },
  {
    name: "Accrued",
    path: "/accrued",
    icon: "tv",
    children: [
      {
        name: "Payables",
        path: "/accrued/payables",
      },
      {
        name: "Receivables",
        path: "/accrued/receivables",
      },
    ],
  },
  {
    name: "Liability",
    path: "/liability",
    icon: "tv",
    children: [
      {
        name: "Temperature",
        path: "/liability/temperature",
      },
      {
        name: "Supply",
        title: "stocks",
        path: "/liability/supply",
      },
      {
        name: "Machine",
        title: "Preventive Maintenance",
        path: "/liability/machine",
      },
    ],
  },
  {
    name: "Offers",
    path: "/offers",
    icon: "list",
    children: [
      {
        name: "Menus",
        path: "/offers/menus",
      },
      {
        name: "Services",
        path: "/offers/services",
      },
    ],
  },
];

export default pharmacist;
