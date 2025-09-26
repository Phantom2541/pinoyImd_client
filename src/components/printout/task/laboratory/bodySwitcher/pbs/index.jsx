export default function Pbs({ task }) {
  const { findings } = task;
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
    <div style={{ border: "0.5px solid black" }} className="mt-1">
      <h5 className="text-center my-5" style={{ fontWeight: 400 }}>
        {formatText(findings)}
      </h5>
    </div>
  );
}
