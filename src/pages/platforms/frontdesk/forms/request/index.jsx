import React from "react";
import Header from "./header";
import Body from "./body";
import "./requestForm.css"; // import the css

export default function RequestForm() {
  return (
    <div className="requestform-container">
      <div className="requestform-card">
        <div className="requestform-header">
          <Header />
        </div>
        <div className="requestform-body">
          <Body />
        </div>
      </div>
    </div>
  );
}
