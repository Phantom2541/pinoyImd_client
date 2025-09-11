import {
  // Onboard,
  Tasks,
  Reports,
} from "../../../../pages/platforms/laboratory/diagnostics";
import { Menus } from "../../../../pages/platforms/physician";
import {  Services } from "../../../../pages/platforms/cashier";
import Appointments from "../../../../pages/platforms/clinical/appointment";
//import { HotlinesPoster } from "../../../../pages/platforms/cashier";

const clinical = [
  {
    name: "Dashboard",
    icon: "tachometer-alt",
    path: "/clinical/bulletin",
  },
  {
    name: "Schedules",
    path: "/Schedules",
    icon: "cogs",
    children: [
      {
        name: "Dashboard",
        title: "Overview of platform activity.",
        path: "/dashboard",
        icon: "concierge-bell",
      },
      {
        name: "Appointments",
        path: "/appointments",
        icon: "cogs",
        component: Appointments,
      },
      {
        name: "Tasks",
        path: "/tasks",
        icon: "cogs",
        component: Tasks,
      },
      {
        name: "Reports",
        path: "/reports",
        icon: "cogs",
        component: Reports,
      },
      {
        name: "schedules",
        path: "/schedules",
        icon: "calendar-alt",
        // component: Reports,
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
  // {
  //   name: "Hotlines",
  //   path: "/hotlines",
  //   icon: "phone-alt",
  //   title: "Emergency Hotlines Poster",
  //   component: HotlinesPoster,
  // },
];

export default clinical;
