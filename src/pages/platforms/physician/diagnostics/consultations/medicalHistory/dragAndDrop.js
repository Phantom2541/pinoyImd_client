// DragAndDrop.js
import { useState, memo } from "react";
import { EditableField } from "../../../../../../components/customizable";
import { MDBBtn } from "mdbreact";

// Custom hook
export function useDragAndDrop(initialItems = []) {
  const [items, setItems] = useState(initialItems);
  const [dragIndex, setDragIndex] = useState(null);
  const [placeholderIndex, setPlaceholderIndex] = useState(null);

  const handleDragStart = (e, index) => {
    setDragIndex(index);
    e.dataTransfer.effectAllowed = "move";
    e.dataTransfer.setData("text/plain", index);
  };

  const handleDragOver = (e, index) => {
    e.preventDefault();
    const { top, height } = e.currentTarget.getBoundingClientRect();
    setPlaceholderIndex(e.clientY - top < height / 2 ? index : index + 1);
  };

  const handleDrop = () => {
    if (dragIndex === null || placeholderIndex === null) return;
    const updated = [...items];
    const [moved] = updated.splice(dragIndex, 1);
    updated.splice(
      dragIndex < placeholderIndex ? placeholderIndex - 1 : placeholderIndex,
      0,
      moved
    );
    setItems(updated);
    setDragIndex(null);
    setPlaceholderIndex(null);
  };

  const handleDragEnd = () => {
    setDragIndex(null);
    setPlaceholderIndex(null);
  };

  const handleEdit = (index, newValue) => {
    const updated = [...items];
    updated[index] = newValue;
    setItems(updated);
  };

  // NEW: remove handler

  return {
    items,
    setItems,
    dragIndex,
    placeholderIndex,
    handleDragStart,
    handleDragOver,
    handleDrop,
    handleDragEnd,
    handleEdit,
  };
}

// Draggable list component
const DraggableItem = memo(
  ({
    item,
    index,
    dragIndex,
    placeholderIndex,
    handleDragStart,
    handleDragOver,
    handleDrop,
    handleDragEnd,
    handleEdit,
    handleRemove,
  }) => (
    <>
      {placeholderIndex === index && (
        <li
          className="checkup-data-placeholder-item"
          onDragOver={(e) => e.preventDefault()}
          onDrop={handleDrop}
        />
      )}
      <li
        draggable
        onDragStart={(e) => handleDragStart(e, index)}
        onDragOver={(e) => handleDragOver(e, index)}
        onDrop={handleDrop}
        onDragEnd={handleDragEnd}
        className="checkup-data-draggable-item"
        style={{
          opacity: dragIndex === index ? 0 : 1,
          display: "flex", // put items in a row
          alignItems: "center", // vertical align
          gap: "6px", // space between X and text
        }}
      >
        <button
          onClick={() => handleRemove(index)}
          style={{
            color: "red",
            border: "none",
            background: "transparent",
            fontSize: "16px",
            cursor: "pointer",
            lineHeight: 1,
          }}
        >
          ×
        </button>

        <EditableField
          classNameTxt="checkup-data-draggable-item-text"
          fieldData={{ value: item }}
          keyForValue="value"
          keyForText="value"
          enableEditMode={true}
          onSave={(newData) => handleEdit(index, newData.value)}
        />
      </li>
    </>
  )
);

export default function DraggableList({ items, ...handlers }) {
  const {
    dragIndex,
    placeholderIndex,
    handleDragStart,
    handleDragOver,
    handleDrop,
    handleDragEnd,
    handleEdit,
    handleRemove,
    handleAdd,
  } = handlers;

  return (
    <>
      <ul className="checkup-data-draggable-list">
        {items.map((item, index) => (
          <DraggableItem
            key={index}
            item={item}
            index={index}
            dragIndex={dragIndex}
            placeholderIndex={placeholderIndex}
            handleDragStart={handleDragStart}
            handleDragOver={handleDragOver}
            handleDrop={handleDrop}
            handleDragEnd={handleDragEnd}
            handleEdit={handleEdit}
            handleRemove={handleRemove}
          />
        ))}
        {placeholderIndex === items.length && (
          <li
            key="ph-end"
            className="checkup-data-placeholder-item"
            onDragOver={(e) => e.preventDefault()}
            onDrop={handleDrop}
          />
        )}
      </ul>
      {/* Add button under list */}
      <MDBBtn color="info" size="sm" rounded onClick={handleAdd}>
        + Add Pregnancy
      </MDBBtn>
    </>
  );
}
