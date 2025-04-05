import React, { useMemo, useState } from "react";
import { debounce } from "lodash";
import "./search.css";
import { globalSearch } from "../../services/utilities";

export default function Search({ collection = [], handleFiltered, reset }) {
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
  );
}
