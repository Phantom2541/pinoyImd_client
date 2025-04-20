import React from "react";

export default function Xray({ fontSize = "16px", task }) {
  if (!task) return <div>No task data provided</div>;

  const { description = "", impression = "" } = task;

  const formatText = (text) => {
    return text
      .replace(/\\n/g, "\n") // handles escaped newlines if needed
      .split("\n")
      .map((line, index) => (
        <p key={index} style={{ margin: "0 0 5px 0", textIndent: "20px" }}>
          {line.trim()}
        </p>
      ));
  };

  return (
    <div style={{ padding: "20px", fontFamily: "Arial", fontSize }}>
      <h2 style={{ color: "red", fontWeight: "bold", textAlign: "center" }}>
        ROENTGENOLOGICAL REPORT
      </h2>

      <div
        style={{ display: "flex", alignItems: "flex-start", marginTop: "20px" }}
      >
        <span style={{ color: "red", fontWeight: "bold", marginRight: "8px" }}>
          •
        </span>
        <span style={{ fontWeight: "bold", color: "red" }}>Chest</span>
      </div>

      <div style={{ marginTop: "10px" }}>{formatText(description)}</div>

      <div style={{ marginTop: "30px" }}>{formatText(impression)}</div>
    </div>
  );
}
