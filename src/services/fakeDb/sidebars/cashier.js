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
  Remittances,
  Hotlines,
} from "../../../pages/platforms/cashier";

import Payables from "../../../pages/platforms/cashier/accrued/payables";
import Receivables from "../../../pages/platforms/cashier/accrued/receivables";
import Payments from "../../../pages/platforms/cashier/accrued/payments";
import Vouchers from "../../../pages/platforms/cashier/accrued/vouchers";
// import SOA from "../../../pages/platforms/cashier/accrued/soa";
// import ExperimentalLedger from "../../../pages/platforms/manager/pos/ExperimentalLedger";
// import Remittances from "../../../pages/platforms/manager/pos/remittances";
// //import Outsource from "../../../pages/platforms/manager/provider";
// import Accrued from "../../../pages/platforms/frontdesk/liabilities/accrueds";

const cashier = [
  {
    name: "Bulletin",
    icon: "tachometer-alt",
    path: "/cashier/bulletin",
    title: "news and updates",
    component: Bulletin,
  },
  {
    name: "Cash Register",
    path: "/cashier",
    icon: "money-bill",
    title: "cash register",
    children: [
      {
        name: "pos", // Point Of Sales
        path: "/pos",
        icon: "shopping-cart",
        title: "point of sales",
        component: Cashier,
      },
      {
        name: "Deals",
        path: "/deals",
        icon: "handshake",
        title: "Census of services deals of the day",
        component: Deals,
      },
      {
        name: "Remittances",
        path: "/remittances",
        icon: "money-check",
        title: "Ledger of daily remittances",
        component: Remittances,
      },
    ],
  },
  {
    name: "Accrued", // liabilities
    path: "/accrued",
    icon: "tv",
    title: "liabilities and obligations",
    children: [
      /**
       * obligation for services or goods received but not yet paid for by the accounting period's en
       *  unpaid bills (Water, Electricity, etc.)
       * Electric bill
       * Water bill
       * WIFI bill
       * Rental
       */
      {
        name: "Accounts Payable (A/P)",
        path: "/payables",
        icon: "file-invoice-dollar",
        title: "Outstanding payments for suppliers and utilities.",
        component: Payables,
      },
      /**
       * Collections from vouchers
       */
      {
        name: "Accounts Receivable (A/R)",
        path: "/receivables",
        icon: "money-bill",
        title: "Unpaid invoices from corporate accounts or HMOs",
        component: Receivables,
      },
      {
        name: "Payments",
        path: "/payments",
        icon: "dollar-sign",
        title: "List of payments made.",
        component: Payments,
      },
      /**
       * Receivables  from sales vouchers
       * from daily sales
       * to be included as a SOA of insource
       */
      {
        name: "Statement of Account",
        path: "/soa",
        icon: "balance-scale",
        title: "Insource from monthly sales",
        // component: Insources,
      },
      /**
       * Personal Vouchers
       * from daily sales
       */
      {
        name: "Vouchers",
        path: "/vouchers",
        icon: "receipt",
        title: "Vouchers from daily sales",
        component: Vouchers,
      },
    ],
  },
  //viewing only
  {
    name: "Sources",
    path: "/sources",
    icon: "cogs",
    title: "sources",
    children: [
      {
        name: "Outsources",
        path: "/outsources",
        icon: "truck",
        title:
          "List of Companies that provide services that are not yet available",
        component: Outsources,
      },
      {
        name: "Insources",
        path: "/insources",
        icon: "warehouse",
        title: "List of Companies who send out their services",
        component: Insources,
      },
      {
        name: "Utilities",
        path: "/utilities",
        icon: "tools",
        title: "List of Company that provides Utilities or supports",
        component: Utilities,
      },
      {
        name: "Suppliers",
        path: "/suppliers",
        icon: "handshake",
        title: "List of company that provides supplies",
        // component: Suppliers,
      },
      {
        name: "Hotlines",
        path: "/hotlines",
        icon: "phone",
        title: "List of Hotlines",
        component: Hotlines,
      },
    ],
  },
  //viewing only
  {
    name: "Services Catalog",
    path: "/catalogs",
    icon: "clipboard-list",
    title: "services catalog",
    children: [
      {
        name: "Menus",
        path: "/menus",
        icon: "utensils",
        title: "Menus",
        component: Menus,
      },
      {
        name: "Services",
        path: "/services",
        icon: "list",
        title: "Services",
        component: Services,
      },
    ],
  },
];

export default cashier;
