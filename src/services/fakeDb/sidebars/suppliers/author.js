const author = [
  {
    name: "POS", // Transactions || Point Of Sales
    path: "/transactions",
    icon: "cogs",
    children: [
      {
        name: "Menus",
        path: "/patients",
        icon: "cash-register",
      },
      {
        name: "Preferences",
        path: "/sales",
        icon: "money-bill",
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
        path: "/temperature",
        icon: "tv",
      },
      {
        name: "Supply",
        path: "/supply",
        icon: "tv",
      },
      {
        name: "Machine",
        path: "/machine",
        icon: "tv",
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
        path: "/payables",
        icon: "tv",
      },
      {
        name: "Receivables",
        path: "/receivables",
        icon: "tv",
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
        path: "/temperature",
        icon: "tv",
      },
      {
        name: "Supply",
        path: "/supply",
        icon: "tv",
      },
      {
        name: "Machine",
        path: "/machine",
        icon: "tv",
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
        path: "/menus",
        icon: "cogs",
      },
      {
        name: "Services",
        path: "/services",
        icon: "tools",
      },
    ],
  },
];

export default author;
