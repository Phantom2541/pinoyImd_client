import { MDBFooter } from "mdbreact";

export default function Footer() {
  return (
    <MDBFooter style={{ zIndex: 2 }} className="mt-4">
      <p className="bg-primary mb-0 py-3 text-center ">
        &copy; 2025 Copyright:&nbsp;
        <a href="https://www.technowiz.com"> TechnoWiz.com </a>
      </p>
    </MDBFooter>
  );
}
