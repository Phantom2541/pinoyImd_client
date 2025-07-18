import React from "react";
import PROFILE from "./../../../../../../assets/female.jpg";

export default function OrgStorage({ storageItems, onDropToStorage }) {
  const handleDragStart = (e, item) => {
    e.dataTransfer.setData("id", item.name);
    e.dataTransfer.setData("hId", "");
  };

  const handleDrop = (e) => {
    e.preventDefault();
    const id = e.dataTransfer.getData("id");
    if (e.dataTransfer.getData("hId")) onDropToStorage(id);
  };

  return (
    <div
      className="orgChart-storage"
      onDragOver={(e) => e.preventDefault()}
      onDrop={handleDrop}
    >
      {storageItems.map((item, i) => (
        <div
          key={i}
          className="orgChart-box storage-item"
          draggable={true}
          onDragStart={(e) => handleDragStart(e, item)}
        >
          <div className="orgChart-position bg-secondary text-center">
            <span>{item.title}</span>
          </div>
          <div className="orgChart-image">
            <img src={PROFILE} alt={item.name} />
          </div>
          <div className="orgChart-name text-center">{item.name}</div>
        </div>
      ))}
    </div>
  );
}
