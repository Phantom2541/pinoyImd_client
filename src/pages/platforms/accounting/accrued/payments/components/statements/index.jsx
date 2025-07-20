import React from "react";
import { Statements } from "../../../../../../../services/fakeDb";

export default function CategorySelect({ setCategories }) {
  const categories = Statements.getCategories();

  const handleCategoryChange = (e) => setCategories(e.target.value);

  return (
    <select
      onChange={handleCategoryChange}
      className="browser-default custom-select"
      style={{ width: "115px", marginRight: "20px" }}
    >
      <option value="" disabled>
        Select a category
      </option>
      {Array.isArray(categories) &&
        categories.map((category, index) => (
          <option key={index} value={category}>
            {category}
          </option>
        ))}
    </select>
  );
}
