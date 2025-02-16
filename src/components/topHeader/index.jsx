import React, { useState } from "react";
import { MDBIcon, MDBView, MDBBtn } from "mdbreact";

const TopHeader = ({
  title = "",
  category = "",
  didSearch = false,
  hasCategory = false,
  categories = [],
  setCategory = () => {},
  handleSearch = () => {},
}) => {
  const [isExpanded, setIsExpanded] = useState(false);

  const handleClick = () => {
    const searchValue = getSearchValue();
    if (isExpanded === false) return setIsExpanded(true);
    if (isExpanded && !searchValue) return setIsExpanded(false);
    if (isExpanded && searchValue) return setIsExpanded(true);
    if (didSearch) return (document.getElementById("search").value = "");
  };

  const getSearchValue = () => document.getElementById("search")?.value;

  return (
    <MDBView
      cascade
      className="gradient-card-header blue-gradient narrower py-2 mx-4 mb-3 d-flex justify-content-between align-items-center"
    >
      <div className="d-flex justify-items-center" style={{ width: "20rem" }}>
        <span className="white-text mx-3 text-nowrap mt-2">{title} </span>
        {hasCategory && (
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
        )}
      </div>
      <div>
        <div className="text-right d-flex items-center">
          <input
            className="form-control"
            type="search"
            name="se"
            id="search"
            placeholder="Search..."
            onKeyDown={(e) => {
              if (e.key === "Enter") {
                if (getSearchValue()) return handleSearch();
                setIsExpanded(false);
              }
            }}
            style={{
              width: isExpanded ? "200px" : "0px",
              transition: "width 0.3s ease-in-out",
              overflow: "hidden",
              padding: isExpanded ? "5px" : "0px",
              border: isExpanded ? "1px solid #ccc" : "none",
            }}
          />
          <MDBBtn
            onClick={() => {
              if (isExpanded && getSearchValue()) return handleSearch();
              handleClick();
            }}
            outline
            color="white"
            rounded
            type={"button"}
            size="sm"
            className="px-2"
          >
            <MDBIcon icon={didSearch ? "undo" : "search"} className="mt-0" />
          </MDBBtn>
        </div>
      </div>
    </MDBView>
  );
};

export default TopHeader;
