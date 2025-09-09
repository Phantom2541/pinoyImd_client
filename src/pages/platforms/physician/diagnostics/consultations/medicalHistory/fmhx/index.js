import "../style.css";

export default function FMHx({ familyHistory }) {
  if (!familyHistory || familyHistory.length === 0) {
    return (
      <div className="checkup-data-pmh-container">
        No family history available.
      </div>
    );
  }

  return (
    <div className="checkup-data-pmh-container">
      <h2>Family History</h2>
      <ul className="family-history-list">
        {familyHistory.map((item, index) => (
          <li key={index}>{item}</li>
        ))}
      </ul>
    </div>
  );
}
