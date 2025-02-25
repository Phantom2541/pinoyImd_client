import {
  Onboard,
  Tasks,
  Reports,
} from "../../../pages/platforms/frontdesk/diagnostics";
import {
  Menus,
  Services,
} from "../../../pages/platforms/cashier";

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
        component: Onboard,
      },
      {
        name: "Tasks",
        path: "/task",
        component: Tasks,
      },
      {
        name: "Reports",
        path: "/reports",
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
         component: Menus,
       },
       /**
        *  a single service
        */
       {
         name: "examinations",
         path: "/services",
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
      },
      {
        name: "Stocks",
        path: "/radiology/offers/stocks",
      },
    ],
  },
];

export default radiology;
