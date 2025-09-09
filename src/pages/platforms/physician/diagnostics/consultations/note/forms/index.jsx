import { MDBCardBody } from "mdbreact";
// import Header from "./header";
import Body from "./body";
// import "./requestForm.css"; // import the css
import usePanelPosition from "../panelPosition";

export default function RequestForm({ active, buttonRefs, zIndex }) {
  const style = usePanelPosition(active, buttonRefs.request, zIndex, {
    width: "auto",
    height: 700,
  });

  return (
    <div style={style} className="checkup-data-form">
      <div className="requestform-card">
        <MDBCardBody>
          <Body />
        </MDBCardBody>
      </div>
    </div>
  );
}
