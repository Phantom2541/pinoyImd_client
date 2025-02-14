import React from "react";
import { MDBIcon } from "mdbreact";
import { useSelector } from "react-redux";

const choices = ["All", "Inhouse", "Insource", "Sendout"];

export default function Header({
  length,
  view,
  setView,
  handleSearch,
  searchKey,
  setSearchKey,
  didSearch,
}) {
  const { isLoading } = useSelector(({ sales }) => sales);

  return (
    <div className="d-flex justify-content-between align-items-center">
      <div className="d-flex align-items-center">
        <select
          disabled={isLoading}
          value={view}
          onChange={({ target }) => setView(target.value)}
          className="form-control w-auto cursor-pointer pr-5"
        >
          {choices?.map((choice, index) => {
            return (
              <option
                value={choice}
                key={`choices${index}`}
                className="text-capitalize"
              >
                {choice}
              </option>
            );
          })}
        </select>
        <div className="d-flex justify-content-center align-items-center ml-3 fw-bold">
          <span>Total - </span>
          <h4 className="mb-0 ml-3"> {length}</h4>
        </div>
      </div>
      <div className="cashier-search-cotaniner">
        <div className="cashier-instruction">
          <MDBIcon
            icon="info-circle"
            size="lg"
            className="text-info cursor-pointer"
          />
          <div>
            <p>Last name, First name y Middle name</p>
            <i>Please maintain this order when searching.</i>
          </div>
        </div>
        <form onSubmit={handleSearch} className="cashier-search">
          <input
            disabled={isLoading}
            value={searchKey}
            onChange={({ target }) => setSearchKey(target.value)}
            placeholder="Search..."
            autoCorrect="off"
            spellCheck={false}
          />
          <button type="submit">
            <MDBIcon
              pulse={isLoading}
              icon={isLoading ? "spinner" : didSearch ? "times" : "search"}
              className="search-icon"
            />
          </button>
        </form>
      </div>
    </div>
  );
}
