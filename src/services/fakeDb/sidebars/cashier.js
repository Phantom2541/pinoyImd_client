import Bulletin from "../../../pages/platforms/cashier/bulletin";
import {
  Cashier,
  Deals,
  // Sales,
  Menus,
  Services,
  Insources,
  Outsources,
  Utilities,
  Remmitances,
} from "../../../pages/platforms/cashier";
import {
  Tablestemplate,
  Collapsable,
  Calendar,
} from "../../../pages/templates";

import Payables from "../../../pages/platforms/cashier/accrued/payables";
import Vouchers from "../../../pages/platforms/cashier/accrued/vouchers";

const cashier = [
  {
    name: "Bulletin",
    icon: "tachometer-alt",
    path: "/cashier/bulletin",
    component: Bulletin,
  },
  {
    name: "Cashier",
    path: "/cashier",
    icon: "money-bill",
    children: [
      {
        name: "pos", // Point Of Sales
        path: "/pos",
        component: Cashier,
      },
      {
        name: "Deals",
        path: "/deals",
        component: Deals,
      },
      {
        name: "Remmitances",
        path: "/remmitances",
        component: Remmitances,
      },
    ],
  },
  {
    name: "Accrued", // liabilities
    path: "/accrued",
    icon: "tv",
    children: [
      {
        name: "Payables", // unpaid bills (Water, Electricity, etc.)
        path: "/payables",
        component: Payables,
      },
      {
        name: "Vouchers", // expenses from sales today
        path: "/vouchers",
        component: Vouchers,
      },
      {
        name: "Statement of Account",
        path: "/soa",
        icon: "balance-scale",
        children: [
          {
            name: "Outsource", // Sendout
            path: "/outsource",
          },
          {
            name: "Insource", // Receivables  from sales vouchers
            path: "/insource",
          },
        ],
      },
    ],
  },
  {
    name: "Services Catalog", //viewing only
    path: "/catalogs",
    icon: "clipboard-list",
    children: [
      {
        name: "Menus",
        path: "/menus",
        component: Menus,
      },
      {
        icon: "list",
        name: "Services",
        path: "/services",
        component: Services,
      },
    ],
  },
  {
    name: "Sources", //viewing only
    path: "/sources",
    icon: "cogs",
    children: [
      {
        name: "Outsources",
        path: "/outsources",
        component: Outsources,
      },
      {
        name: "Insources",
        path: "/insources",
        component: Insources,
      },
      {
        name: "Utilities",
        path: "/utilities",
        component: Utilities,
      },
    ],
  },
  {
    name: "Templates ", //viewing only
    path: "/templates ",
    icon: "list",
    children: [
      {
        name: "Tables",
        path: "/tables",
        component: Tablestemplate,
      },
      {
        name: "Collapsables",
        path: "/collapsables",
        component: Collapsable,
      },
      {
        name: "Calendars",
        path: "/calendars",
        component: Calendar,
      },
    ],
  },
];

export default cashier;
