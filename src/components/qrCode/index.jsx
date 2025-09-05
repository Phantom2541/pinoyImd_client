import { QRCodeCanvas } from "qrcode.react";

/**
 * Generates a QR code with the given value and size.
 *
 * @param {Object} props The component props.
 * @param {string} [props.value=""] The value to encode in the QR code example value = "https://pinoyimd.com/emr/portal".
 * @param {number} [props.size=100] The size of the QR code in number.
 * @return {ReactElement} A {@link QRCodeCanvas} component with the given value and size.
 */
const QrCodeGenerator = ({ value = "", size = 100 }) => {
  return <QRCodeCanvas value={value} size={size} />;
};

export default QrCodeGenerator;
