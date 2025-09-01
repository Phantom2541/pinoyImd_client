const admissions = [
  {
    name: "Dashboard",
    icon: "chart-pie",
    path: "/admissions/dashboard",
  },
  {
    name: "Patient Management",
    icon: "file-medical",
    children: [
      {
        name: "Patient Admission",
        icon: "bed-pulse",
        path: "/admissions/new",
      },
      {
        name: "Admitted Patients",
        icon: "hospital-user",
        path: "/admissions/current",
      },
      {
        name: "Discharges",
        icon: "user-check",
        path: "/admissions/discharges",
      },
      {
        name: "Transfers",
        icon: "person-walking-luggage",
        path: "/admissions/transfers",
      },
    ],
  },
  {
    name: "Reports",
    icon: "file-medical",
    children: [
      {
        name: "Daily Census",
        path: "/admissions/reports/daily-census",
        icon: "calendar-day",
      },
      {
        name: "Monthly Census",
        path: "/admissions/reports/monthly-census",
        icon: "calendar-alt",
      },
      {
        name: "Admission History",
        path: "/admissions/reports/history",
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
        path: "/admissions/settings/rooms",
        icon: "bed",
      },
      {
        name: "Admission Types",
        path: "/admissions/settings/types",
        icon: "list",
      },
    ],
  },
];

export default admissions;
