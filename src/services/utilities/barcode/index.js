import { Templates } from "../../fakeDb";
import capitalize from "../capitalize";

const sanitize = (str) =>
  str
    .normalize("NFD")
    .replace(/[\u0300-\u036f]/g, "")
    .replace(/[^A-Z0-9 \-.$/+%]/gi, "")
    .toUpperCase();

const formattedValue = (
  section,
  customer,
  patientNo,
  MAX_LENGTH = 16,
  isLabel = false
) => {
  const abbr = Templates.getAbbr(section);
  const pn = String(patientNo).padStart(2, "0");
  const { fullName = {} } = customer;
  let { fname = "", lname = "" } = fullName || {};

  fname = capitalize(sanitize(fname));
  lname = capitalize(sanitize(lname));

  let full = `${abbr}-${lname}${isLabel && ", "}${fname}-${pn}`;

  if (full.length > MAX_LENGTH) {
    const excess = full.length - MAX_LENGTH;

    // Try to cut from lname first
    const lnameCut = Math.min(excess, lname.length);
    lname = lname.slice(0, lname.length - lnameCut);

    // Rebuild
    full = `${abbr}-${lname}${isLabel && ", "}${fname}-${pn}`;

    // Cut from fname if needed
    const newExcess = full.length - MAX_LENGTH;
    if (newExcess > 0) {
      const fnameCut = Math.min(newExcess, fname.length);
      fname = fname.slice(0, fname.length - fnameCut);
      full = `${abbr}-${lname}${isLabel && ", "}${fname}-${pn}`;
    }
  }
  return full.toUpperCase();
};

const barcode = {
  getValue: (section, customer, patientNo) =>
    formattedValue(section, customer, patientNo, 16),
  getLabel: (section, customer, patientNo) =>
    formattedValue(section, customer, patientNo, 34, true),
};

export default barcode;
