import React from "react";
import { MDBCol } from "mdbreact";
const types = ["A", "B", "O", "AB"];
export default function BloodTyping({ task, fontSize }) {
  const { results } = task;
  const aboType = types[results?.bt];
  return (
    <div className="pl-5 offset-1" style={{ fontSize: `${fontSize}rem` }}>
      <MDBCol>
        <h6>BLOOD TYPING :</h6>
        <div className="mb-3">
          <MDBCol size="11" className="offset-1">
            FORWARD :&nbsp;
            <strong>
              <b>"{aboType}"</b>
            </strong>
          </MDBCol>
          <MDBCol size="11" className="offset-1">
            REVERSE :&nbsp;
            <strong>
              <b>"{aboType}"</b>
            </strong>
          </MDBCol>
        </div>
        <div>
          <MDBCol size="11" className="offset-1">
            RH :&nbsp;
            <b style={{ color: results?.rh ? "red" : "black" }}>
              {results?.rh ? "POSITIVE" : "NEGATIVE"}
            </b>
          </MDBCol>
        </div>
      </MDBCol>
    </div>
  );
}
