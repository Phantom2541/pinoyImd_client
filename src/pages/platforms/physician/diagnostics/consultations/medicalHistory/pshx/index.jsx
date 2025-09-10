import "../style.css";
import DraggableList, { useDragAndDrop } from "../dragAndDrop";

export default function PSHx({ pastSurgicalHistory }) {
  const dragDrop = useDragAndDrop(pastSurgicalHistory || []);

  console.log("Current items:", dragDrop.items);

  if (!pastSurgicalHistory || pastSurgicalHistory.length === 0) {
    return (
      <div className="checkup-data-pmh-container">
        No past surgical history available.
      </div>
    );
  }

  return (
    <div className="checkup-data-mh-container">
      <div className="checkup-data-pshx-container">
        <h2>Past Surgical History</h2>
        <DraggableList items={dragDrop.items} {...dragDrop} />
      </div>
    </div>
  );
}
