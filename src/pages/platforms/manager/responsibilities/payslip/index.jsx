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
          <br />
          <i>Employees copy</i>
        </MDBCol>
        <MDBCol>
          <Hr />
          <br />
          <i>HR copy</i>
        </MDBCol>
      </MDBRow>
    </div>
  );
};

export default function Payslip() {
  const [task, setTask] = useState({ _id: "" });

  useEffect(() => {
    setTask(JSON.parse(localStorage.getItem("payslip")));

    return () => localStorage.removeItem("payslip");
  }, []);

  if (task?._id) return <Slip task={task} />;

  return <div>Task is Empty</div>;
}
