import React from "react";
import { Services } from "../../../../services/fakeDb";

const Chemistry = ({ data = {} }) => {
  console.log("data:", data);

  // Convert object keys to an array (assuming keys are test names)
  const testList = Object.keys(data);

  // If no tests are provided, return nothing
  if (!testList.length) return null;

  return (
    <div style={{ fontSize: "12px", fontFamily: "Helvetica, sans-serif" }}>
      <div style={{ fontWeight: "bold", marginBottom: "5px" }}>Chemistry</div>
      {testList.map((test, index) => (
        <div
          key={index}
          style={{ display: "flex", justifyContent: "space-between" }}
        >
          <span>{Services.find(test)?.abbreviation}</span>
          <span
            style={{ borderBottom: "1px dotted black", minWidth: "50px" }}
          ></span>
        </div>
      ))}
    </div>
  );
};

export default Chemistry;
