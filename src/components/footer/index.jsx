import { MDBIcon } from "mdbreact";
import "./style.css";

export default function Copyrights({
  backgroundColor = "#0d4dbc",
  borderColor = "#0b429f",
  fbLink = "",
  linkedinLink = "",
  instaLink = "",
  twitterLink = "",
}) {
  return (
    <div
      className="footer-copyright"
      style={{ backgroundColor: backgroundColor, borderColor: borderColor }}
    >
      <span>
        © 2025 <strong>Pinoy iMD</strong> — Empowering Filipino Healthcare
        through Innovation. All rights reserved.
      </span>
      <div className="footer-socialAccounts">
        <a href={fbLink} target="_blank" rel="noopener noreferrer">
          <MDBIcon fab icon="facebook-square" />
        </a>
        <a href={linkedinLink} target="_blank" rel="noopener noreferrer">
          <MDBIcon fab icon="linkedin" />
        </a>

        <a href={instaLink} target="_blank" rel="noopener noreferrer">
          <MDBIcon fab icon="instagram" />
        </a>
        <a href={twitterLink} target="_blank" rel="noopener noreferrer">
          <MDBIcon fab icon="twitter-square" />
        </a>
      </div>
    </div>
  );
}
