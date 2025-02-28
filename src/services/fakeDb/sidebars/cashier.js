import Dashboard from "../../../pages/platforms/cashier/dashboard";
import {
  // Cashier,
  Sales,
  Ledger,
  Menus,
  Services,
  Insources,
  Outsources,
} from "../../../pages/platforms/cashier";
import { Tablestemplate, Collapsable } from "../../../pages/tamplates";

import Cashier from "../../../pages/platforms/cashier/pos/cashier";
import Payables from "../../../pages/platforms/cashier/accrued/payables";
import Vouchers from "../../../pages/platforms/cashier/accrued/vouchers";
import ExperimentalLedger from "../../../pages/platforms/manager/pos/ExperimentalLedger";
import Remmitances from "../../../pages/platforms/manager/pos/remittances";
//import Outsource from "../../../pages/platforms/manager/provider";

const cashier = [
  {
    name: "Dashboard",
    icon: "tachometer-alt",
    path: "/dashboard",
    component: Dashboard,
  },
  {
    name: "POS", // Point Of Sales
    path: "/pos",
    icon: "cogs",
    children: [
      {
        name: "Cashier",
        path: "/patients",
        component: Cashier,
      },
      {
        name: "Sales",
        path: "/sales",
        component: Sales,
      },
      {
        name: "Remmitances",
        path: "/remmitances",
        component: Remmitances,
      },
      {
        name: "Ledger",
        path: "/Ledger",
        component: ExperimentalLedger,
      },
      {
        name: "Ledger",
        path: "/ledger",
        component: Ledger,
      },
    ],
  },
  {
    name: "Accrued", // liabilities
    path: "/accrued",
    icon: "tv",
    children: [
      {
        name: "Payables",
        path: "/payables",
        component: Payables,
      },
      {
        name: "Vouchers", // expenses from sales today
        path: "/vouchers",
        component: Vouchers,
      },
      {
        name: "SOA", // statement of Account (Sendout)
        path: "/soa",
      },
      {
        name: "Receivables", // unpaid services
        path: "/receivables",
      },
    ],
  },
  {
    name: "Offers", //viewing only
    path: "/offers",
    icon: "list",
    children: [
      {
        name: "Menus",
        path: "/menus",
        component: Menus,
      },
      {
        name: "Services",
        path: "/services",
        component: Services,
      },
    ],
  },
  {
    name: "Sources", //viewing only
    path: "/sources",
    icon: "list",
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
    ],
  },
];

export default cashier;
