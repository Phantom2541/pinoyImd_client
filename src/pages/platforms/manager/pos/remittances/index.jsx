import React from "react";
import Calendar from "./calendar";
import Expenses from "./expenses";
import RemmitanceForm from "./form";
import { MDBCol, MDBRow } from "mdbreact";

export default function Remmitances() {
  return (
    <div className="d-flex">
      <div style={{ width: "300px" }}>
        <Calendar />
        <Expenses />
      </div>
      <div className="bg-white py-1 rounded flex-1 ml-2 px-2">
        <MDBRow className="w-100 mx-auto">
          <MDBCol className="px-1">
            <RemmitanceForm title="opening" />
          </MDBCol>
          <MDBCol className="px-1">
            <RemmitanceForm title="closing" />
          </MDBCol>
        </MDBRow>
      </div>
    </div>
  );
}
