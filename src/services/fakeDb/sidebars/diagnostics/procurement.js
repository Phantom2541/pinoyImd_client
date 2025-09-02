import { HotlinesPoster } from "../../../../pages/platforms/cashier";

const procurement = [
  {
    name: "Bulletin Board",
    icon: "tachometer-alt",
    path: "/bulletin",
    title:
      "Displays announcements and system-wide updates for the frontdesk team.",
    // component: Dashboard,
  },
  {
    name: "Department Requests",
    path: "/requests",
    icon: "clipboard-list",
    title:
      "Manage supply requests from departments, from submission to approval.",
    children: [
      {
        name: "Pending Approval",
        path: "/requests/pending",
        icon: "hourglass-half",
        title: "Requests awaiting manager approval.",
      },
      {
        name: "Approved Requests",
        path: "/requests/approved",
        icon: "check-circle",
        title: "Requests approved and ready for processing.",
      },
      {
        name: "Completed Requests",
        path: "/requests/completed",
        icon: "box-open",
        title: "Requests that have been fulfilled and closed.",
      },
    ],
  },
  {
    name: "Purchase Requisitions",
    path: "/purchase-requisitions",
    icon: "file-signature",
    title: "Create and track purchase requests made to external suppliers.",
    children: [
      {
        name: "Pending Requisitions",
        path: "/purchase-requisitions/pending",
        icon: "hourglass-half",
        title: "Requests awaiting approval or processing.",
      },
      {
        name: "Approved Requisitions",
        path: "/purchase-requisitions/approved",
        icon: "check-circle",
        title:
          "Requisitions that have been approved and are ready for PO creation.",
      },
      {
        name: "Tracking",
        path: "/orders/tracking",
        icon: "truck-loading",
        title: "Orders awaiting delivery.",
      },
      {
        name: "Completed Orders",
        path: "/orders/completed",
        icon: "check-double",
        title: "Orders successfully delivered and completed.",
      },
      {
        name: "Converted to PO",
        path: "/purchase-requisitions/converted",
        icon: "file-invoice-dollar",
        title:
          "Requisitions that have already been processed into purchase orders.",
      },
    ],
  },
  {
    name: "Inventory",
    path: "/inventory",
    icon: "boxes",
    title: "Monitor and manage warehouse and department-level inventories.",
    children: [
      {
        name: "Central Warehouse",
        path: "/inventory/central",
        icon: "warehouse",
        title: "View and manage the main warehouse inventory.",
      },
      {
        name: "Department Inventories",
        path: "/inventory/departments",
        icon: "building",
        title: "Track supplies stored in individual departments.",
        children: [
          {
            name: "HR Department",
            path: "/inventory/departments/hr",
            icon: "user",
            title: "Inventory list of the HR department.",
          },
          {
            name: "Laboratory",
            path: "/inventory/departments/laboratory",
            icon: "flask",
            title: "Inventory list of the Laboratory.",
          },
          {
            name: "Accounting",
            path: "/inventory/departments/accounting",
            icon: "calculator",
            title: "Inventory list of the Accounting department.",
          },
          // Add more departments as needed
        ],
      },
      {
        name: "Reorder Items",
        path: "/inventory/reorder",
        icon: "shopping-cart",
        title: "List of items below minimum stock levels needing reorder.",
      },
      {
        name: "Suppliers",
        path: "/inventory/suppliers",
        icon: "truck",
        title: "Manage supplier products and their availability.",
      },
    ],
  },
  {
    name: "Supplier Ledger",
    path: "/supplier-ledger",
    icon: "file-invoice",
    title:
      "Track all supplier-related billing, payments, and disputes in one consolidated ledger.",
    children: [
      {
        name: "Unpaid Entries",
        path: "/supplier-ledger/unpaid",
        icon: "file-excel",
        title:
          "List of unpaid supplier statements awaiting verification or payment.",
      },
      {
        name: "Paid Entries",
        path: "/supplier-ledger/paid",
        icon: "file-check",
        title:
          "Records of fully paid supplier statements for reference and audit.",
      },
      {
        name: "Disputed Entries",
        path: "/supplier-ledger/disputed",
        icon: "exclamation-triangle",
        title:
          "Statements with unresolved issues like pricing errors or delivery mismatches.",
      },
      {
        name: "Suppliers",
        path: "/supplier-ledger/suppliers",
        icon: "briefcase",
        title: "Manage supplier information, contacts, and supply history.",
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

export default procurement;
