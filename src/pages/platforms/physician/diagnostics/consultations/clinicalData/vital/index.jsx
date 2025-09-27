import "./../style.css";

const vitalsConfig = {
  temp: {
    label: "Temperature",
    unit: "°C",
  },
  bp: {
    label: "Blood Pressure",
    unit: "mmHg",
  },
  rr: {
    label: "Respiratory Rate",
    unit: "breaths/min",
  },
  pr: {
    label: "Pulse Rate",
    unit: "bpm",
  },
  hr: {
    label: "Heart Rate",
    unit: "bpm",
  },
};
export default function VitalSign({ vitalSigns }) {
  if (!vitalSigns || Object.keys(vitalSigns).length === 0) {
    return (
      <div className="checkup-data-pmh-container d-flex flex-column justify-content-center align-items-center text-center h-100">
        <h3 className="mb-3">No vital signs registered.</h3>

        <div style={{ marginTop: "5px", lineHeight: "1.8" }}>
          <span style={{ fontWeight: "bold" }}>BP:</span> ______ mmHg <br />
          <span style={{ fontWeight: "bold" }}>PR/HR:</span> ______ bpm <br />
          <span style={{ fontWeight: "bold" }}>RR:</span> ______ cpm <br />
          <span style={{ fontWeight: "bold" }}>Temp:</span> ______ °C <br />
          <span style={{ fontWeight: "bold" }}>Ht:</span> ______ cm <br />
          <span style={{ fontWeight: "bold" }}>Wt:</span> ______ kg <br />
        </div>

        <h3 className="mt-3">Please add vital signs.</h3>
      </div>
    );
  }

  const { weight, height, ...otherVitals } = vitalSigns;

  // Compute BMI: weight(kg) / (height(m)^2)
  const bmi = weight && height ? (weight / (height * height)).toFixed(2) : null;

  return (
    <div className="vital-sign-container">
      <div className="vital-signs-wrapper">
        <h2>Vital Signs</h2>
        <table className="vital-signs-table">
          <tbody>
            {Object.entries(otherVitals).map(([key, value]) => {
              const { label, unit } = vitalsConfig[key];
              return (
                <tr key={key}>
                  <td className="vital-label">{label}</td>
                  <td className="vital-value">{`${value} ${unit}`}</td>
                </tr>
              );
            })}
            {bmi && (
              <tr>
                <td className="vital-label">BMI</td>
                <td
                  className={`vital-value ${
                    bmi < 18.5
                      ? "vital-bmi-warning"
                      : bmi >= 25
                      ? "vital-bmi-danger"
                      : "vital-bmi-normal"
                  }`}
                >
                  {bmi}
                </td>
              </tr>
            )}
          </tbody>
        </table>
      </div>
    </div>
  );
}

// Helper to convert camelCase to Normal Text
function formatLabel(label) {
  return label
    .replace(/([A-Z])/g, " $1")
    .replace(/^./, (str) => str.toUpperCase());
}
