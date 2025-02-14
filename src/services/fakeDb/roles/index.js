const roles = [
  {
    id: 1,
    name: "patron",
    display_name: "Patron",
  },
  {
    id: 2,
    name: "administrative clerk",
    display_name: "Administrative Clerk",
  },
  {
    id: 3,
    name: "AO", // Manager
    display_name: "Administrator Officer",
    description:
      "Main duties include managing office stock, preparing regular reports (e.g. expenses and office budgets) and organizing company records.",
  },
  {
    id: 4,
    name: "CEO",
    display_name: "Chief Executive Officer",
  },
  {
    id: 5,
    name: "stock holder",
    display_name: "Stock Holder",
  },
  {
    id: 6,
    name: "proprietor",
    display_name: "Proprietor",
  },
  {
    id: 9,
    name: "cashier",
    display_name: "Cashier",
  },
  {
    id: 10,
    name: "admission",
    display_name: "Admission",
  },
  {
    id: 11,
    name: "billing",
    display_name: "Billing",
  },
  {
    id: 12,
    name: "hmo clerk",
    display_name: "HMO Clerk",
  },
  {
    id: 13,
    name: "assistant accountant",
    display_name: "Assistant Accountant",
  },
  {
    id: 14,
    name: "accountant",
    display_name: "Accountant",
  },

  {
    id: 15,
    name: "chief accountant",
    display_name: "Chief Accountant",
  },
  {
    id: 16,
    name: "payroll",
    display_name: "Payroll",
  },
  {
    id: 17,
    name: "procurement clerk",
    display_name: "Procurement Clerk",
  },
  {
    id: 18,
    name: "procurement officer",
    display_name: "Procurement Officer",
  },
  {
    id: 19,
    name: "procurement manager",
    display_name: "Procurement Manager",
  },
  {
    id: 20,
    name: "hr clerk",
    display_name: "Human Resource Clerk",
  },
  {
    id: 21,
    name: "hr",
    display_name: "Human Resource",
  },
  {
    id: 22,
    name: "HR MANAGER",
    display_name: "Human Resource Manager",
  },
  {
    id: 23,
    name: "frontdesk",
    display_name: "Front Desk",
  },
  {
    id: 24,
    name: "phlebotomist",
    display_name: "Phlebotomist",
  },
  {
    id: 25,
    name: "labtech",
    display_name: "Laboratory Technician",
  },
  {
    id: 26,
    name: "scientist",
    display_name: "Medical Laboratory Scientist",
  },
  {
    id: 27,
    name: "chief mls",
    display_name: "Chief MLS",
  },
  {
    id: 28,
    name: "patho",
    display_name: "Pathologist",
  },
  {
    id: 29,
    name: "chief patho",
    display_name: "Chief Pathologist",
  },
  {
    id: 30,
    name: "ass tech",
    display_name: "Assistant Technology",
  },
  {
    id: 31,
    name: "sonographer",
    display_name: "Sonographer",
  },
  {
    id: 32,
    name: "radtech",
    display_name: "Radiation Technology",
  },
  {
    id: 33,
    name: "radiologist",
    display_name: "Radiologist",
  },
  {
    id: 34,
    name: "chief radio",
    display_name: "Chief Radiologist",
  },
  {
    id: 35,
    name: "midwife",
    display_name: "Midwife",
  },
  {
    id: 36,
    name: "nurse aide",
    display_name: "Nursing Aide",
  },
  {
    id: 37,
    name: "nurse",
    display_name: "Nurse",
  },
  {
    id: 38,
    name: "head nurse",
    display_name: "Head Nurse",
  },
  {
    id: 39,
    name: "nurse supervisor",
    display_name: "Nurse Supervisor",
  },
  {
    id: 40,
    name: "chief nurse",
    display_name: "Chief Nurse",
  },
  {
    id: 41,
    name: "pharmacy assistant",
    display_name: "Pharmacy Assistant",
  },
  {
    id: 42,
    name: "pharmacist",
    display_name: "Pharmacist",
  },
  {
    id: 43,
    name: "head pharmacist",
    display_name: "Head Pharmacist",
  },
  {
    id: 44,
    name: "therapist assistant",
    display_name: "Therapist Assistant",
  },
  {
    id: 45,
    name: "therapist",
    display_name: "Therapist",
  },
  {
    id: 46,
    name: "head therapist",
    display_name: "Head Therapist",
  },
  {
    id: 47,
    name: "chief therapist",
    display_name: "Chief Therapist",
  },
  {
    id: 48,
    name: "assistant social worker",
    display_name: "Assistant Social Worker",
  },
  {
    id: 49,
    name: "social worker",
    display_name: "Social Worker",
  },
  {
    id: 50,
    name: "head social worker",
    display_name: "Head Social Worker",
  },
  {
    id: 51,
    name: "chief social worker",
    display_name: "Chief Social Worker",
  },
  {
    id: 52,
    name: "phic clerk",
    display_name: "PHIC Clerk",
  },
  {
    id: 53,
    name: "phic officer",
    display_name: "PHIC Officer",
  },
  {
    id: 54,
    name: "head phic",
    display_name: "Head PHIC",
  },
  {
    id: 55,
    name: "kitchen aide",
    display_name: "Kitchen Aide",
  },
  {
    id: 56,
    name: "cook assistant",
    display_name: "Cook Assistant",
  },
  {
    id: 57,
    name: "cook",
    display_name: "Cook",
  },
  {
    id: 58,
    name: "head cook",
    display_name: "Head Cook",
  },
  {
    id: 59,
    name: "dietician",
    display_name: "Dietician",
  },
  {
    id: 60,
    name: "head dietician",
    display_name: "Head Dietician",
  },
  {
    id: 61,
    name: "utility",
    display_name: "Utility",
  },
  {
    id: 62,
    name: "utility head",
    display_name: "Utility Head",
  },
  {
    id: 63,
    name: "guard",
    display_name: "Guard",
  },
  {
    id: 64,
    name: "driver",
    display_name: "Driver",
  },
  {
    id: 65,
    name: "auxillary supervisor",
    display_name: "Auxillary Supervisor",
  },
  {
    id: 66,
    name: "chief auxillary",
    display_name: "Chief Auxillary",
  },
];
export default roles;
