import Dashboard from "../../../../pages/platforms/manager/dashboard/index.jsx";

const engineering = [
  {
    name: "Dashboard",
    title: "Overview of platform activity.",
    icon: "tachometer-alt",
    path: "/dashboard",
    component: Dashboard,
  },
  {
    name: "Operations",
    path: "/operations",
    icon: "tools",
    children: [
      {
        name: "Work Orders",
        title: "Repair, installation, and maintenance tasks.",
        path: "/operations/work-orders",
        icon: "clipboard-list",
      },
      {
        name: "Service Requests",
        title: "Requests from branches needing technical assistance.",
        path: "/operations/requests",
        icon: "wrench",
      },
      {
        name: "Preventive Maintenance",
        title: "Scheduled maintenance for machines and devices.",
        path: "/operations/preventive-maintenance",
        icon: "calendar-check",
      },
    ],
  },

  {
    name: "Integrations",
    path: "/integrations",
    icon: "plug",
    children: [
      {
        name: "Bridge Deployments",
        title: "Branches with installed Pinoy iMD middleware.",
        path: "/integrations/deployments",
        icon: "server",
      },
      {
        name: "LIS Bridges",
        title: "Middleware services for laboratory machine integration.",
        path: "/integrations/bridges",
        icon: "exchange-alt",
      },
      {
        name: "Device Interfaces",
        title: "Connected analyzers, machines, and instrument mappings.",
        path: "/integrations/interfaces",
        icon: "network-wired",
      },
      {
        name: "Message Logs",
        title: "HL7, ASTM, and device communication logs.",
        path: "/integrations/logs",
        icon: "file-alt",
      },
    ],
  },

  {
    name: "Equipment",
    path: "/equipment",
    icon: "microscope",
    children: [
      {
        name: "Registry",
        title: "Master list of analyzers, devices, and equipment.",
        path: "/equipment/registry",
        icon: "list",
      },
      {
        name: "Calibration",
        title: "Calibration records and schedules.",
        path: "/equipment/calibration",
        icon: "sliders-h",
      },
      {
        name: "Maintenance History",
        title: "Repair and service history of machines.",
        path: "/equipment/history",
        icon: "history",
      },
    ],
  },

  {
    name: "Procurement",
    path: "/procurement",
    icon: "shopping-cart",
    children: [
      {
        name: "Purchase Requests",
        title: "Requests for parts, tools, or engineering supplies.",
        path: "/procurement/requests",
        icon: "file-invoice",
      },
      {
        name: "Purchase Orders",
        title: "Approved engineering purchases.",
        path: "/procurement/orders",
        icon: "file-signature",
      },
    ],
  },

  {
    name: "Inventory",
    path: "/inventory",
    icon: "boxes",
    children: [
      {
        name: "Products",
        title: "Engineering supplies and consumables.",
        path: "/inventory/products",
        icon: "box",
      },
      {
        name: "Stocks",
        title: "Available stock quantity per branch or storage.",
        path: "/inventory/stocks",
        icon: "warehouse",
      },
      {
        name: "Spare Parts",
        title: "Machine parts, cables, sensors, and accessories.",
        path: "/inventory/spare-parts",
        icon: "cogs",
      },
    ],
  },
];

export default engineering;
