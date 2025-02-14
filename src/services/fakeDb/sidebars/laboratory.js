const laboratory = [
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
    name: "Purchase",
    path: "/purchase",
    icon: "money-bill",
    children: [
      {
        name: "Request",
        icon: "note",
        path: "/purchase/request",
      },
      {
        name: "Ledgers",
        icon: "money-bill",
        path: "/purchase/sales",
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
        name: "Supply",
        title: "stocks",
        icon: "boxes",
        path: "/liability/supply",
      },
    ],
  },
  {
    name: "Merchandise",
    path: "/offers",
    icon: "list",
    children: [
      {
        name: "Products",
        icon: "cogs",
        path: "/offers/menus",
      },
      {
        name: "Stocks",
        icon: "tools",
        path: "/offers/stocks",
      },
    ],
  },
];

export default laboratory;
