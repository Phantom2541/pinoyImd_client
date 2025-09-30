import { QRCodeSVG, QRCodeCanvas } from "qrcode.react";
// import logo from "../../assets/iMD.png";
/**
 * Generates a QR code with the given value and size.
 *
 * @param {Object} props The component props.
 * @param {string} [props.value=""] The value to encode in the QR code example value = "https://pinoyimd.com/emr/portal".
 * @param {number} [props.size=100] The size of the QR code in number.
 * @return {ReactElement} A {@link QRCodeCanvas} component with the given value and size.
 */
// const QrCodeGenerator = ({ value = "", size = 100 }) => {
//   return (
//     <div
//       className="my-2"
//       style={{
//         width: "fit-content",
//         border: "1px solid black",
//         padding: "5px",
//         margin: "auto",
//       }}
//     >
//       <QRCodeSVG
//         value={value}
//         size={size}
//         level="H"
//         imageSettings={{
//           src: logo,
//           height: size * 0.22,
//           width: size * 0.22,
//           excavate: true,
//         }}
//       />
//     </div>
//   );
// };

// export default QrCodeGenerator;

const QrCodeGenerator = ({ value = "", size = 100 }) => {
  return (
    <div
      className="my-2"
      style={{
        width: "fit-content",
        border: "1px solid black",
        padding: "5px",
        margin: "auto",
      }}
    >
      <QRCodeCanvas
        value={value}
        size={size}
        level="H" // high error correction
      />
    </div>
  );
};

export default QrCodeGenerator;
