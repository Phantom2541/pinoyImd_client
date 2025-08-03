import React from "react";
import { MDBIcon } from "mdbreact";
import "./style.css";

export default function Header() {
  return (
    <div className="stocks-header">
      <div className="stocks-header-top">
        <div className="stocks-header-search">
          <input type="search" placeholder="Search" />
          <MDBIcon icon="search" className="stocks-header-search-icon" />
        </div>
        <div className="stocks-header-cart">
          <button className="stocks-header-cartBtn">
            <MDBIcon fas icon="shopping-cart" />
          </button>
          <span>101</span>
        </div>
      </div>
      <div className="stocks-header-sort">
        <div className="stocks-sort">
          <span>Sort by</span>
          <button>Quantity</button>
          <select>
            <option>Price: Low to High</option>
            <option>Price: High to Low</option>
          </select>
        </div>
      </div>
    </div>
  );
}
