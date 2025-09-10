import "../style.css";
import DraggableList, { useDragAndDrop } from "../dragAndDrop";

export default function PMHx({ pastMedicalHistory }) {
  const dragDrop = useDragAndDrop(pastMedicalHistory || []);

  if (!pastMedicalHistory || pastMedicalHistory.length === 0) {
    return (
      <div className="checkup-data-pmh-container">
        No past medical history available.
      </div>
    );
  }

  return (
    <div className="checkup-data-mh-container">
      <div className="checkup-data-pmhx-container">
        <h2>Past Medical History</h2>
        <DraggableList items={dragDrop.items} {...dragDrop} />
      </div>
    </div>
  );
}
