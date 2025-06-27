import Staffs from "../../../pages/platforms/accredetations/staff";
import Temperature from "../../../pages/platforms/accredetations/temperatures";
import Machines from "../../../pages/platforms/accredetations/machines";

const accreditation = [
  {
    name: "Dashboard",
    icon: "tachometer-alt",
    path: "/accreditation/bulletin",
  },
  {
    name: "Laboratory Assessment Tools r2021",
    path: "/laboratory/assessment",
    icon: "cogs",
    children: [
      {
        name: "1. ORGANIZATION and MANAGEMENT",
        path: "/laboratory/organization",
        icon: "cogs",
      },
      {
        name: "2. HUMAN RESOURCES MANAGEMANT",
        path: "/laboratory/manpower",
        component: Staffs,
        icon: "cogs",
      },
      {
        name: "3. PHYSICAL PLANT and ENVIRONMENT MANAGEMENT",
        path: "/laboratory/environment",
        icon: "cogs",
      },
      {
        name: "4. EQUIPMENT, INSTRUMENTS, GLASWARES, REAGENTS and SUPPLIES",
        path: "/laboratory/supplies",
        icon: "cogs",
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
        component: Temperature,
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
