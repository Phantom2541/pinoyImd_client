import React from "react";
import { useSelector } from "react-redux";
import { MDBIcon } from "mdbreact";

const Search = ({ searchKey, setSearchKey, didSearch }) => {
  const { isLoading } = useSelector(({ sales }) => sales);
  return (
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
      <di className="cashier-search">
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
      </di>
    </div>
  );
};

export default Search;
