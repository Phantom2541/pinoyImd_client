import Avatar from "../../../../../assets/defaultPF.jpg";
import Signature from "../../../../../assets/templateSampleSignature.png";

export const fakeEMP = {
  front: {
    id: "LIS-001",
    img: Avatar,
    emp: "Dr. Juan R. Dela Cruz Jr",
    position: "Medical Technologist 1",
    department: "Laboratory",
  },
  back: {
    signature: Signature,
    dob: "Dec. 24, 2005",
    address: "Mabini Ext, Cabanatuan City, N.E.",
    guardian: "Maria L. Santos",
    pn: "+63 927 352 6159",
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
