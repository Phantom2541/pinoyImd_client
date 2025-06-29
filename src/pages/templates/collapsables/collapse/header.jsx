import React from "react";
import { Templates } from "../../../../services/fakeDb";

const Header = ({ item, isOpen, textColor, index, setActiveId }) => {
  const { name, abbreviation, template } = item;
  return (
    <div
      className={`d-flex justify-content-between align-items-center ${textColor} `}
      onClick={() => setActiveId((prev) => (index === prev ? -1 : index))}
      style={{ padding: "1rem" }}
    >
      {index + 1}. {name} {abbreviation}
      <div className="d-flex align-items-center" style={{ gap: "10px" }}>
        <small>{Templates.getComponentName(template)}</small>
        <button
          className="transition-all"
          style={{
            border: "none",
            backgroundColor: "transparent",
            rotate: `${isOpen ? -90 : 0}deg`,
          }}
        >
          <i
            className="fa fa-angle-left transition-all "
            style={{ color: `${isOpen ? "white" : ""}` }}
          />
        </button>
      </div>
    </div>
  );
};

export default Header;
