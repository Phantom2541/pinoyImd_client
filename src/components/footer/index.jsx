import { MDBFooter } from "mdbreact";
import "./style.css";

export default function Copyrights() {
  return (
    // <div className="copyright-footer">
    //   © 2025 Pinoy iMD. All rights reserved. Terms of Service | Privacy Policy |
    //   Cookie Settings
    // </div>
    <MDBFooter style={{ zIndex: 2 }}>
      <p className="footer-copyright mb-0 py-3 text-center">
        &copy; 2025 Copyright:&nbsp;
        <a href="https://www.technowiz.com"> TechnoWiz.com </a>
      </p>
    </MDBFooter>
  );
}
