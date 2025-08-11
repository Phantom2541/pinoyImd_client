import { MDBIcon } from "mdbreact";
import "./style.css";

export default function Copyrights({
  backgroundColor = "#0d4dbc",
  borderColor = "#0b429f",
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
        <a
          href="https://www.facebook.com/pinoyimd"
          target="_blank"
          rel="noopener noreferrer"
        >
          <MDBIcon fab icon="facebook-square" />
        </a>
        <a
          href="https://www.facebook.com/pinoyimd"
          target="_blank"
          rel="noopener noreferrer"
        >
          <MDBIcon fab icon="linkedin" />
        </a>
        <a
          href="https://www.facebook.com/pinoyimd"
          target="_blank"
          rel="noopener noreferrer"
        >
          <MDBIcon fab icon="google-plus-square" />
        </a>
        <a
          href="https://www.facebook.com/pinoyimd"
          target="_blank"
          rel="noopener noreferrer"
        >
          <MDBIcon fab icon="instagram" />
        </a>
        <a
          href="https://www.facebook.com/pinoyimd"
          target="_blank"
          rel="noopener noreferrer"
        >
          <MDBIcon fab icon="twitter-square" />
        </a>
      </div>
    </div>
  );
}
