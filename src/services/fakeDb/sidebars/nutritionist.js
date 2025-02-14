const nutritionist = [
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
        icon: "cash-register",
        path: "/transactions/patients",
      },
      {
        name: "Ledgers",
        icon: "money-bill",
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
        icon: "list",
        path: "/accrued/payables",
      },
      {
        name: "Receivables",
        icon: "list",
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
        icon: "thermometer",
        path: "/liability/temperature",
      },
      {
        name: "Supply",
        title: "stocks",
        icon: "boxes",
        path: "/liability/supply",
      },
      {
        name: "Machine",
        title: "Preventive Maintenance",
        icon: "money-bill",
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
        icon: "cogs",
        path: "/offers/menus",
      },
      {
        name: "Services",
        icon: "tools",
        path: "/offers/services",
      },
    ],
  },
];

export default nutritionist;
