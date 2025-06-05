// import Dashboard from "../../../pages/platforms/physician/dashboard";
// import Appointments from "../../../pages/platforms/physician/appointments";
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
    path: "/physician/dashboard",
    // component: Dashboard,
  },
  {
    name: "My Appointments",
    icon: "calendar-check",
    path: "/physician/appointments",
    // component: Appointments,
  },
  {
    name: "Patients",
    icon: "user-injured",
    path: "/physician/patients",
    children: [
      {
        name: "Medical Records",
        path: "/physician/patients/records",
        icon: "file-medical",
        // component: PatientRecords,
      },
      {
        name: "Medical History",
        path: "/physician/patients/history",
        icon: "history",
        // component: MedicalHistory,
      },
    ],
  },
  //   {
  //     name: "Diagnostics",
  //     icon: "flask",
  //     path: "/physician/diagnostics",
  //     children: [
  //       {
  //         name: "Lab Results",
  //         path: "/physician/diagnostics/lab",
  //         icon: "vial",
  //         component: LabResults,
  //       },
  //       {
  //         name: "Imaging",
  //         path: "/physician/diagnostics/imaging",
  //         icon: "x-ray",
  //         component: ImagingResults,
  //       },
  //     ],
  //   },
  {
    name: "Diagnostics Requests",
    icon: "stethoscope",
    path: "/physician/diagnostics",
    // component: Requests,
  },
  {
    name: "Prescriptions",
    icon: "prescription-bottle-alt",
    path: "/physician/prescriptions",
    // component: Prescription,
  },
  // using SOAP format (Subjective, Objective, Assessment, Plan).
  {
    name: "Progress Notes",
    icon: "notes-medical",
    path: "/physician/notes",
    // component: ProgressNotes,
  },
  {
    name: "Referrals",
    icon: "share-square",
    path: "/physician/referrals",
    // component: Referrals,
  },
  {
    name: "Surgical Clearance",
    icon: "file-signature",
    path: "/physician/surgical/clearance",
    // component: SurgicalClearance,
  },
  {
    name: "Medical Certificates",
    icon: "file-medical-alt",
    path: "/physician/certificates",
    // component: MedicalCertificates,
  },
  {
    name: "Notifications",
    icon: "bell",
    path: "/physician/notifications",
    // component: Notifications,
  },
];

export default physician;
