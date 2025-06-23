export default function ECG({ fontSize = "16px", task }) {
  if (!task) return <div>No task data provided</div>;

  const { findings = "", services } = task;

  const formatText = (text) => {
    return text
      .replace(/\\n/g, "\n") // handles escaped newlines if needed
      .split("\n")
      .map((line, index) => (
        <p key={index} style={{ margin: "0 0 5px 0", paddingLeft: "22px" }}>
          {line.trim()}
        </p>
      ));
  };

  return (
    <div
      style={{
        fontFamily: "Arial",
        fontSize,
        display: "flex",
        flexDirection: "column",
      }}
    >
      <div style={{ display: "flex", alignItems: "flex-start" }}>
        <span style={{ color: "red", fontWeight: "bold", marginRight: "8px" }}>
          •
        </span>
        <span style={{ fontWeight: "bold", color: "red" }}>
          {services.name.toUpperCase()}
        </span>
      </div>

      <div style={{ marginTop: "10px" }}>{formatText(findings)}</div>
    </div>
  );
}
