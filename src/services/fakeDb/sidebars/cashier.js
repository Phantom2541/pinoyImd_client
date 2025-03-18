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
  Search,
} from "../../../pages/templates";

import Payables from "../../../pages/platforms/cashier/accrued/payables";
import Receivables from "../../../pages/platforms/cashier/accrued/receivables";
import Payments from "../../../pages/platforms/cashier/accrued/payments";
import Vouchers from "../../../pages/platforms/cashier/accrued/vouchers";
// import SOA from "../../../pages/platforms/cashier/accrued/soa";
// import ExperimentalLedger from "../../../pages/platforms/manager/pos/ExperimentalLedger";
// import Remmitances from "../../../pages/platforms/manager/pos/remittances";
// //import Outsource from "../../../pages/platforms/manager/provider";
// import Accrued from "../../../pages/platforms/frontdesk/liabilities/accrueds";

// const cashier = [
//   {
//     name: "bulletin",

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
      /**
       * obligation for services or goods received but not yet paid for by the accounting period's en
       * Electric bill
       * Water bill
       * WIFI bill
       * Rental
       */
      {
        name: "Accrued",
        title: "stocks",
        path: "/accrued",
        // component: Accrued,
      },
      /**
       * an obligation that has already been settled or fulfilled
       * Paid Electric bill
       * Paid Water bill
       * Salary
       * Voucher / petty cash
       * etc.
       */
      {
        name: "Settled",
        title: "stocks",
        // path: "/settled",
      },
      /**
       * unpaid bills (Water, Electricity, etc.)
       * Liabilities
       */
      {
        name: "Payables",
        path: "/payables",
        component: Payables,
        icon: "file-invoice-dollar",
      },
      /**
       * Collections from vouchers
       */
      {
        name: "Receivables",
        path: "/receivables",
        component: Receivables,
      },
      {
        name: "Payments",
        path: "/payments",
        component: Payments,
      },
      /**
       * Personal Vouchers
       * from daily sales
       */
      {
        name: "Vouchers",
        path: "/vouchers",
        component: Vouchers,
        icon: "receipt",
      },
      /**
       * statement of Account (Sendout)
       */
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
      {
        name: "Suppliers",
        path: "/suppliers",
        // component: Suppliers,
        icon: "handshake",
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
        icon: "calendar-alt",
      },
      {
        name: "Search",
        path: "/search",
        component: Search,
        icon: "calendar-alt",
      },
    ],
  },
];

export default cashier;
