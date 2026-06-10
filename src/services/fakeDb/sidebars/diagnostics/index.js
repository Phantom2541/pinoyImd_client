// import patron from "./patron";
import manager from "../administrations/manager";
import accreditation from "../administrations/accreditation";
import admissions from "./admissions";
import accounting from "../finance/accounting";
import carpentry from "../administrations/carpentry";
import cashier from "../finance/cashier";
import clinical from "./clinical";
import frontdesk from "./frontdesk";
import headquarter from "../administrations/headquarter";
import humanresources from "../administrations/hr";
import nutritionist from "./nutritionist";
import pharmacist from "./pharmacist";
import procurement from "./procurement";
import utility from "../administrations/utility";
import diagnostic from "./diagnostic";
import laboratory from "./laboratory";
import radiology from "./radiology";
import physician from "./physician";

const diagnostics = {
  utility,
  procurement,
  pharmacist,
  nutritionist,
  headquarter,
  humanresources,
  frontdesk,
  cashier,
  clinical,
  carpentry,
  admissions,
  accounting,
  accreditation,
  manager,
  // patron,
  diagnostic,
  laboratory,
  radiology,
  physician,
};

export default diagnostics;
