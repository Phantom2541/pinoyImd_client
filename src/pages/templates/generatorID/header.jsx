import React from "react";

export default function Header({ setIsOpen }) {
  return (
    <div className="IDGenerator-header">
      <h1>Generate ID</h1>
      <div>
        <button className="bg-primary" onClick={() => setIsOpen(true)}>
          Add Template
        </button>
      </div>
    </div>
  );
}
