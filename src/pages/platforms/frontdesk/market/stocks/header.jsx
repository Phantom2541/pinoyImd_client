import React, { useState, useEffect } from "react";
import { MDBIcon } from "mdbreact";
import "./style.css";
import { useDispatch, useSelector } from "react-redux";
import {
  BROWSE,
  SetPRODUCT,
} from "../../../../../services/redux/slices/commerce/catalog/products";

export default function Header({
  hideSort,
  onSearch,
  onSort,
  onCartClick,
  onBack,
  cartIconRef,
  cartCount = 0,
  primarySort,
  priceSort,
}) {
  const { token, activePlatform } = useSelector(({ auth }) => auth);
  const [searchInput, setSearchInput] = useState("");
  const [animate, setAnimate] = useState(false);
  const dispatch = useDispatch();

  useEffect(() => {
    if (cartCount > 0) {
      setAnimate(false);
      requestAnimationFrame(() => setAnimate(true));
      const timeout = setTimeout(() => setAnimate(false), 500);
      return () => clearTimeout(timeout);
    }
  }, [cartCount]);

  useEffect(() => {
    dispatch(BROWSE({ token, key: { vId: activePlatform?.branchId } }));
  }, [activePlatform, token]);

  const handleKeyDown = (e) => {
    if (e.key === "Enter") onSearch(searchInput);
  };

  const handleSearchClick = () => {
    onSearch(searchInput);
  };

  return (
    <div className="stocks-header">
      <div className="stocks-header-top">
        <div className="header-backSearch-cotnainer">
          <div
            className={`header-back ${onBack ? "active" : ""}`}
            onClick={onBack}
          >
            <MDBIcon fas icon="arrow-left" /> Back
          </div>

          <div className="stocks-header-search">
            <input
              type="search"
              placeholder="Search"
              value={searchInput}
              onChange={(e) => setSearchInput(e.target.value)}
              onKeyDown={handleKeyDown}
            />
            <MDBIcon
              icon="search"
              className="stocks-header-search-icon"
              onClick={handleSearchClick}
              style={{ cursor: "pointer" }}
            />
          </div>
          <button
            onClick={() => dispatch(SetPRODUCT())}
            size="sm"
            style={{
              marginRight: "-5px",
            }}
            className="search-add-btn ml-2"
          >
            <MDBIcon icon="plus" />
          </button>
        </div>

        <div className="stocks-header-cart">
          <button
            ref={cartIconRef}
            className={`stocks-header-cartBtn ${animate ? "cart-animate" : ""}`}
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
              className={primarySort === "quantity" ? "active" : ""}
              onClick={() => onSort("quantity")}
            >
              Quantity
            </button>
            <button
              className={primarySort === "topSales" ? "active" : ""}
              onClick={() => onSort("topSales")}
            >
              Top Sales
            </button>

            <div className="stocks-sort-options">
              <span className="stocks-sort-options-label">
                Price
                {priceSort === "priceLowHigh"
                  ? ": Low to High"
                  : priceSort === "priceHighLow"
                  ? ": High to Low"
                  : ""}
              </span>
              <MDBIcon icon="angle-down" className="stocks-sort-options-icon" />
              <div className="stocks-sort-options-list">
                <span
                  className={priceSort === "priceLowHigh" ? "active" : ""}
                  onClick={() => onSort("priceLowHigh")}
                >
                  Price: Low to High
                </span>
                <span
                  className={priceSort === "priceHighLow" ? "active" : ""}
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
