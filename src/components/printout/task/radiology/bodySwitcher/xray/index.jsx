import React from "react";

export default function Xray({ fontSize = "16px", task }) {
  if (!task) return <div>No task data provided</div>;

  const { description = "", impression = "", services } = task;

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
    <div
      style={{
        padding: "20px",
        fontFamily: "Arial",
        fontSize,
        minHeight: "700px",
        display: "flex",
        flexDirection: "column",
        // justifyContent: "space-between",
      }}
    >
      <div
        style={{ display: "flex", alignItems: "flex-start", marginTop: "20px" }}
      >
        <span style={{ color: "red", fontWeight: "bold", marginRight: "8px" }}>
          •
        </span>
        <span style={{ fontWeight: "bold", color: "red" }}>
          {services.name.toUpperCase()}
        </span>
      </div>

      <div style={{ marginTop: "10px" }}>{formatText(description)}</div>
      <div style={{ marginTop: "30px" }}>IMPRESSION :</div>
      <div style={{ marginTop: "10px" }}>{formatText(impression)}</div>
    </div>
  );
}
