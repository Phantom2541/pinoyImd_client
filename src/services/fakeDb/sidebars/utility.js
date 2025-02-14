const utility = [
  {
    name: "Housekeeper", // Transactions || Point Of Sales
    path: "/housekeeper",
    icon: "cogs",
    children: [
      {
        name: "Request",
        path: "/housekeeper/request",
      },
      {
        name: "Trackers",
        path: "/housekeeper/trackers",
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
      },
      {
        name: "Stocks",
        path: "/supply/stocks",
      },
    ],
  },
];

export default utility;
