import { Apply, Documents } from "../../../pages/platforms/patron/application";
import Dashboard from "../../../pages/platforms/patron/dashboard";
import { Diagnostics } from "../../../pages/platforms/patron/emr";
import cardHolder from "../../../pages/platforms/patron/emr/cardHolder";
// import RequestQuery from "../../../pages/platforms/patron/diagnostics/RequestQuery";
// import CheckupRecord from "../../../pages/platforms/patron/emr/CheckupRecord";
// import Appointments from "../../../pages/platforms/patron/appointments/Appointments";

const patron = [
  {
    name: "Dashboard",
    icon: "tachometer-alt",
    path: "/dashboard",
    component: Dashboard,
  },
  {
    name: "Diagnostics",
    path: "/diagnostics",
    icon: "microscope",
    children: [
      {
        name: "Kiosk",
        path: "/Kiosk",
        icon: "file-medical",
        title: "Book Diagnostic Services",
        component: cardHolder,
      },
      {
        name: "Booking",
        path: "/booking",
        title: "Booking history",
        icon: "file-medical",
        component: cardHolder,
      },
      {
        name: "Results",
        path: "/results",
        icon: "flask",
        component: Diagnostics,
      },
    ],
  },
  {
    name: "Clinics",
    path: "/clinics",
    icon: "calendar-check",
    children: [
      {
        name: "Consultations",
        path: "/consultations",
        icon: "calendar-check",
        // component: Appointments,
      },
      {
        name: "Checkup Record",
        path: "/checkup",
        icon: "stethoscope",
        // component: CheckupRecord,
      },
      {
        name: "Medical Certificates",
        path: "/certificates",
        icon: "file-medical-alt",
      },
    ],
  },
  {
    name: "Electronic Medical Records",
    path: "/emr",
    icon: "file-medical",
    children: [
      {
        name: "Admission",
        path: "/admission",
        icon: "notes-medical",
      },
      {
        name: "Medical Records",
        path: "/laboratory",
        icon: "vials",
      },
    ],
  },
  {
    name: "Job Application",
    path: "/application",
    icon: "briefcase",
    children: [
      {
        name: "Companies",
        path: "/companies",
        icon: "building",
        component: Apply,
      },
      {
        name: "Applied",
        path: "/applied",
        icon: "file-alt",
        component: Documents,
      },
    ],
  },
];

export default patron;
