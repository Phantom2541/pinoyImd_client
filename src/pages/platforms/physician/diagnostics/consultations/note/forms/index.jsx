import { MDBCardBody } from "mdbreact";
import Body from "./body";
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
