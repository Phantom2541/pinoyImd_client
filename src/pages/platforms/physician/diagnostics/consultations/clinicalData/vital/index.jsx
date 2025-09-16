import "./../style.css";

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
            {Object.entries(otherVitals).map(([key, value]) => (
              <tr key={key}>
                <td className="vital-label">{formatLabel(key)}</td>
                <td className="vital-value">{value}</td>
              </tr>
            ))}
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
