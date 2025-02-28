import React from "react";
import {
  capitalize,
  fullName,
  Banner,
} from "../../../../../../services/utilities";
import Months from "../../../../../../services/fakeDb/calendar/months";
import { Roles } from "../../../../../../services/fakeDb";
import { MDBAlert } from "mdbreact";

export default function Head() {
  const payslip = JSON.parse(localStorage.getItem("payslip")),
    { user, employment, branch } = payslip,
    designation = Roles.findById(Number(employment.designation)),
    d = new Date(),
    m = d.getMonth(),
    y = d.getFullYear();
  return (
    <>
      <Banner company={branch.companyName} branch={branch.name} />
      <br />
      <br />
      <h5>
        Name: <u>{capitalize(fullName(user?.fullName))}</u>
      </h5>
      <h5>
        Designation: <u>{designation?.name?.toUpperCase()}</u>
      </h5>
      <h5>
        Coverrage:{" "}
        <u>
          {Months[m]} 1-15, {y}
        </u>
      </h5>
      <MDBAlert color="info" className="text-uppercase text-center py-0 mb-1">
        <h5 style={{ letterSpacing: "30px" }} className="mb-0 fw-bold">
          Payslip
        </h5>
      </MDBAlert>
    </>
  );
}
