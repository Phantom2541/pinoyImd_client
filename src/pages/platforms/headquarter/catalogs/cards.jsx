import React from "react";
import { MDBIcon } from "mdbreact";
import { useSelector } from "react-redux";

export default function Cards({
  currentPage,
  onPageChange,
  onCardClick,
}) {
  const { collections } = useSelector(({ products }) => products);

  const itemsPerPage = 12;
  const totalPages = Math.ceil(collections.length / itemsPerPage);
  const indexOfLastItem = currentPage * itemsPerPage;
  const currentItems = collections.slice(
    indexOfLastItem - itemsPerPage,
    indexOfLastItem
  );
  console.log("collections", collections);
  

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
        {collections.map((item, index) => (
          <div
            className="stock-cards"
            key={item.id}
            onClick={() => onCardClick(item)}
            style={{ cursor: "pointer" }}
          >
            <img src={""} alt={item.pid.name} />
            <div className="stock-cards-body">
              <div className="stock-cards-info">
                <span className="stock-cards-title">{item.pid.name}</span>
                <span className="stock-cards-price">
                  ₱{Math.round(item.u * (1 - item.discount / 100))}
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
