import LOGO from "../../../../assets/iMD.png";
import { capitalize } from "../../../../services/utilities";

export default function Header({ note }) {
  const { physician = {} } = note;
  const { fullName = {} } = physician;
  const { fname, lname, postnominal = "" } = fullName;
  return (
    <div className="checkup-data-prescription-card-header">
      <img
        alt="logo"
        src={LOGO}
        className="checkup-data-prescription-card-logo"
      />
      <div className="checkup-data-prescription-card-info">
        <div className="checkup-data-prescrption-card-fullname">
          <span>
            Dr. {capitalize(fname)} {capitalize(lname)}
          </span>
          <small>{postnominal}</small>
        </div>
        <div className="checkup-data-prescription-card-contact">
          <span>+63 927 342 2159</span>
          <span>sample@gmail.com</span>
          <span>www.PinoyiMD.com</span>
        </div>
      </div>
    </div>
  );
}
