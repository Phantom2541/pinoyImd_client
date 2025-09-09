import "./style.css";
import XRAY from "./../../../assets/x-ray sample.jpg";

import ImgMagnifier from "./imgMagnifier";

export default function ParentComponent({ src = "" }) {
  return (
    <div className="template-x-ray-section">
      <ImgMagnifier src={src || XRAY} />
    </div>
  );
}
