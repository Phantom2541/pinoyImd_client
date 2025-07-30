import React, { useState, useEffect } from "react";
import { MDBView } from "mdbreact";
import { HMO } from "../../../../services/fakeDb";

const Header = ({ setFilteredHMOs }) => {
  const [searchTerm, setSearchTerm] = useState("");

  useEffect(() => {
    const filtered = HMO.collections
      .slice(1) // Skip first if needed
      .filter(({ name = "", abbr = "" }) =>
        `${name} ${abbr}`.toLowerCase().includes(searchTerm.toLowerCase())
      );
    setFilteredHMOs(filtered);
  }, [searchTerm, setFilteredHMOs]);

  return (
    <MDBView
      cascade
      className="gradient-card-header blue-gradient narrower py-2 mx-4 mb-3 d-flex justify-content-between align-items-center"
    >
      <div className="d-flex justify-items-center" style={{ width: "20rem" }}>
        <span className="white-text mx-3 text-nowrap mt-0">
          {HMO.collections.length - 1} Accredited Health Management Organization
        </span>
      </div>

      <div className="d-flex align-items-center">
        <input
          type="text"
          placeholder="Search HMO..."
          value={searchTerm}
          onChange={(e) => setSearchTerm(e.target.value)}
          style={{
            padding: "6px 12px",
            borderRadius: "5px",
            border: "1px solid white",
            backgroundColor: "white",
            color: "#000",
            outline: "none",
            minWidth: "220px",
          }}
        />
      </div>
    </MDBView>
  );
};

export default Header;
