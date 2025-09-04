import { HotlinesPoster } from "../../../../pages/platforms/cashier";

const carpentry = [
  {
    name: "POS", // Transactions || Point Of Sales
    path: "/transactions",
    icon: "cogs",
    children: [
      {
        name: "Menus",
        path: "/transactions/patients",
        icon: "cash-register",
      },
      {
        name: "Preferences",
        path: "/transactions/sales",
        icon: "money-bill",
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
        icon: "tv",
      },
      {
        name: "Receivables",
        path: "/accrued/receivables",
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
        path: "/liability/temperature",
        title: "temperature",
      },
      {
        name: "Supply",
        title: "stocks",
        path: "/liability/supply",
        icon: "box",
      },
      {
        name: "Machine",
        title: "Preventive Maintenance",
        path: "/liability/machine",
        icon: "tools",
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
        icon: "cogs",
      },
      {
        name: "Services",
        path: "/offers/services",
        icon: "tools",
      },
    ],
  },
  // {
  //   name: "Hotlines",
  //   path: "/hotlines",
  //   icon: "phone-alt",
  //   title: "Emergency Hotlines Poster",
  //   component: HotlinesPoster,
  // },
];

export default carpentry;
