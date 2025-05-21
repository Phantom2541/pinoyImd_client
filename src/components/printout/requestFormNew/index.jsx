import React, { useState, useEffect } from "react";
import Header from "./header";
import {
  Chemistry,
  Hematology,
  Urinalysis,
  Miscellaneous,
  Parasitology,
  Serology,
} from "./logs";
import { MDBCol, MDBRow } from "mdbreact";
// import { Services } from "../../services/fakeDb";

const formComponents = {
  Chemistry,
  Hematology,
  Urinalysis,
  Parasitology,
  Miscellaneous,
  Serology,
};

const getComponents = (key) => {
  switch (key) {
    case "Chemistry":
    case "Electrolyte":
    case "Serology":
      return formComponents["Chemistry"];
    default:
      return formComponents[key];
  }
};

const Printout = ({ deal, forms, ssx }) => {
  const { updatedAt, customerId: customer, referral, category } = deal;

  return (
    <div style={{ width: "100vw", height: "100vh", backgroundColor: "white" }}>
      <div
        style={{
          width: "600px",
          cursor: "default",
          fontFamily: "Helvetica, sans-serif",
          letterSpacing: "-0.5px",
          fontSize: "16px",
        }}
      >
        <Header
          patient={customer}
          date={updatedAt}
          category={category}
          referral={referral}
          ssx={ssx}
        />
      </div>

      {/* Updated layout */}

      <MDBRow>
        {Object?.keys(forms)?.map((key, index) => {
          const FormComponent = getComponents(key);
          return (
            <MDBCol md="2">
              <div
                key={index}
                style={{
                  height: "100%",
                  padding: "5px", // Reduce padding
                  border: "1px solid #ddd", // Light border
                  borderRadius: "3px", // Smaller border radius
                  backgroundColor: "#fff",
                }}
              >
                <div
                  style={{
                    display: "flex",
                    justifyContent: "space-between",
                    borderBottom: "1px solid #ccc",
                    paddingBottom: "3px",
                    marginBottom: "5px",
                    fontWeight: "bold",
                    fontSize: "12px", // Smaller font
                  }}
                >
                  <span>{key}</span>
                  <span>{forms[key]?.price}</span>
                </div>
                {FormComponent && (
                  <div style={{ fontSize: "10px", padding: "2px" }}>
                    <FormComponent data={forms[key]} />
                  </div>
                )}
              </div>
            </MDBCol>
          );
        })}
      </MDBRow>
    </div>
  );
};

export default function TaskPrintout() {
  const [sale, setSale] = useState(null);
  const [forms, setForms] = useState(null);
  const [ssx, setSsx] = useState(null);

  useEffect(() => {
    const { forms, deal } = JSON.parse(localStorage.getItem("inhouse"));
    setSale(deal);
    setForms(forms);
    setSsx(localStorage.getItem("ssx") || "");
  }, []);

  // Ensure data has been loaded before rendering
  if (sale === null || forms === null) {
    return <div>Loading...</div>;
  }

  return <Printout deal={sale} forms={forms} ssx={ssx} />;
}
