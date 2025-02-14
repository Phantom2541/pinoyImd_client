const carpentry = [
  {
    name: "POS", // Transactions || Point Of Sales
    path: "/transactions",
    children: [
      {
        name: "Menus",
        path: "/transactions/patients",
      },
      {
        name: "Preferences",
        path: "/transactions/sales",
      },
    ],
  },
  {
    name: "Accrued",
    path: "/accrued",
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

export default carpentry;
