const procurement = [
  {
    name: "Purchases",
    path: "/purchases",
    icon: "cogs",
    children: [
      {
        name: "Request",
        path: "/purchases/request",
        icon: "cogs",
      },
      {
        name: "Approved",
        path: "/purchases/approved",
        icon: "cogs",
      },
      {
        name: "Completed",
        path: "/purchases/purchase",
        icon: "cogs",
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
        path: "/offers/menus",
        icon: "cogs",
      },
      {
        name: "Stocks",
        path: "/offers/stocks",
        icon: "tools",
      },
    ],
  },
];

export default procurement;
