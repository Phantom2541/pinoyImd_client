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
  DragDrop,
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
        icon: "shopping-cart",
        component: Cashier,
      },
      {
        name: "Deals",
        path: "/deals",
        component: Deals,
        icon: "handshake",
      },
      {
        name: "Remmitances",
        path: "/remmitances",
        component: Remmitances,
        icon: "money-check",
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
        icon: "file-invoice-dollar",
      },
      {
        name: "Vouchers", // expenses from sales today
        path: "/vouchers",
        component: Vouchers,
        icon: "receipt",
      },
      {
        name: "Statement of Account",
        path: "/soa",
        icon: "balance-scale",
        children: [
          {
            name: "Outsource", // Sendout
            path: "/outsource",
            icon: "truck",
          },
          {
            name: "Insource", // Receivables  from sales vouchers
            path: "/insource",
            icon: "warehouse",
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
        icon: "utensils",
      },
      {
        name: "Services",
        path: "/services",
        component: Services,
        icon: "list",
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
        icon: "truck",
      },
      {
        name: "Insources",
        path: "/insources",
        component: Insources,
        icon: "warehouse",
      },
      {
        name: "Utilities",
        path: "/utilities",
        component: Utilities,
        icon: "tools",
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
        icon: "table",
      },
      {
        name: "Collapsables",
        path: "/collapsables",
        component: Collapsable,
        icon: "align-justify",
      },
      {
        name: "Calendars",
        path: "/calendars",
        component: Calendar,
        icon: "calendar-alt",
      },
      {
        name: "DragDrop",
        path: "/DragDrop",
        component: DragDrop,
      },
    ],
  },
];

export default cashier;
