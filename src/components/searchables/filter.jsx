import React, { useState, useMemo } from "react";
import { debounce } from "lodash";
import { MDBIcon } from "mdbreact";
import "./style.css";

export default function Search({ setFiltered }) {
  const [searchKey, setSearchKey] = useState("");

  const debouncedSearch = useMemo(
    () =>
      debounce((key) => {
        setFiltered(key);
      }, 500),
    [searchKey]
  ); // dependencies

  const handleChange = (value) => {
    // Debounced search trigger
    debouncedSearch(value);
    setSearchKey(value);
  };

  const handleClear = () => {
    setSearchKey(""); // Clear the search key
  };

  return (
    <div className="searchable-search-cotaniner ">
      <div className={`searchable-search`}>
        <input
          placeholder="Search menus..."
          onChange={({ target }) => handleChange(target.value)}
          autoCorrect="off"
          spellCheck={false}
        />
        <button type="submit" onClick={handleClear}>
          <MDBIcon fas icon="search" className="search-icon" />
        </button>
      </div>
    </div>
  );
}
