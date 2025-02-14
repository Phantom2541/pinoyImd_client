const clinical = [
  {
    name: "Dashboard",
    icon: "tachometer-alt",
    path: "/dashboard",
  },
  {
    name: "POS", // Transactions || Point Of Sales
    path: "/pos",
    icon: "cogs",
    children: [
      {
        name: "Bills",
        path: "/pos/patients",
      },
      {
        name: "Ledgers",
        path: "/pos/sales",
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
        name: "Supply",
        title: "stocks",
        path: "/liability/supply",
      },
    ],
  },
  {
    name: "Merchandise",
    icon: "list",
    children: [
      {
        name: "Products",
        icon: "cogs",
        path: "/pharmacist/offers/menus",
      },
      {
        name: "Stocks",
        icon: "tools",
        path: "/pharmacist/merchandise/stocks",
      },
    ],
  },
];

export default clinical;
