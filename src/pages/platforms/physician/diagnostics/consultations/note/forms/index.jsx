import { MDBCardBody } from "mdbreact";
import Body from "./body";
import usePanelPosition from "../panelPosition";

export default function RequestForm({ active, buttonRefs }) {
  const style = usePanelPosition(active, buttonRefs.request, {
    width: 500,
    height: 700,
  });

  return (
    <div style={style} className="checkup-data-form-container">
      <div className="requestform-card">
        <MDBCardBody>
          <Body />
        </MDBCardBody>
      </div>
    </div>
  );
}
