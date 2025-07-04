import React, { useState } from "react";
import "./style.css";

const InputSearch = () => {
  const [searchTerm, setSearchTerm] = useState("");

  const items = [
    "Apple",
    "Banana",
    "Orange",
    "Grapes",
    "Pineapple",
    "Mango",
    "Strawberry",
  ];

  const filteredItems = items.filter((item) =>
    item.toLowerCase().includes(searchTerm.toLowerCase())
  );

  return (
    <div className="template-search-container">
      <input
        type="text"
        placeholder="Search fruits..."
        className="template-search-input"
        value={searchTerm}
        onChange={(e) => setSearchTerm(e.target.value)}
      />

      {searchTerm && (
        <ul className="template-results-list">
          {filteredItems.length > 0 ? (
            filteredItems.map((item, index) => (
              <li key={index} className="template-result-item">
                <div className="template-result-content">{item}</div>
              </li>
            ))
          ) : (
            <li className="template-no-result">
              <div className="template-result-content">No results found</div>
            </li>
          )}
        </ul>
      )}
    </div>
  );
};

export default InputSearch;
