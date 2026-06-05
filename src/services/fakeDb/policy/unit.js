const units = {
  Clinical: [
    { id: 1, code: "ER", name: "Emergency Room" },
    { id: 2, code: "TRI", name: "Triage" },
    { id: 3, code: "OPD", name: "Outpatient Department" },
    { id: 4, code: "IM", name: "Internal Medicine" },
    { id: 5, code: "PED", name: "Pediatrics" },
    { id: 6, code: "OBG", name: "Obstetrics & Gynecology" },
    { id: 7, code: "SUR", name: "Surgery" },
    { id: 8, code: "ENT", name: "ENT Clinic" },
    { id: 9, code: "ORT", name: "Orthopedics" },
    { id: 10, code: "DER", name: "Dermatology" },
  ],

  Nursing: [
    { id: 31, code: "PVT", name: "Private Ward" },
    { id: 32, code: "PUB", name: "Public Ward" },
    { id: 33, code: "ICU", name: "Intensive Care Unit" },
    { id: 34, code: "NICU", name: "Neonatal Intensive Care Unit" },
    { id: 35, code: "PICU", name: "Pediatric Intensive Care Unit" },
    { id: 36, code: "OR", name: "Operating Room" },
    { id: 37, code: "DR", name: "Delivery Room" },
    { id: 38, code: "RR", name: "Recovery Room" },
    { id: 39, code: "ISO", name: "Isolation Ward" },
    { id: 40, code: "DIA", name: "Dialysis Unit" },
  ],

  Laboratory: [
    { id: 61, code: "HEM", name: "Hematology" },
    { id: 62, code: "CCH", name: "Clinical Chemistry" },
    { id: 63, code: "MIC", name: "Microbiology" },
    { id: 64, code: "SER", name: "Serology" },
    { id: 65, code: "BBK", name: "Blood Bank" },
    { id: 66, code: "PAT", name: "Pathology" },
    { id: 67, code: "MOL", name: "Molecular Laboratory" },
  ],

  Radiology: [
    { id: 91, code: "XR", name: "X-Ray Room" },
    { id: 92, code: "CTS", name: "CT Scan Room" },
    { id: 93, code: "MRI", name: "MRI Room" },
    { id: 94, code: "UTZ", name: "Ultrasound Room" },
    { id: 95, code: "MAM", name: "Mammography" },
  ],

  Pharmacy: [
    { id: 121, code: "IPRX", name: "Inpatient Pharmacy" },
    { id: 122, code: "OPRX", name: "Outpatient Pharmacy" },
    { id: 123, code: "SAT", name: "Satellite Pharmacy" },
  ],

  Rehabilitation: [
    { id: 151, code: "PTR", name: "Physical Therapy" },
    { id: 152, code: "OTR", name: "Occupational Therapy" },
    { id: 153, code: "SPT", name: "Speech Therapy" },
  ],

  Accounting: [
    { id: 181, code: "CSH", name: "Cashier Area" },
    { id: 182, code: "BIL", name: "Billing Section" },
    { id: 183, code: "ADM", name: "Admission Section" },
    { id: 184, code: "COL", name: "Collections Office" },
  ],

  HumanResource: [
    { id: 211, code: "HRO", name: "Human Resources Office" },
    { id: 212, code: "TRN", name: "Training Department" },
  ],

  Procurement: [
    { id: 241, code: "PRO", name: "Procurement Office" },
    { id: 242, code: "WHS", name: "Warehouse" },
    { id: 243, code: "SUP", name: "Supply Room" },
  ],

  Dietary: [
    { id: 271, code: "KIT", name: "Main Kitchen" },
    { id: 272, code: "DTO", name: "Dietary Office" },
    { id: 273, code: "FDS", name: "Food Service Area" },
  ],

  Security: [
    { id: 301, code: "MGT", name: "Main Gate" },
    { id: 302, code: "EGT", name: "Emergency Gate" },
    { id: 303, code: "PRK", name: "Parking Area" },
    { id: 304, code: "CCTV", name: "CCTV Monitoring Room" },
    { id: 305, code: "SEC", name: "Security Office" },
  ],

  Administration: [
    { id: 331, code: "ADO", name: "Administration Office" },
    { id: 332, code: "EXO", name: "Executive Office" },
    { id: 333, code: "QAO", name: "Quality Assurance Office" },
  ],

  MedicalRecords: [
    { id: 361, code: "MRD", name: "Medical Records Department" },
  ],

  InformationTechnology: [
    { id: 391, code: "ITS", name: "IT Support Office" },
    { id: 392, code: "NOC", name: "Network Operations Center" },
  ],

  Housekeeping: [{ id: 421, code: "HKP", name: "Housekeeping Department" }],

  Engineering: [
    { id: 451, code: "ENG", name: "Engineering Department" },
    { id: 452, code: "MNT", name: "Maintenance Workshop" },
    { id: 453, code: "GEN", name: "Generator Room" },
  ],

  Transport: [{ id: 481, code: "AMB", name: "Ambulance Bay" }],

  InfectionControl: [
    { id: 511, code: "ICO", name: "Infection Control Office" },
  ],

  SocialServices: [{ id: 541, code: "MSS", name: "Medical Social Services" }],

  SupportServices: [
    { id: 571, code: "MOR", name: "Mortuary" },
    { id: 572, code: "CHP", name: "Chaplaincy Office" },
  ],

  Education: [{ id: 601, code: "EDU", name: "Education & Training Center" }],
};

export default units;
