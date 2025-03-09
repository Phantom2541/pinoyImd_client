import React, { useState, useEffect } from "react";
import Header from "./header";
import {
  Chemistry,
  Hematology,
  Urinalysis,
  Parasitology,
  Serology,
} from "./logs";
// import { Services } from "../../services/fakeDb";

const formComponents = {
  Chemistry,
  Hematology,
  Urinalysis,
  Parasitology,
  Serology,
};

const Printout = ({ sale, forms, ssx }) => {
  const { updatedAt, customer, referral, category } = sale;

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
      <div
        style={{
          display: "flex", // Display forms side by side
          flexWrap: "wrap", // Allow wrapping if needed
          gap: "5px", // Reduce spacing for better fit
          padding: "5px", // Reduced padding for a tighter fit
          fontSize: "12px", // Smaller text for better fit
        }}
      >
        {Object.keys(forms).map((key, index) => {
          const FormComponent = formComponents[key];
          return (
            <div
              key={index}
              style={{
                minWidth: "250px", // Smaller width
                flex: "1",
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
          );
        })}
      </div>
    </div>
  );
};

export default function TaskPrintout() {
  const [sale, setSale] = useState({ _id: "" }),
    [forms, setForms] = useState({}),
    [ssx, setSsx] = useState({});

  useEffect(() => {
    setSale(JSON.parse(localStorage.getItem("RequestForm")));
    setForms(JSON.parse(localStorage.getItem("task")));
    setSsx(localStorage.getItem("ssx"));
  }, []);

  if (sale?.customer) return <Printout sale={sale} forms={forms} ssx={ssx} />;

  return <div>Task is Empty</div>;
}
