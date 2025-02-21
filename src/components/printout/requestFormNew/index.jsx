import React, { useState, useEffect } from "react";
import Header from "./header";
import { MDBTable } from "mdbreact";
// import { Services } from "../../services/fakeDb";

const Printout = ({ sale }) => {
  console.log("sale", sale);

  // const {
  //   category,
  //   branchId,
  //   patient,
  //   updatedAt,
  //   source,
  //   referral,
  //   form,
  //   remarks,
  // } = task;
  // const { updatedAt, customer, referral, category, cart = [] } = sale;
  const { updatedAt, customer, referral, category } = sale;
  return (
    <div style={{ width: "100vw", height: "100vh", backgroundColor: "white" }}>
      <div
        style={{
          width: "500px",
          height: "624px",
          cursor: "default",
          fontFamily: "Helvetica, sans-serif",
          letterSpacing: "-0.5px",
          fontSize: "18px",
        }}
      >
        <Header
          patient={customer}
          date={updatedAt}
          category={category}
          referral={referral}
        />
        <MDBTable
          responsive
          borderless
          className="mb-0 thermal-font"
        ></MDBTable>
      </div>
    </div>
  );
};

export default function TaskPrintout() {
  const [sale, setSale] = useState({ _id: "" });

  useEffect(() => {
    setSale(JSON.parse(localStorage.getItem("RequestForm")));
  }, []);
  console.log(sale);
  if (sale?.customer) return <Printout sale={sale} />;

  return <div>Task is Empty</div>;
}
