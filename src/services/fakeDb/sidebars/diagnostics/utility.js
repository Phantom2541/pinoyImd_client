//import { HotlinesPoster } from "../../../../pages/platforms/cashier";

const utility = [
  {
    name: "Housekeeper", // Transactions || Point Of Sales
    path: "/housekeeper",
    icon: "cogs",
    children: [
      {
        name: "Request",
        path: "/housekeeper/request",
        icon: "list",
      },
      {
        name: "Trackers",
        path: "/housekeeper/trackers",
        icon: "list",
      },
    ],
  },
  {
    name: "Liability",
    path: "/liability",
    icon: "tv",
    children: [
      {
        name: "Purchase Order",
        title: "stocks",
        path: "/liability/order",
        icon: "box",
      },
    ],
  },
  {
    name: "Supply",
    path: "/supply",
    icon: "list",
    children: [
      {
        name: "Products",
        path: "/supply/menus",
        icon: "cogs",
      },
      {
        name: "Stocks",
        path: "/supply/stocks",
        icon: "cogs",
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

export default utility;
