import {
  Onboard,
  Tasks,
  Reports,
} from "../../../pages/platforms/frontdesk/diagnostics";

import { Menus, Services } from "../../../pages/platforms/cashier";

const clinical = [
  {
    name: "Dashboard",
    icon: "tachometer-alt",
    path: "/clinical/bulletin",
  },
  {
    name: "Diagnostics",
    path: "/laboratory",
    icon: "cogs",
    children: [
      {
        name: "Onboarding",
        path: "/onboarding",
        icon: "cogs",
        component: Onboard,
      },
      {
        name: "Tasks",
        path: "/task",
        icon: "cogs",
        component: Tasks,
      },
      {
        name: "Reports",
        path: "/reports",
        icon: "cogs",
        component: Reports,
      },
    ],
  },
  {
    name: "Services", //viewing only
    path: "/offers",
    icon: "list",
    children: [
      /**
       * a group of related services
       */
      {
        name: "Menus",
        path: "/menus",
        icon: "cogs",
        component: Menus,
      },
      /**
       *  a single service
       */
      {
        name: "examinations",
        path: "/services",
        icon: "tools",
        component: Services,
      },
    ],
  },
  {
    name: "Liability",
    path: "/liability",
    icon: "tv",
    children: [
      {
        name: "Supply",
        title: "stocks",
        icon: "box",
        path: "/liability/supply",
      },
    ],
  },
  {
    name: "Merchandise",
    icon: "list",
    children: [
      {
        name: "Products",
        icon: "cogs",
        path: "/clinical/offers/menus",
      },
      {
        name: "Stocks",
        icon: "tools",
        path: "/clinical/merchandise/stocks",
      },
    ],
  },
];

export default clinical;
