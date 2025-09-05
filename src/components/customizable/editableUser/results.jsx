import React from "react";
import { fullName } from "../../../services/utilities";

const Results = ({ results, handleSelect = () => {} }) => {
  return (
    <ul className="editable-user-results-list">
      {results.map((item, index) => (
        <li
          key={index}
          className="editable-user-result-item"
          onClick={() => handleSelect(item)}
        >
          <div className="holder-result-content">
            <span style={{ fontSize: "1.1rem" }}>
              {item.isMale ? "👨" : "👩"}
            </span>
            {fullName(item?.fullName)}
          </div>
        </li>
      ))}
    </ul>
  );
};

export default Results;
