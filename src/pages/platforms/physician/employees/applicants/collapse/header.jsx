import React from "react";

const Header = ({ item, isOpen, index, setActiveId }) => {
  const { name, abbreviation } = item;

  return (
    <tr>
      <td>{index + 1}</td>
      <td>{name}</td>
      <td>{abbreviation}</td>
      <td>
        <button
          onClick={() => setActiveId((prev) => (index === prev ? -1 : index))}
          className="btn btn-link p-0"
          style={{ textDecoration: "none", fontWeight: "bold" }}
        >
          Accreditation{" "}
          <i
            className="fa fa-angle-left transition-all"
            style={{
              display: "inline-block",
              transform: `rotate(${isOpen ? "-90deg" : "0deg"})`,
              transition: "transform 0.3s ease",
              marginLeft: "5px",
            }}
          />
        </button>
      </td>
    </tr>
  );
};

export default Header;
