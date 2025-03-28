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
  console.log(JSON.parse(localStorage.getItem("payslip")));
  const payslip = JSON.parse(localStorage.getItem("payslip")),
    { user, contract, branch } = payslip,
    designation = Roles.findById(Number(contract.designation)),
    d = new Date(),
    m = d.getMonth(),
    y = d.getFullYear();

  const handleCoverate = () => {
    switch (Number(contract.pc)) {
      case 1:
        return `${Months[m]} ${
          d.getDay() < 15 ? "1-15" : "16-" + new Date(y, m + 1, 0).getDay()
        }, ${y}`;
      case 2:
        return `${Months[m]} ${"1-" + new Date(y, m + 1, 0).getDay()}, ${y}`;
      default:
        return `${
          Months[new Date(d.setMonth(d.getMonth() - 2)).getMonth()]
        } - ${Months[m]}`;
    }
  };

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
        Coverrage: <u>{handleCoverate()}</u>
      </h5>
      <MDBAlert color="info" className="text-uppercase text-center py-0 mb-1">
        <h5 style={{ letterSpacing: "30px" }} className="mb-0 fw-bold">
          Payslip
        </h5>
      </MDBAlert>
    </>
  );
}
