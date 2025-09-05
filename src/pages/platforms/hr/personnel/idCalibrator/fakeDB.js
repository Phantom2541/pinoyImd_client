import Avatar from "../../../../../assets/defaultPF.jpg";
import Signature from "../../../../../assets/templateSampleSignature.png";
import QR from "../../../../../assets/qrCode.png";
import BAR from "../../../../../assets/barCode.png";

export const fakeEMP = {
  front: {
    empID: "PiMD-001",
    img: Avatar,
    emp: "Dr. Juan Dela Cruz jr",
    position: "Administrative Aide I",
    department: "Human Resources",
  },
  back: {
    signature: Signature,
    dob: "Jan. 1, 1990",
    address: "Sta. Mesa, Manila",
    guardian: "Jose Dela Cruz",
    pn: "+63 912 345 6789",
    qr: QR,
    bar: BAR,
  },
  layout: "portrait",
  // cardFront
  cf: "",
  // cardBack
  cb: "",
  // data field position
  dfp: {
    // emp: { x: 3323, y: 143, font: "Arial", size: 12, color: "#000000" },
    // address: { x: 3323, y: 143 },
    // position: { x: 3323, y: 143, size: 12, color: "#000000" },
    // department: { x: 3323, y: 143 },
    // guardian: { x: 3323, y: 143, font: "Arial", size: 12, color: "#000000" },
    // pn: { x: 3323, y: 143, font: "Arial", size: 12, color: "#000000" },
  },
};
