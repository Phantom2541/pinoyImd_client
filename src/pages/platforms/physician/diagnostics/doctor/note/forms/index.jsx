import React from "react";
import { MDBAnimation, MDBCardBody } from "mdbreact";
import Header from "./header";
import Body from "./body";
import "./requestForm.css"; // import the css
import usePanelPosition from "./panelPosition";

export default function RequestForm({ active, buttonRefs, zIndex }) {
  const style = usePanelPosition(active, buttonRefs.request, zIndex);

  console.log("style", style);

  return (
    <div
      style={{
        display: "flex",
        justifyContent: "center", // horizontal center
        alignItems: "center", // vertical center
        minHeight: "100vh", // take full screen height
      }}
    >
      <MDBAnimation type="bounceInDown">
        <Header />
        <div className="requestform-card">
          <MDBCardBody>
            <Body />
          </MDBCardBody>
        </div>
      </MDBAnimation>
    </div>
  );
}
