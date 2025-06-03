import { MDBRow, MDBCol } from "mdbreact";
import React, { useState, useEffect } from "react";
import Hr from "./hr/index";

const Slip = () => {
  return (
    <div
      style={{
        width: "100vw",
        height: "100vh",
        backgroundColor: "white",
      }}
    >
      <MDBRow>
        <MDBCol>
          <Hr />
          <i>Employee's copy</i>
        </MDBCol>
        <MDBCol>
          <Hr />
          <i>HR copy</i>
        </MDBCol>
      </MDBRow>
    </div>
  );
};

export default function Payslip() {
  const [payroll, setPayroll] = useState({ _id: "" });

  useEffect(() => {
    setPayroll(JSON.parse(localStorage.getItem("payslip")));

    return () => localStorage.removeItem("payslip");
  }, []);

  if (payroll?._id) return <Slip payroll={payroll} />;

  return <div>Payroll is Empty</div>;
}
