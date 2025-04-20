import Bulletin from "../../../pages/platforms/cashier/bulletin";
import {
  Cashier,
  Deals,
  Menus,
  Services,
  Insources,
  Outsources,
  Utilities,
  Remittances,
  Hotlines,
  Suppliers,
  Payables,
  Receivables,
  Vouchers,
  Payments,
  SOA,
  Reseco,
} from "../../../pages/platforms/cashier";

const cashier = [
  {
    name: "Bulletin",
    icon: "tachometer-alt",
    path: "/bulletin",
    title: "news and updates",
    component: Bulletin,
  },
  {
    name: "Cash Register",
    path: "/cash/register",
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
       *  unpaid bills (Water, Electricity, SOA  & etc.)
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
      {
        name: "Payments",
        path: "/payments",
        icon: "dollar-sign",
        title: "List of payments made.",
        component: Payments,
      },
      /**
       * SOA from A/P
       * confirming the SOA listed in A/P
       */
      {
        name: "Statement of Account",
        path: "/soa",
        icon: "balance-scale",
        title: "Outsourced services from monthly sales",
        component: SOA,
      },
      /**
       * Generated monthly Collections from vouchers  (SOA)
       */
      {
        name: "Accounts Receivable (A/R)",
        path: "/receivables",
        icon: "money-bill",
        title: "Unpaid invoices from corporate accounts or HMOs",
        component: Receivables,
      },
      /**
       * Unproessed Vouchers
       * from daily sales
       */
      {
        name: "Vouchers",
        path: "/vouchers",
        icon: "receipt",
        title: "Vouchers from daily sales",
        component: Vouchers,
      },
      {
        name: "Reseco",
        path: "/reseco",
        icon: "handshake",
        title: "Monthly Reseco Deals",
        component: Reseco,
      },
    ],
  },
  /**
   * at this point its only viewing
   */
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
        name: "Suppliers",
        path: "/suppliers",
        icon: "handshake",
        title: "List of company that provides supplies",
        component: Suppliers,
      },
      {
        name: "Utilities",
        path: "/utilities",
        icon: "tools",
        title: "List of Company that provides Utilities or supports",
        component: Utilities,
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
