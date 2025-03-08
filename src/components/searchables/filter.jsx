import React, { useMemo } from "react";
import { debounce } from "lodash";
import { MDBIcon } from "mdbreact";
import "./style.css";

export default function Search({ setFiltered }) {
  const debouncedSearch = useMemo(
    () =>
      debounce((key) => {
        setFiltered(key);
      }, 500),
    [setFiltered]
  ); // dependencies

  const handleChange = (value) => {
    // Debounced search trigger
    debouncedSearch(value);
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
        <button type="submit">
          <MDBIcon fas icon="search" className="search-icon" />
        </button>
      </div>
    </div>
  );
}
