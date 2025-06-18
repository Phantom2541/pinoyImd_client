import { MDBFooter } from "mdbreact";

export default function Footer() {
  return (
    <MDBFooter style={{ zIndex: 2 }} className="mt-5">
      <p className="footer-copyright mb-0 py-3 text-center">
        &copy; 2025 Copyright:&nbsp;
        <a href="https://www.technowiz.com"> TechnoWiz.com </a>
      </p>
    </MDBFooter>
  );
}
