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
  withCreate = false,
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
      {withCreate && (
        <MDBBtn onClick={handleAdd} size="sm" color="primary">
          <MDBIcon icon="plus" />
        </MDBBtn>
      )}
    </div>
  );
}
