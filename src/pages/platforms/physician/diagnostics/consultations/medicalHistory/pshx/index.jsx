import "../style.css";

export default function PSHx({ pastSurgicalHistory }) {
  if (!pastSurgicalHistory || pastSurgicalHistory.length === 0) {
    return (
      <div className="checkup-data-pmh-container">
        No past surgical history available.
      </div>
    );
  }

  return (
    <div className="checkup-data-pmh-container">
      <h2>Past Surgical History</h2>
      <ul className="pshx-list">
        {pastSurgicalHistory.map((item, index) => (
          <li key={index}>{item}</li>
        ))}
      </ul>
    </div>
  );
}
