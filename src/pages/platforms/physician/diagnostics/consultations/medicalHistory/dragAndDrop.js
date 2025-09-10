// DragAndDrop.js
import { useState, memo } from "react";
import { EditableField } from "../../../../../../components/customizable";

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
        style={{ opacity: dragIndex === index ? 0 : 1 }}
      >
        <EditableField
          classNameTxt="checkup-data-draggable-item-text"
          fieldData={{ value: item }} // wrap string into object
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
  } = handlers;

  return (
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
  );
}
