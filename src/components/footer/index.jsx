import { MDBIcon } from "mdbreact";
import "./style.css";
import { useEffect, useState } from "react";

export default function Copyrights({
  backgroundColor = "#0d4dbc",
  borderColor = "#0b429f",
  fbLink = "https://web.facebook.com/profile.php?id=61579153924730",
  liLink = "",
  igLink = "",
  xLink = "",
}) {
  const [company, setCompany] = useState({});
  const { media = {} } = company || {},
    { fb, ig, li, x } = media || {};

  useEffect(() => {
    setCompany(JSON.parse(localStorage.getItem("patronCompany")));
  }, [setCompany]);

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
        <a href={fb || fbLink} target="_blank" rel="noopener noreferrer">
          <MDBIcon fab icon="facebook-square" />
        </a>
        <a href={li || liLink} target="_blank" rel="noopener noreferrer">
          <MDBIcon fab icon="linkedin" />
        </a>

        <a href={ig || igLink} target="_blank" rel="noopener noreferrer">
          <MDBIcon fab icon="instagram" />
        </a>
        <a href={x || xLink} target="_blank" rel="noopener noreferrer">
          <MDBIcon fab icon="twitter-square" />
        </a>
      </div>
    </div>
  );
}
