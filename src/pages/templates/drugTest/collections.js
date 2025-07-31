// collections.js

import Profile from "./../../../assets/male.jpg";
import Logo from "./../../../assets/iMD.png";
import Signature from "./../../../assets/templateSampleSignature.png";

export const drugTestData = {
  reportId: "DTO-R03",
  profile: {
    image: Profile,
    code: "UK92295646",
  },
  departmentInfo: {
    agency: "DEPARTMENT OF HEALTH",
    institution: "DR. PAULINO J GARCIA MEMORIAL RESEARCH AND MEDICAL CENTER",
    address: "MABINI ST., QUEZON DISTRICT(POB), CABANATUAN CITY, NUEVA ECJIA",
    phone: "Phone Number 044 4638888",
    reportTitle: "DRUG TEST REPORT",
    logo: Logo,
  },
  personalInfo: {
    ccfNo: "201904010013",
    name: "REYES, Emedita LANGUIDO",
    birthDate: "03/29/1956",
    age: 63,
    isMale: false,
    testMethod: "TEST KIT",
    purpose: "Requesting Parties",
    others: "PERSONAL REFERENCE",
  },
  timestamps: {
    transaction: "4/1/2019   2:10:00PM",
    report: "5/17/2019   4:20:18PM",
  },
  results: [
    { drug: "METHAMPHETAMINE", result: "NEGATIVE", remarks: "" },
    { drug: "TETRAHYDROCANNABINOL", result: "NEGATIVE", remarks: "" },
  ],
  conductedBy: {
    name: "Richard Macdon Valencia",
    role: "Analyst",
    signature: Signature,
  },
  approvedBy: {
    name: "Dr. John Dennis G. Macapagal",
    role: "Head of Laboratory",
    signature: Signature,
  },
  validityNote: "Valid Within 12 Month's from Transuction Date",
  notice: "This is a DOH-DDB IDTOMIS generated report",
};
