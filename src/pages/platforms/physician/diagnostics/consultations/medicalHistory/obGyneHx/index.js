import "../style.css";
import DraggableList, { useDragAndDrop } from "../dragAndDrop";

export default function OBGyneHx({ obGyneHistory }) {
  const dragDrop = useDragAndDrop(obGyneHistory || []);

  const {
    items,
    dragIndex,
    placeholderIndex,
    handleDragStart,
    handleDragOver,
    handleDrop,
    handleDragEnd,
    handleEdit,
  } = dragDrop;

  if (!obGyneHistory || obGyneHistory.length === 0) {
    return (
      <div className="checkup-data-mh-container">
        No OB-Gyne history available.
      </div>
    );
  }

  // Compute GTPAL based on draggable items
  const gravida = items.length;
  const termBirths = items.filter(
    (p) => p.outcome === "Alive" && p.gestationWeeks >= 37
  ).length;
  const pretermBirths = items.filter(
    (p) => p.outcome === "Alive" && p.gestationWeeks < 37
  ).length;
  const abortions = items.filter((p) => p.outcome === "Abortion").length;
  const livingChildren = items.filter((p) => p.outcome === "Alive").length;

  // Transform object into display string
  const itemTexts = items.map(
    (p) =>
      `Pregnancy #${p.order}: Outcome - ${p.outcome}, Delivery - ${p.deliveryType}`
  );

  return (
    <div className="checkup-data-mh-container obgynehx">
      <div className="checkup-data-obgynhx-container">
        <h2>OB-Gyne History</h2>

        <DraggableList
          items={itemTexts}
          dragIndex={dragIndex}
          placeholderIndex={placeholderIndex}
          handleDragStart={handleDragStart}
          handleDragOver={handleDragOver}
          handleDrop={handleDrop}
          handleDragEnd={handleDragEnd}
          handleEdit={(index, newValue) => {
            // Parse edited string back into object fields
            const regex = /Outcome - (.*), Delivery - (.*)/;
            const match = newValue.value.match(regex);
            if (!match) return;
            const updated = {
              ...items[index],
              outcome: match[1].trim(),
              deliveryType: match[2].trim(),
            };
            handleEdit(index, updated);
          }}
        />
      </div>

      <div className="checkup-data-obgynhx-summary-legend">
        <div className="gtpal-summary">
          <span className="checkup-data-gtpal-label">GTPAL:</span>
          <div>
            <span>G-</span>
            <span>{gravida}</span>
          </div>
          <div>
            <span>T-</span>
            <span>{termBirths}</span>
          </div>
          <div>
            <span>P-</span>
            <span>{pretermBirths}</span>
          </div>
          <div>
            <span>A-</span>
            <span>{abortions}</span>
          </div>
          <div>
            <span>L-</span>
            <span>{livingChildren}</span>
          </div>
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
    </div>
  );
}
