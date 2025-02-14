const accreditation = [
  {
    name: "Dashboard",
    icon: "tachometer-alt",
    path: "/dashboard",
  },
  {
    name: "Laboratory Assessment Tools r2021",
    path: "/laboratory/assessment",
    icon: "cogs",
    children: [
      {
        name: "1. ORGANIZATION and MANAGEMENT",
        path: "/laboratory/organization",
      },
      {
        name: "2. HUMAN RESOURCES MANAGEMANT",
        path: "/laboratory/manpower",
      },
      {
        name: "3. PHYSICAL PLANT and ENVIRONMENT MANAGEMENT",
        path: "/laboratory/environment",
      },
      {
        name: "4. EQUIPMENT, INSTRUMENTS, GLASWARES, REAGENTS and SUPPLIES",
        path: "/laboratory/supplies",
      },
      {
        name: "5. INFORMATION MANAGEMENTS",
        path: "/laboratory/inventory",
      },
      {
        name: "6. POLICIES AND PROCEDURES",
        path: "/laboratory/sop",
      },
      {
        name: "7. Communication and Records",
        path: "/laboratory/logbook",
      },
      {
        name: "8. Quality Assurance Program",
        path: "/laboratory/improvement",
      },
      {
        name: "9. REFERRAL and OUTSOURCING OF LABORATORY EXAMINATIONS",
        path: "/laboratory/sourcing",
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
      },
      {
        name: "2. HUMAN RESOURCES MANAGEMANT",
        path: "/radiology/manpower",
      },
      {
        name: "3. PHYSICAL PLANT and ENVIRONMENT MANAGEMENT",
        path: "/radiology/environment",
      },
      {
        name: "4. EQUIPMENT, INSTRUMENTS, GLASWARES, REAGENTS and SUPPLIES",
        path: "/radiology/supplies",
      },
      {
        name: "5. INFORMATION MANAGEMENTS",
        path: "/radiology/information",
      },
      {
        name: "6. QUALITY IMPROVEMENT ACTIVITIES",
        path: "/radiology/improvement",
      },
      {
        name: "7. REFERRAL and OUTSOURCING OF LABORATORY EXAMINATIONS",
        path: "/radiology/manpower",
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
        path: "/documents/temperature",
      },
      {
        name: "Services Offers",
        path: "/documents/services",
      },
      {
        name: "Employees",
        path: "/documents/employees",
      },
      {
        name: "Quality Control",
        path: "/documents/quality",
      },
      {
        name: "Machines",
        path: "/documents/machines",
      },
      {
        name: "Services Statistics",
        path: "/documents/statistics",
      },
      {
        name: "Reagent Inventory",
        path: "/documents/reagents",
      },
      {
        name: "Preventive Maintenance",
        path: "/documents/maintenance",
      },
    ],
  },
];

export default accreditation;
