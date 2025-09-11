import { MDBCardBody, MDBIcon } from "mdbreact";
import Body from "./body";
import usePanelPosition from "../panelPosition";
import "./requestForm.css";

export default function RequestForm({ active, buttonRefs, togglePanel }) {
  const style = usePanelPosition(active, buttonRefs.request, {
    width: 507,
    height: 700,
  });

  return (
    <div style={style} className="checkup-data-form-container">
      <MDBIcon
        icon="times"
        className="checkup-data-note-close"
        onClick={() => togglePanel("")}
      />
      <div
        style={{
          width: "100%",
          height: "100%",
          maxHeight: "700px",
          overflow: "auto",
        }}
      >
        <div className="checkup-data-requestform-card">
          <MDBCardBody>
            <Body />
          </MDBCardBody>
        </div>
      </div>
    </div>
  );
}
