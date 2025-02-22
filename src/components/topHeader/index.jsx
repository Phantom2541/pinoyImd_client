import React, { useState } from "react";
import { MDBIcon, MDBView, MDBBtn } from "mdbreact";
import Categories from "./categories";

const TopHeader = ({
  title = "",
  category = "",
  didSearch = false,
  hasCategory = false,
  hasPrint = false,
  categories = [],
  handlePrint = () => {},
  setCategory = () => {},
  handleSearch = () => {},
  handleCreate = () => {},
}) => {
  const [isExpanded, setIsExpanded] = useState(false);

  const getSearchValue = () => document.getElementById("search")?.value;

  const handleClick = () => {
    const searchValue = getSearchValue();
    if (!isExpanded) return setIsExpanded(true);
    if (isExpanded && !searchValue) return setIsExpanded(false);
  };

  return (
    <MDBView
      cascade
      className="gradient-card-header blue-gradient narrower py-2 mx-4 mb-3 d-flex justify-content-between align-items-center"
    >
      <div className="d-flex justify-items-center" style={{ width: "20rem" }}>
        <span className="white-text mx-3 text-nowrap mt-2">{title} </span>
        {hasCategory && (
          <Categories
            categories={categories}
            category={category}
            setCategory={setCategory}
          />
        )}
      </div>
      <div>
        <div className="text-right d-flex align-items-center gap-2">
          <input
            className="form-control"
            type="search"
            name="se"
            id="search"
            placeholder="Search..."
            onChange={(e) => {
              if (!e.target.value.trim()) handleSearch(); // Reset kapag walang laman
            }}
            onKeyDown={(e) => {
              if (e.key === "Enter") {
                handleSearch();
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
            type="button"
            size="sm"
            className="px-2"
          >
            <MDBIcon icon={didSearch ? "undo" : "search"} className="mt-0" />
          </MDBBtn>
          {hasPrint && (
            <MDBBtn
              size="sm"
              className="px-2"
              rounded
              color="primary"
              onClick={handlePrint}
            >
              <MDBIcon icon="print" />
            </MDBBtn>
          )}
        </div>
      </div>
    </MDBView>
  );
};

export default TopHeader;
