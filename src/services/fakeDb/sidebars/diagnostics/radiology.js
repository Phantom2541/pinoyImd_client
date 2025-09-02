import {
  Onboard,
  Tasks,
  Reports,
} from "../../../../pages/platforms/radiology/diagnostics";
import { Menus, Services } from "../../../../pages/platforms/cashier";
import { HotlinesPoster } from "../../../../pages/platforms/cashier";

const radiology = [
  {
    name: "Dashboard",
    icon: "tachometer-alt",
    path: "/dashboard",
  },
  {
    name: "Diagnostics",
    path: "/radiology",
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
        path: "/liability/supply",
        icon: "box",
      },
    ],
  },
  {
    name: "Merchandise",
    path: "/offers",
    icon: "list",
    children: [
      {
        name: "Products",
        path: "/radiology/offers/menus",
        icon: "cogs",
      },
      {
        name: "Stocks",
        path: "/radiology/offers/stocks",
        icon: "cogs",
      },
    ],
  },
  {
    name: "Hotlines",
    path: "/hotlines",
    icon: "phone-alt",
    title: "Emergency Hotlines Poster",
    component: HotlinesPoster,
  },
];

export default radiology;
