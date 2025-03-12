import React from "react";
import { MDBBtn, MDBIcon } from "mdbreact";
import { useSelector } from "react-redux";

export default function Header({
  handleCreate,
  handleSearch,
  didSearch,
  searchKey,
  setSearchKey,
}) {
  const { isLoading } = useSelector(({ users }) => users);

  return (
    <div className="d-flex align-items-center justify-content-between">
      <MDBBtn onClick={handleCreate} size="sm" color="primary">
        <MDBIcon icon="plus" />
      </MDBBtn>
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
