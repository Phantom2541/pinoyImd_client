import React from "react";
const UrinalysisData = [
  ["Color", "SG", "pH"],
  ["Sugar", "Protein", "Leucocyte", "Nitrate", "Bacteria", "Blood"],
  [
    "WBC",
    "RBC",
    "Epithelial Cells",
    "Amorphous Urates",
    "Mucus Threads",
    "Bacteria",
  ],
];

const Urinalysis = () => {
  return (
    <div style={{ fontSize: "12px", fontFamily: "Helvetica, sans-serif" }}>
      <table
        style={{
          width: "100%",
          borderCollapse: "collapse",
        }}
      >
        <thead>
          <tr>
            <th style={{ textAlign: "left", padding: "1px" }}>Test</th>
            <th style={{ textAlign: "left", padding: "1px" }}>Result</th>
          </tr>
        </thead>
        <tbody>
          {UrinalysisData.map((group, index) => (
            <React.Fragment key={index}>
              {group.map((test, subindex) => (
                <tr key={subindex}>
                  <td style={{ padding: "1px" }} className="text-left">
                    {test}
                  </td>
                  <td style={{ padding: "1px" }}>
                    <span
                      style={{
                        borderBottom: "1px dotted black",
                        display: "inline-block",
                        width: "100%",
                        minHeight: "1em",
                      }}
                    ></span>
                  </td>
                </tr>
              ))}
              {index !== UrinalysisData.length - 1 && (
                <tr>
                  <td colSpan="2">
                    <hr
                      style={{
                        border: "none",
                        borderTop: "1px dashed #000",
                        height: 0,
                      }}
                      className={`my-1 `}
                    />
                  </td>
                </tr>
              )}
            </React.Fragment>
          ))}
        </tbody>
      </table>
    </div>
  );
};

export default Urinalysis;
