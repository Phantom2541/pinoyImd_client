import {
  Staffs,
  qualityControls,
  Temperatures,
  Machines,
  HandlingComplaint,
  MissionVision,
  PlantEnvironment,
  LicenseOperate,
  policyManagement,
  EquipmentSupplies,
} from "../../../pages/platforms/accredetations/index";

const accreditation = [
  {
    name: "Dashboard",
    icon: "tachometer-alt",
    path: "/accreditation/bulletin",
  },
  {
    name: "Laboratory Assessment Tools (A.O. 2021-0037)",
    path: "/laboratory/assessment",
    title: "DOH Order No. 2021-0037",
    icon: "cogs",
    children: [
      {
        name: "1. ORGANIZATION and MANAGEMENT",
        path: "/laboratory/organization",
        title:
          " The organizations management team provides leadership acts according to the organization’s policies and has overall reaponsibility in ensuring effective and efficient operation of the organization (clinical laboratory).",
        icon: "cogs",
        children: [
          {
            name: "1.Organizational Structure",
            path: "/organizational",
            title:
              "Updated organizational  is posted/displayed in conspincoius area with the names, latest pictures (atleast passport size) and designation",
            icon: "cogs",
          },
          {
            name: "2. Organization's Mission, Vision and Objectives",
            path: "/mission",
            title:
              "Wriyyen Vision, Mission and Objectives posted in conspicious area visible to clients",
            icon: "cogs",
            component: MissionVision,
          },
          {
            name: "3. valid D O H - L T O",
            path: "/doh-lto",
            title:
              "valid DOH-LTO, Valid DOH-LTO posted in conspicious area visible to clients",
            icon: "cogs",
            component: LicenseOperate,
          },
          {
            name: "4. Policy and Procedure ",
            path: "/policymanagement",
            title:
              "i. Written policy on management review\n ii. Compilation of documented minutes of meeting reflecting the date, time, attendance, agenda, and action taken signed and approved by the head of the laboratory\n iii. Supporting documents of evaluation and monitoring for activities such as records, logbook, checklist of supplies, inspection report, purchasing or procurement, and acceptance of supplies, etc.",
            icon: "cogs",
            component: policyManagement,
          },
          {
            name: "5. procedure for handling complaint",
            path: "/procedure",
            title:
              "Written policy and proceduresfor handling complaints/clients feedback\n Suggestion box visible to clients\n Forms for complaints/clients feedback\n Records of complaints/client feedbackand action takens",
            icon: "cogs",
            component: HandlingComplaint,
          },
        ],
      },
      {
        name: "2. HUMAN RESOURCES MANAGEMENT",
        path: "/laboratory/manpower",
        icon: "cogs",
        children: [
          {
            name: "A. Staff Recruitment, Selection, Appointment and Responsibilities",
            path: "/human-resources",
            title:
              "Updated organizational chart is posted/displayed in a conspicuous area with the names, latest pictures (at least passport size), and designations.",
            icon: "cogs",
            children: [
              {
                name: "6. Policy on Hiring, Orientation, Training and Promotions",
                path: "/policy",
                title:
                  "Written policy and procedures on hiring, orientation and promotion of personnel at all levels.",
                icon: "cogs",
                component: Staffs,
              },
              {
                name: "7. Policy and Procedure on Continuing Program for Staff Development and Training",
                path: "/laboratory/attendance",
                icon: "cogs",
                title:
                  "Written policies and procedures for staff development and training.\nProof of training.",
              },
              {
                name: "8. Policy and Procedure for Discipline, Suspension, Demotion and Termination",
                path: "/laboratory/disciplinary",
                icon: "cogs",
                title:
                  "Written policies and procedures for disciplinary action, suspension, demotion, and termination of personnel at all levels.",
              },
            ],
          },
          {
            name: "B. Personnel",
            path: "/faculties",
            icon: "users-round",
            title: "Human resource and employee management",
            children: [
              {
                name: "9. Duties and Responsibilities shall be clearly stated",
                path: "/duties",
                title:
                  "Written job description or duties and responsibilities of all laboratory personnel",
              },
              {
                name: "10. Adequate number of qualified personnel",
                path: "/laboratory/attendance",
                icon: "cogs",
                title:
                  "List of Personnel with designation \n Area of assignments indicated in the posted work schedule",
              },
              {
                name: "11. There is policy on the emplementation of National Database of human resource",
                path: "/staff",
                icon: "user",
                title: "Proof of submission data to NDHRHIS ",
                component: Staffs,
              },
              {
                name: "12. Each personnel shall have a record of updated 201 files",
                path: "/petitioners",
                icon: "user-plus",
                title: "Updated 201 files of all laboratory personnel",
                // component: Applicants,
                children: [
                  {
                    name: "12.A. The head of the laboratory shall have the overall supervision on technical procedures",
                    path: "/petitioners",
                    icon: "user-plus",
                    title: "Updated 201 files of all laboratory personnel",
                    // component: Applicants,
                  },
                  {
                    name: "12.B. Registered Medical Technologist (RMT)",
                    path: "/petitioners",
                    icon: "user-plus",
                    title: "Proof of Qualification as RMT",
                    // component: Applicants,
                  },
                  {
                    name: "12.C. Biosafety and biosecurity officer",
                    path: "/petitioners",
                    icon: "user-plus",
                    title: "PRC certificate and valid PRC ID (RMT)",
                    // component: Applicants,
                  },
                ],
              },
              {
                name: "13. There is policy on the emplementation of National Database of human resource",
                path: "/signatories",
                icon: "pen",
                title: "Proof of submission data to NDHRHIS ",
                // component: Heads,
              },
            ],
          },
        ],
      },
      {
        name: "3. PHYSICAL PLANT and ENVIRONMENT MANAGEMENT",
        path: "/laboratory/environment",
        icon: "cogs",
        component: PlantEnvironment,
      },
      {
        name: "4. Lab Equipment & Supplies ",
        path: "/laboratory/supplies",
        icon: "cogs",
        title: "Keeping Track of Lab Tools, Reagents, and Supplies",
        component: EquipmentSupplies,
      },
      {
        name: "5. INFORMATION MANAGEMENTS",
        path: "/laboratory/inventory",
        icon: "cogs",
      },
      {
        name: "6. POLICIES AND PROCEDURES",
        path: "/laboratory/sop",
        icon: "cogs",
      },
      {
        name: "7. Communication and Records",
        path: "/laboratory/logbook",
      },
      {
        name: "8. Quality Assurance Program",
        path: "/laboratory/improvement",
        icon: "cogs",
      },
      {
        name: "9. REFERRAL and OUTSOURCING OF LABORATORY EXAMINATIONS",
        path: "/laboratory/sourcing",
        icon: "cogs",
      },
    ],
  },
  {
    name: "Radiology Assessment Tools",
    path: "/radiology/assessment",
    icon: "cogs",
    children: [
      {
        name: "1. ORGANIZATION and MANAGEMENT",
        path: "/radiology/organization",
        icon: "cogs",
      },
      {
        name: "2. HUMAN RESOURCES MANAGEMANT",
        path: "/radiology/manpower",
        icon: "cogs",
      },
      {
        name: "3. PHYSICAL PLANT and ENVIRONMENT MANAGEMENT",
        path: "/radiology/environment",
        icon: "cogs",
      },
      {
        name: "4. EQUIPMENT, INSTRUMENTS, GLASWARES, REAGENTS and SUPPLIES",
        path: "/radiology/supplies",
        icon: "cogs",
      },
      {
        name: "5. INFORMATION MANAGEMENTS",
        path: "/radiology/information",
        icon: "cogs",
      },
      {
        name: "6. QUALITY IMPROVEMENT ACTIVITIES",
        path: "/radiology/improvement",
        icon: "cogs",
      },
      {
        name: "7. REFERRAL and OUTSOURCING OF LABORATORY EXAMINATIONS",
        path: "/radiology/manpower",
        icon: "cogs",
      },
    ],
  },
  {
    name: "Documents",
    path: "/documents",
    icon: "cogs",
    children: [
      {
        name: "Temperature",
        path: "/temperature",
        component: Temperatures,
        icon: "cogs",
      },
      {
        name: "Services Offers",
        path: "/documents/services",
        icon: "cogs",
      },
      {
        name: "Quality Control",
        path: "/documents/quality",
        component: qualityControls,
        icon: "cogs",
      },
      {
        name: "Machines",
        path: "/documents/machines",
        icon: "cogs",
        component: Machines,
      },
      {
        name: "Services Statistics",
        path: "/documents/statistics",
        icon: "cogs",
      },
      {
        name: "Reagent Inventory",
        path: "/documents/reagents",
        icon: "cogs",
      },
      {
        name: "Preventive Maintenance",
        path: "/documents/maintenance",
        icon: "cogs",
      },
    ],
  },
];

export default accreditation;
