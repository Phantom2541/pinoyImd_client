import { useSelector } from "react-redux";
import LOGO from "./../../../../../../../assets/iMD.png";
import {
  capitalize,
  Cloudinary,
  contacts,
} from "../../../../../../../services/utilities";

export default function Header() {
  const { auth, activePlatform } = useSelector(({ auth }) => auth);
  const { fullName = {}, mobile, email } = auth;
  const { fname, lname, postnominal = "" } = fullName;

  const logoURL =
    `${Cloudinary.getEndpoint()}/companies/${
      activePlatform.branch.companyId.name
    }/logo` || "";

  return (
    <div className="checkup-data-prescription-card-header">
      <img
        alt="logo"
        src={logoURL || LOGO}
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
          <span>{contacts(mobile)}</span>
          <span>{email}</span>
          <span>www.PinoyiMD.com</span>
        </div>
      </div>
    </div>
  );
}
