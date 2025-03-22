import React, { useState, useEffect } from "react";
import Header from "./header";
import {
  Chemistry,
  Hematology,
  Urinalysis,
  // Parasitology,
  Serology,
} from "./logs";
// import { Services } from "../../services/fakeDb";

const formComponents = {
  Chemistry,
  Hematology,
  Urinalysis,
  // Parasitology,
  Serology,
};

const Printout = ({ sale, forms, ssx }) => {
  console.log("forms", forms);
  
  const { updatedAt, customer, referral, category } = sale;

  return (
    <div
      style={{
        width: "100vw",
        height: "50vh", // Adjusted height for half long bond paper
        backgroundColor: "white",
        display: "flex",
        flexDirection: "column",
        alignItems: "center",
        justifyContent: "center",
        padding: "10px", // Added padding for proper spacing
        overflow: "auto", // Ensure all content is visible
      }}
    >
      <div
        style={{
          width: "600px",
          cursor: "default",
          fontFamily: "Helvetica, sans-serif",
          letterSpacing: "-0.5px",
          fontSize: "14px", // Reduced font size for better fit
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
          display: "flex",
          flexWrap: "wrap",
          gap: "3px",
          padding: "3px",
          fontSize: "10px",
          maxHeight: "calc(50vh - 100px)", // Ensure content fits in half bond paper
          overflowY: "auto", // Enable scrolling for long content
        }}
      >
        {Object?.keys(forms)?.map((key, index) => {
          const FormComponent = formComponents[key];
          return (
            <div
              key={index}
              style={{
                width: "100%", // Allow full width to fit all content
                padding: "5px",
                border: "1px solid #ddd",
                borderRadius: "2px",
                backgroundColor: "#fff",
                fontSize: "10px",
              }}
            >
              <div
                style={{
                  display: "flex",
                  justifyContent: "space-between",
                  borderBottom: "1px solid #ccc",
                  paddingBottom: "2px",
                  marginBottom: "3px",
                  fontWeight: "bold",
                  fontSize: "10px",
                }}
              >
                <span>{key}</span>
                <span>{forms[key]?.price}</span>
              </div>
              {FormComponent && (
                <div style={{ fontSize: "9px", padding: "2px", whiteSpace: "pre-wrap" }}>
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
  const [sale, setSale] = useState(null);
  const [forms, setForms] = useState(null);
  const [ssx, setSsx] = useState(null);
  
  useEffect(() => {
    setSale(JSON.parse(localStorage.getItem("RequestForm")));
    setForms(JSON.parse(localStorage.getItem("task")));
    setSsx(localStorage.getItem("ssx"));
  }, []);

  // Ensure data has been loaded before rendering
  if (sale === null || forms === null) {
    return <div>Loading...</div>;
  }

  return <Printout sale={sale} forms={forms} ssx={ssx} />;
}
