import React, { useState, useEffect } from "react";
import Header from "./header";
import { MDBTable } from "mdbreact";
import {
  Chemistry,
  Hematology,
  Microscopy,
  Parasitology,
  Serology,
} from "./logs";
// import { Services } from "../../services/fakeDb";

const formComponents = {
  Chemistry,
  Hematology,
  Microscopy,
  Parasitology,
  Serology,
};

const Printout = ({ sale, forms }) => {
  console.log("sale", sale);

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

        <div style={{ padding: "0 20px" }}>
          {Object.keys(forms).map((key, index) => {
            const FormComponent = formComponents[key];
            return (
              <div key={index}>
                <div
                  style={{ display: "flex", justifyContent: "space-between" }}
                >
                  <span>{key}</span>
                  <span>{forms[key]?.price}</span>
                </div>
                {FormComponent && <FormComponent data={forms[key]} />}
              </div>
            );
          })}
        </div>
      </div>
    </div>
  );
};

export default function TaskPrintout() {
  const [sale, setSale] = useState({ _id: "" }),
    [forms, setForms] = useState({});

  useEffect(() => {
    setSale(JSON.parse(localStorage.getItem("RequestForm")));
    setForms(JSON.parse(localStorage.getItem("task")));
  }, []);

  console.log(sale);
  if (sale?.customer) return <Printout sale={sale} forms={forms} />;

  return <div>Task is Empty</div>;
}
