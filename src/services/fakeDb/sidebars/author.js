const author = [
  {
    name: "POS", // Transactions || Point Of Sales
    path: "/transactions",
    icon: "cogs",
    children: [
      {
        name: "Menus",
        path: "/patients",
      },
      {
        name: "Preferences",
        path: "/sales",
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
      },
      {
        name: "Supply",
        path: "/supply",
      },
      {
        name: "Machine",
        path: "/machine",
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
      },
      {
        name: "Receivables",
        path: "/receivables",
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
      },
      {
        name: "Supply",
        path: "/supply",
      },
      {
        name: "Machine",
        path: "/machine",
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
      },
      {
        name: "Services",
        path: "/services",
      },
    ],
  },
];

export default author;
