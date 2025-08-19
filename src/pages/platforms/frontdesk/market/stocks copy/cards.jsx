import React from "react";
import { MDBIcon } from "mdbreact";

export default function Cards({
  collections,
  currentPage,
  onPageChange,
  onCardClick,
}) {
  const itemsPerPage = 12;
  const totalPages = Math.ceil(collections.length / itemsPerPage);
  const indexOfLastItem = currentPage * itemsPerPage;
  const currentItems = collections.slice(
    indexOfLastItem - itemsPerPage,
    indexOfLastItem
  );

  const pageNumbers = [];
  for (let i = 1; i <= totalPages; i++) {
    if (
      i === 1 ||
      i === totalPages ||
      (i >= currentPage - 1 && i <= currentPage + 1)
    ) {
      pageNumbers.push(i);
    } else if (pageNumbers.at(-1) !== "...") {
      pageNumbers.push("...");
    }
  }

  return (
    <div className="stock-cards-wrapper">
      <div className="stock-cards-container">
        {currentItems.map((item) => (
          <div
            className="stock-cards"
            key={item.id}
            onClick={() => onCardClick(item)}
            style={{ cursor: "pointer" }}
          >
            <img src={item.image[0]} alt={item.title} />
            <div className="stock-cards-body">
              <div className="stock-cards-info">
                <span className="stock-cards-title">{item.title}</span>
                <span className="stock-cards-price">
                  ₱{Math.round(item.price * (1 - item.discount / 100))}
                  {item.discount > 0 && (
                    <span className="stock-cards-original">
                      &nbsp;₱{item.price}
                    </span>
                  )}
                </span>
                {item.discount > 0 && (
                  <span className="stock-cards-discount">
                    {item.discount}% off
                  </span>
                )}
              </div>
              <div className="stock-cards-stats">
                <span className="stock-cards-star">★</span>
                <span className="stock-cards-rating">{item.rating}</span>
                <span className="stock-cards-sold">{item.sold} sold/month</span>
              </div>
              <span className="stock-cards-location">
                <MDBIcon fas icon="map-marker-alt" />
                {item.location}
              </span>
            </div>
          </div>
        ))}
      </div>

      <div className="stock-cards-pagination">
        <button
          onClick={() => onPageChange(currentPage - 1)}
          disabled={currentPage === 1}
        >
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
              onClick={() => onPageChange(num)}
            >
              {num}
            </button>
          )
        )}

        <button
          onClick={() => onPageChange(currentPage + 1)}
          disabled={currentPage === totalPages}
        >
          <MDBIcon fas icon="angle-right" />
        </button>
      </div>
    </div>
  );
}
