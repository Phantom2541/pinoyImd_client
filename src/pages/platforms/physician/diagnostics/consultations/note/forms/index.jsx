import { MDBCardBody, MDBIcon } from "mdbreact";
import Header from "./header";
import Body from "./body";

import usePanelPosition from "../panelPosition";
import "./requestForm.css";

export default function RequestForm({ active, buttonRefs, togglePanel }) {
  const style = usePanelPosition(active, buttonRefs.request, {
    width: 507,
    height: 600,
  });

  return (
    <div style={style} className="checkup-data-form-container">
      <MDBIcon
        icon="times"
        className="checkup-data-note-close"
        onClick={() => togglePanel("request")}
      />
      <div
        style={{
          width: "100%",
          height: "100%",
          maxHeight: "600px",
          overflow: "auto",
        }}
      >
        <div className="checkup-data-requestform-card">
          <MDBCardBody>
            <div style={{ fontFamily: "Arial, sans-serif" }}>
              <div className="laboratoryRequestForm-grid d-flex justify-content-center align-items-center">
                <table className="laboratoryRequestForm-printout-table">
                  <Header />
                  <Body togglePanel={togglePanel} />
                </table>
              </div>
            </div>
          </MDBCardBody>
        </div>
      </div>
    </div>
  );
}
