const procurement = [
  {
    name: "Requests",
    path: "/requests",
    icon: "clipboard-list",
    children: [
      {
        name: "Pending Approval",
        path: "/requests/pending",
        icon: "hourglass-half",
      },
      {
        name: "Approved Requests",
        path: "/requests/approved",
        icon: "check-circle",
      },
      {
        name: "Completed Requests",
        path: "/requests/completed",
        icon: "box-open",
      },
    ],
  },
  {
    name: "Inventory",
    path: "/inventory",
    icon: "boxes",
    children: [
      {
        name: "Central Warehouse",
        path: "/inventory/central",
        icon: "warehouse",
      },
      {
        name: "Department Inventories",
        path: "/inventory/departments",
        icon: "building",
        children: [
          {
            name: "HR Department",
            path: "/inventory/departments/hr",
            icon: "user",
          },
          {
            name: "Laboratory",
            path: "/inventory/departments/laboratory",
            icon: "flask",
          },
          {
            name: "Accounting",
            path: "/inventory/departments/accounting",
            icon: "calculator",
          },
          // Add other departments dynamically or statically here
        ],
      },
      {
        name: "Reorder Items",
        path: "/inventory/reorder",
        icon: "shopping-cart",
      },
      { name: "Suppliers", path: "/inventory/suppliers", icon: "truck" },
    ],
  },
  {
    name: "Orders",
    path: "/orders",
    icon: "truck-loading",
    children: [
      {
        name: "Pending Orders",
        path: "/orders/pending",
        icon: "hourglass-half",
      },
      {
        name: "Completed Orders",
        path: "/orders/completed",
        icon: "check-double",
      },
    ],
  },
];

export default procurement;
