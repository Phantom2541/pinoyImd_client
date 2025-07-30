import React, { useState } from "react";
import { HMO } from "../../../../services/fakeDb";

const ITEMS_PER_PAGE = 6;

const Body = ({ filteredHMOs }) => {
  const [currentPage, setCurrentPage] = useState(1);

  const totalItems = filteredHMOs.length;
  const totalPages = Math.ceil(totalItems / ITEMS_PER_PAGE);

  const startIndex = (currentPage - 1) * ITEMS_PER_PAGE;
  const endIndex = startIndex + ITEMS_PER_PAGE;
  const paginatedHMOs = filteredHMOs.slice(startIndex, endIndex);

  const goToNextPage = () => {
    if (currentPage < totalPages) setCurrentPage(currentPage + 1);
  };

  const goToPrevPage = () => {
    if (currentPage > 1) setCurrentPage(currentPage - 1);
  };

  return (
    <div>
      {/* HMO Cards */}
      <div
        className="d-flex justify-content-center align-items-center flex-wrap"
        style={{ gap: "10px", minHeight: "300px" }}
      >
        {paginatedHMOs.map(({ code, name }) => (
          <div className="template6-card" key={code}>
            <div className="template6-card-header">
              <img
                src={HMO.getIcon(code)}
                alt={`${name} Logo`}
                className="template6-card-image"
                style={{ objectFit: "contain" }}
              />
            </div>
            <div className="template6-card-body">
              <span className="template6-card-title">{name}</span>
            </div>
          </div>
        ))}
      </div>

      {/* Pagination Controls */}
      <div className="d-flex justify-content-center mt-3">
        <button
          className="btn btn-outline-primary mr-2"
          onClick={goToPrevPage}
          disabled={currentPage === 1}
        >
          Previous
        </button>
        <span className="align-self-center">
          Page {currentPage} of {totalPages}
        </span>
        <button
          className="btn btn-outline-primary ml-2"
          onClick={goToNextPage}
          disabled={currentPage === totalPages}
        >
          Next
        </button>
      </div>
    </div>
  );
};

export default Body;
