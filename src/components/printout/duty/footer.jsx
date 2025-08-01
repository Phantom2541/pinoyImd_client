import { Duty } from "../../../services/fakeDb";
import SIGNATURE from "./../../../assets/templateSampleSignature.png";

const Footer = () => {
  return (
    <>
      <div className="template-schedule-legend">
        <span className="template-schedule-legend-title d-block">Legend:</span>
        <div className="legend-grid">
          {Duty.collections.map(({ code, label, time }, index) => (
            <span key={index}>
              <strong>{code}</strong> = {time} {label}
            </span>
          ))}
        </div>
      </div>
      <div className="template-schedule-signatures">
        {[
          {
            name: "Debralene Gay R. Pajarrillaga, RMT",
            title: "Chief Medical Technologist",
          },
          {
            name: "Tomas B. Pajarrillaga Jr., RMT, RN, MSIT",
            title: "Administrator",
          },
          {
            name: "Nick R. Fernandez, MD, FPSP",
            title: "Pathologist",
          },
        ].map((person, idx) => (
          <div key={idx} className="template-schedule-signature-container">
            <span className="template-schedule-signature-checked">
              Checked By:
            </span>

            <div className="template-schedule-signature-info">
              <img src={SIGNATURE} alt="signature" />
              <span> {person.name}</span>
              <em className="text-center">{person.title}</em>
            </div>
          </div>
        ))}
      </div>
    </>
  );
};

export default Footer;
