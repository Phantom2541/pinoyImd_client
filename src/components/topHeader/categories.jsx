import React from "react";

const Categories = ({
  categories = [],
  category = "",
  setCategory = () => {},
}) => {
  return (
    <>
      <select
        className="form-control bg-light"
        value={category.toLowerCase()}
        onChange={(e) => setCategory(e.target.value)}
      >
        {categories.map((c, index) => (
          <option key={index} value={c.toLowerCase()}>
            {c}
          </option>
        ))}
      </select>
    </>
  );
};

export default Categories;
