import { QRCodeCanvas } from "qrcode.react";

const QrCodeGenerator = ({ value = "", size = 100 }) => {
  //value = "https://pinoyimd.com";
  //size = 100;
  return <QRCodeCanvas value={value} size={size} />;
};

export default QrCodeGenerator;
