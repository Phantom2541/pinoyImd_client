import React, { useState } from "react";
import { MDBIcon } from "mdbreact";
import Description from "./desciption";

export default function Cards({ collections }) {
  const [currentPage, setCurrentPage] = useState(1);
  const [selectedCard, setSelectedCard] = useState(null); // <-- para sa description view
  const itemsPerPage = 12;
  const totalPages = Math.ceil(collections.length / itemsPerPage);

  const indexOfLastItem = currentPage * itemsPerPage;
  const indexOfFirstItem = indexOfLastItem - itemsPerPage;
  const currentItems = collections.slice(indexOfFirstItem, indexOfLastItem);

  const handlePageChange = (page) => {
    if (page >= 1 && page <= totalPages) {
      setCurrentPage(page);
    }
  };

  const pageNumbers = [];
  for (let i = 1; i <= totalPages; i++) {
    if (
      i === 1 ||
      i === totalPages ||
      (i >= currentPage - 1 && i <= currentPage + 1)
    ) {
      pageNumbers.push(i);
    } else if (pageNumbers[pageNumbers.length - 1] !== "...") {
      pageNumbers.push("...");
    }
  }

  // ✅ Kapag may napiling card, Description view ang lalabas
  if (selectedCard) {
    return (
      <Description card={selectedCard} onBack={() => setSelectedCard(null)} />
    );
  }

  return (
    <div className="stock-cards-wrapper">
      <div className="stock-cards-container">
        {currentItems.map((item) => (
          <div
            className="stock-cards"
            key={item.id}
            onClick={() => setSelectedCard(item)} // ✅ dito siya magse-set
            style={{ cursor: "pointer" }}
          >
            <img src={item.image[0]} alt={item.title} />
            <div className="stock-cards-body">
              <div className="stock-cards-info">
                <span className="stock-cards-title">{item.title}</span>
                <span className="stock-cards-price">${item.price}</span>
                <span className="stock-cards-discount">{item.discount}</span>
              </div>
              <div className="stock-cards-stats">
                <span className="stock-cards-star">★</span>
                <span className="stock-cards-rating">{item.rating}</span>
                <span className="stock-cards-sold">{item.sold} sold/month</span>
              </div>
            </div>
          </div>
        ))}
      </div>

      <div className="stock-cards-pagination">
        <button onClick={() => handlePageChange(currentPage - 1)}>
          <MDBIcon fas icon="angle-left" />
        </button>

        {pageNumbers.map((num, index) =>
          num === "..." ? (
            <button key={index} disabled>
              ...
            </button>
          ) : (
            <button
              key={index}
              className={currentPage === num ? "active" : ""}
              onClick={() => handlePageChange(num)}
            >
              {num}
            </button>
          )
        )}

        <button onClick={() => handlePageChange(currentPage + 1)}>
          <MDBIcon fas icon="angle-right" />
        </button>
      </div>
    </div>
  );
}
