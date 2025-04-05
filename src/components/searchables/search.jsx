import React, { useMemo, useState } from "react";
import { debounce } from "lodash";
import "./search.css";
import { globalSearch } from "../../services/utilities";
import { MDBBtn, MDBIcon } from "mdbreact";

export default function Search({
  collection = [],
  handleFiltered,
  reset,
  handleAdd,
}) {
  const debouncedSearch = useMemo(() => {
    return debounce((key) => {
      const items = globalSearch(collection, key);
      handleFiltered(items);
    }, 300);
  }, [collection, handleFiltered]);

  const handleChange = (value) => {
    if (!value) {
      debouncedSearch.cancel();
      reset();
    } else {
      debouncedSearch(value);
    }
  };

  return (
    <div className="d-flex align-items-center">
      <div className="search-container">
        <input
          placeholder="Search..."
          onChange={({ target }) => handleChange(target.value)}
          autoCorrect="off"
          className="search"
          type="search"
          id="item-search"
          spellCheck={false}
        />
      </div>
      <MDBBtn
        size="sm"
        color="white"
        rounded
        className="px-2 ml-3"
        onClick={handleAdd}
      >
        <MDBIcon icon="plus" />
      </MDBBtn>
    </div>
  );
}
