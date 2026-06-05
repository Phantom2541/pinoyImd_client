//import { HotlinesPoster } from "../../../../pages/platforms/cashier";

const wards = [
  {
    name: "Dashboard",
    icon: "chart-pie",
    path: "/wards/dashboard",
  },
  {
    name: "Patient Management",
    icon: "file-medical",
    children: [
      {
        name: "Patient Admission",
        icon: "bed-pulse",
        path: "/wards/new",
      },
      {
        name: "Admitted Patients",
        icon: "hospital-user",
        path: "/wards/current",
      },
      {
        name: "Discharges",
        icon: "user-check",
        path: "/wards/discharges",
      },
      {
        name: "Transfers",
        icon: "person-walking-luggage",
        path: "/wards/transfers",
      },
    ],
  },
  {
    name: "Reports",
    icon: "file-medical",
    children: [
      {
        name: "Daily Census",
        path: "/wards/reports/daily-census",
        icon: "calendar-day",
      },
      {
        name: "Monthly Census",
        path: "/wards/reports/monthly-census",
        icon: "calendar-alt",
      },
      {
        name: "Admission History",
        path: "/wards/reports/history",
        icon: "book-medical",
      },
    ],
  },
  {
    name: "Settings",
    icon: "gear",
    children: [
      {
        name: "Ward / Room Setup",
        path: "/wards/settings/rooms",
        icon: "bed",
      },
      {
        name: "Admission Types",
        path: "/wards/settings/types",
        icon: "list",
      },
    ],
  },
];

export default wards;
