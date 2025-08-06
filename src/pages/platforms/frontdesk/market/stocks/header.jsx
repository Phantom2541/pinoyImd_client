import React, { useState } from "react";
import { MDBIcon } from "mdbreact";
import "./style.css";

export default function Header({
  hideSort,
  onSearch,
  onSort,
  sortType,
  onCartClick,
  onBack,
  cartIconRef,
  cartCount = 0,
}) {
  const [searchInput, setSearchInput] = useState("");

  const handleKeyDown = (e) => {
    if (e.key === "Enter") {
      onSearch(searchInput);
    }
  };

  const handleSearchClick = () => {
    onSearch(searchInput);
  };

  return (
    <div className="stocks-header">
      <div className="stocks-header-top">
        <div className="header-backSearch-cotnainer">
          <div className={`header-back ${onBack && "active"}`} onClick={onBack}>
            <MDBIcon fas icon="arrow-left" /> Back
          </div>

          <div className="stocks-header-search">
            <input
              type="search"
              placeholder="Search"
              value={searchInput}
              onChange={(e) => setSearchInput(e.target.value)}
              onKeyDown={handleKeyDown} // ← detect ENTER key
            />
            <MDBIcon
              icon="search"
              className="stocks-header-search-icon"
              onClick={handleSearchClick} // ← detect icon click
              style={{ cursor: "pointer" }}
            />
          </div>
        </div>
        <div className="stocks-header-cart">
          <button
            ref={cartIconRef}
            className="stocks-header-cartBtn"
            onClick={onCartClick}
          >
            <MDBIcon fas icon="shopping-cart" />
          </button>
          <span>{cartCount > 99 ? "99+" : cartCount}</span>
        </div>
      </div>

      {!hideSort && (
        <div className="stocks-header-sort">
          <div className="stocks-sort">
            <span>Sort by</span>
            <button
              className={sortType === "quantity" ? "active" : ""}
              onClick={() => onSort("quantity")}
            >
              Quantity
            </button>
            <button
              className={sortType === "topSales" ? "active" : ""}
              onClick={() => onSort("topSales")}
            >
              Top Sales
            </button>
            <div className="stocks-sort-options">
              <span className="stocks-sort-options-label">
                Price
                {sortType === "priceLowHigh"
                  ? ": Low to High"
                  : ": High to Low"}
              </span>
              <MDBIcon icon="angle-down" className="stocks-sort-options-icon" />
              <div className="stocks-sort-options-list">
                <span
                  className={sortType === "priceLowHigh" ? "active" : ""}
                  onClick={() => onSort("priceLowHigh")}
                >
                  Price: Low to High
                </span>
                <span
                  className={sortType === "priceHighLow" ? "active" : ""}
                  onClick={() => onSort("priceHighLow")}
                >
                  Price: High to Low
                </span>
              </div>
            </div>
          </div>
        </div>
      )}
    </div>
  );
}
