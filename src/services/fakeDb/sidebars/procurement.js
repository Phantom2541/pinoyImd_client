const procurement = [
  {
    name: "Purchases",
    path: "/purchases",
    icon: "cogs",
    children: [
      {
        name: "Request",
        path: "/purchases/request",
      },
      {
        name: "Approved",
        path: "/purchases/approved",
      },
      {
        name: "Completed",
        path: "/purchases/purchase",
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
      },
      {
        name: "Stocks",
        path: "/offers/stocks",
      },
    ],
  },
];

export default procurement;
