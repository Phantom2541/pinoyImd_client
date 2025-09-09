import {
  Dashboard,
  Appointment,
  Imaging,
  Staffs,
  Applicants,
} from "../../../../pages/platforms/physician";
import Consultations from "../../../../pages/platforms/physician/diagnostics/consultations";
import DailyTasks from "../../../../pages/platforms/physician/diagnostics/tasks";
// import PatientRecords from "../../../pages/platforms/physician/patientRecords";
// import MedicalHistory from "../../../pages/platforms/physician/medicalHistory";
// import Prescription from "../../../pages/platforms/physician/prescription";
// import LabResults from "../../../pages/platforms/physician/labResults";
// import ImagingResults from "../../../pages/platforms/physician/imagingResults";
// import Notifications from "../../../pages/platforms/physician/notifications";
// import Referrals from "../../../pages/platforms/physician/referrals";

const physician = [
  {
    name: "Dashboard",
    icon: "tachometer-alt",
    path: "/bulletin",
    title: "Main physician dashboard overview",
    component: Dashboard,
  },
  {
    name: "Calendar of Activities",
    icon: "calendar-alt",
    path: "/calendar",
    title: "View upcoming checkups, diagnostics, and responsibilities",
  },
  {
    name: "Diagnostics",
    icon: "flask",
    path: "/diagnostics",
    title: "Review diagnostics appointments and interpret results",
    children: [
      {
        name: "Hospital Tasks",
        icon: "weight",
        path: "/daily-tasks",
        title:
          "Diagnostic tasks for in-patients (IPD) admitted in the hospital",
        component: DailyTasks,
      },
      {
        name: "Clinic Appointments",
        icon: "stethoscope",
        path: "/appointments",
        title:
          "Diagnostic appointments for out-patients (OPD) visiting your clinic",
        component: Appointment,
      },
      {
        name: "E H R Timeline",
        icon: "stream",
        path: "/consultations",
        title:
          "Visual health journey of the patient across time, (Electronic Health Record Timeline)",
        component: Consultations,
      },
      {
        name: "Teleconsult",
        icon: "video",
        path: "/teleconsult",
        title: "Conduct virtual consultations with patients",
        component: Imaging,
      },
      // {
      //   name: "Lab Results",
      //   path: "/diagnostics/lab",
      //   icon: "vial",
      //   title: "Access and validate laboratory test results",
      // },
      // {
      //   name: "Imaging Results",
      //   path: "/diagnostics/imaging",
      //   icon: "x-ray",
      //   title: "View and interpret imaging such as X-ray, ECG, UTZ",
      // },
    ],
  },
  // {
  //   name: "Consultation Tools",
  //   icon: "briefcase-medical",
  //   path: "/consultation",
  //   title: "Tools for clinical consultation and documentation",
  //   children: [
  //     {
  //       name: "Progress Notes",
  //       path: "/notes",
  //       icon: "notes-medical",
  //       title: "SOAP notes (Subjective, Objective, Assessment, Plan)",
  //     },
  //     {
  //       name: "Prescriptions",
  //       path: "/prescriptions",
  //       icon: "prescription-bottle-alt",
  //       title: "Create and manage prescriptions for patients",
  //     },
  //     {
  //       name: "Medical Certificates",
  //       path: "/certificates",
  //       icon: "file-medical-alt",
  //       title: "Issue official medical certificates to patients",
  //     },
  //     {
  //       name: "Surgical Clearance",
  //       path: "/surgical/clearance",
  //       icon: "file-signature",
  //       title: "Evaluate and clear patients for surgery",
  //     },
  //     {
  //       name: "Referrals",
  //       icon: "share-square",
  //       path: "/referrals",
  //       title: "Refer patients to another specialist or department",
  //     },
  //   ],
  // },
  // {
  //   name: "Patients",
  //   icon: "user-injured",
  //   path: "/patients",
  //   title: "Access patient medical records and clinical data",
  //   children: [
  //     {
  //       name: "Medical Records",
  //       path: "/records",
  //       icon: "file-medical",
  //       title: "View detailed patient medical records",
  //     },
  //     {
  //       name: "Medical History",
  //       path: "/history",
  //       icon: "history",
  //       title: "Check patient’s previous consultations and diagnostics",
  //     },
  //   ],
  // },
  {
    name: "Secretaries",
    icon: "share-square",
    path: "/Employees",
    title: "View and manage Sectretariat employees",
    children: [
      {
        name: "Staff",
        title: "Active staff directory.",
        path: "/staff",
        icon: "user",
        component: Staffs,
      },
      {
        name: "Applicants",
        title: "Job applicants and interview status.",
        path: "/petitioners",
        icon: "user-plus",
        component: Applicants,
      },
    ],
  },
  {
    name: "Tasks & To-Do",
    icon: "tasks",
    path: "/tasks",
    title: "Checklist of rounds, follow-ups, and pending actions",
  },
  {
    name: "Notifications",
    icon: "bell",
    path: "/notifications",
    title: "Receive reminders and system alerts",
  },
  {
    name: "Analytics & K P Is",
    icon: "chart-line",
    path: "/analytics",
    title:
      "Insights into your consultations, workload, and performance (Key Performance Indicators)",
  },
];

export default physician;
