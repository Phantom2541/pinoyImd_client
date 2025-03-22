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

import Payables from "../../../pages/platforms/cashier/accrued/payables";
import Receivables from "../../../pages/platforms/cashier/accrued/receivables";
import Payments from "../../../pages/platforms/cashier/accrued/payments";
import Vouchers from "../../../pages/platforms/cashier/accrued/vouchers";
// import SOA from "../../../pages/platforms/cashier/accrued/soa";
// import ExperimentalLedger from "../../../pages/platforms/manager/pos/ExperimentalLedger";
// import Remmitances from "../../../pages/platforms/manager/pos/remittances";
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
        name: "Remmitances",
        path: "/remmitances",
        icon: "money-check",
        title: "Ledger of daily remittances",
        component: Remmitances,
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
       * an obligation that has already been settled or fulfilled
       * Paid Electric bill
       * Paid Water bill
       * Salary
       * Voucher / petty cash
       * etc.
       */
      {
        name: "Settled",
        path: "/settled",
        icon: "dollar-sign",
        title: "Settled payments for suppliers and utilities.",
        // component: Accrued,
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
        component: Payments,
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
      /**
       * Receivables  from sales vouchers
       * from daily sales
       * to be included as a SOA of insource
       */
      {
        name: "SOA",
        path: "/soa",
        icon: "warehouse",
        title: "Insource from monthly sales",
        // component: Insources,
      },
      /**
       * statement of Account (Sendout)
       */
      // {
      //   name: "Statement of Account",
      //   path: "/soa",
      //   icon: "balance-scale",
      //   children: [
      //     {
      //       name: "Outsource", // Sendout
      //       path: "/outsource",
      //       icon: "truck",
      //     },
      //   ],
      // },
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
