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
  if (!vitalSigns) {
    return (
      <div className="vital-sign-container">No vital signs available.</div>
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
