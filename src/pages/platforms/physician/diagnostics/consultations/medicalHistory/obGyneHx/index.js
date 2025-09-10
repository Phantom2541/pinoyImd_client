import "../style.css";

export default function OBGyneHx({ obGyneHistory }) {
  if (!obGyneHistory || obGyneHistory.length === 0) {
    return (
      <div className="checkup-data-mh-container">
        No OB-Gyne history available.
      </div>
    );
  }

  // Compute GTPAL
  const gravida = obGyneHistory.length;
  const termBirths = obGyneHistory.filter(
    (p) => p.outcome === "Alive" && p.gestationWeeks >= 37
  ).length;
  const pretermBirths = obGyneHistory.filter(
    (p) => p.outcome === "Alive" && p.gestationWeeks < 37
  ).length;
  const abortions = obGyneHistory.filter(
    (p) => p.outcome === "Abortion"
  ).length;
  const livingChildren = obGyneHistory.filter(
    (p) => p.outcome === "Alive"
  ).length;

  return (
    <div className="checkup-data-mh-container">
      <h2>OB-Gyne History</h2>

      <ul className="obgyne-list">
        {obGyneHistory.map((pregnancy, index) => (
          <li key={index}>
            Pregnancy #{pregnancy.order}: Outcome - {pregnancy.outcome},
            Delivery - {pregnancy.deliveryType}
          </li>
        ))}
      </ul>

      <div className="gtpal-summary">
        <strong>GTPAL:</strong> G{gravida} T{termBirths} P{pretermBirths} A
        {abortions} L{livingChildren}
      </div>

      <div className="legend">
        <h4>Legend:</h4>
        <ul>
          <li>
            <strong>G:</strong> Total pregnancies (Gravida)
          </li>
          <li>
            <strong>T:</strong> Term births ≥37 weeks
          </li>
          <li>
            <strong>P:</strong> Preterm births &lt;37 weeks
          </li>
          <li>
            <strong>A:</strong> Abortions &lt;20 weeks
          </li>
          <li>
            <strong>L:</strong> Living children at present
          </li>
        </ul>
      </div>
    </div>
  );
}
