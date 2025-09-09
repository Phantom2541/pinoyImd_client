import "../style.css";

export default function PMHx({ pastMedicalHistory }) {
  if (!pastMedicalHistory || pastMedicalHistory.length === 0) {
    return (
      <div className="checkup-data-pmh-container">
        No past medical history available.
      </div>
    );
  }

  return (
    <div className="checkup-data-pmh-container">
      <h2>Past Medical History</h2>
      <ul className="pmh-list">
        {pastMedicalHistory.map((item, index) => (
          <li key={index}>{item}</li>
        ))}
      </ul>
    </div>
  );
}
