import DraggableList, { useDragAndDrop } from "../dragAndDrop";

export default function FMHx({ familyHistory }) {
  const dragDrop = useDragAndDrop(familyHistory || []);

  console.log("Current items:", dragDrop.items);

  if (!familyHistory || familyHistory.length === 0) {
    return (
      <div className="checkup-data-pmh-container">
        No Family history available.
      </div>
    );
  }

  return (
    <div className="checkup-data-mh-container">
      <div className="checkup-data-fmhx-container">
        <h2>Family History</h2>
        <DraggableList items={dragDrop.items} {...dragDrop} />
      </div>
    </div>
  );
}
