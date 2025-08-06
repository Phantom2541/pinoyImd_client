import React, { useState } from "react";
import Header from "./header";
import Cards from "./cards";
import Description from "./desciption";
import Cart from "./cart"; // ← import cart
import "./style.css";
import collections from "./collections";

export default function Stocks() {
  const [selectedCard, setSelectedCard] = useState(null);
  const [currentPage, setCurrentPage] = useState(1);
  const [searchTerm, setSearchTerm] = useState("");
  const [sortType, setSortType] = useState("");
  const [showCart, setShowCart] = useState(false); // ← NEW state

  const handleSort = (type) => {
    setSortType(type);
    setCurrentPage(1);
  };

  const handleSearch = (term) => {
    setSearchTerm(term);
    setCurrentPage(1);
  };

  const handleCartClick = () => {
    setShowCart(true); // ← show cart
  };

  const handleBack = () => {
    setSelectedCard(null);
    setShowCart(false); // ← hide cart if open
  };

  // 🔍 Filter and sort
  let filteredCollections = collections.filter((item) =>
    item.title.toLowerCase().includes(searchTerm.toLowerCase())
  );

  switch (sortType) {
    case "quantity":
      filteredCollections.sort((a, b) => b.stock - a.stock);
      break;
    case "topSales":
      filteredCollections.sort((a, b) => b.sold - a.sold);
      break;
    case "priceLowHigh":
      filteredCollections.sort((a, b) => a.price - b.price);
      break;
    case "priceHighLow":
      filteredCollections.sort((a, b) => b.price - a.price);
      break;
    default:
      break;
  }

  return (
    <div
      className="d-flex justify-content-center align-items-center flex-column"
      style={{
        maxWidth: "77%",
        margin: "0 auto",
        gap: "10px",
        minWidth: "1040px",
      }}
    >
      <Header
        hideSort={!!selectedCard || showCart}
        onSearch={handleSearch}
        onSort={handleSort}
        sortType={sortType}
        onCartClick={handleCartClick} // ← pass this to header
      />

      {showCart ? (
        <Cart />
      ) : selectedCard ? (
        <Description card={selectedCard} onBack={handleBack} />
      ) : (
        <Cards
          collections={filteredCollections}
          currentPage={currentPage}
          onPageChange={(page) => setCurrentPage(page)}
          onCardClick={(card) => setSelectedCard(card)}
        />
      )}
    </div>
  );
}
