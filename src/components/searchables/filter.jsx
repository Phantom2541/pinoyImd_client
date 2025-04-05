import React, { useMemo, useState } from "react";
import { debounce } from "lodash";
import { MDBIcon } from "mdbreact";
import "./style.css";
import { globalSearch } from "../../services/utilities";

export default function Search({
  isLoading,
  collection = [],
  handleFiltered,
  handleAdd,
  reset,
}) {
  const [query, setQuery] = useState("");
  const [filteredItems, setFilteredItems] = useState([]);
  const [didSearch, setDidSearch] = useState(false);

  const debouncedSearch = useMemo(() => {
    return debounce((key) => {
      const items = globalSearch(collection, key);
      setFilteredItems(items);
      handleFiltered(items);
    }, 300);
  }, [collection, handleFiltered]);

  const handleChange = (value) => {
    setQuery(value);
    if (!value) {
      debouncedSearch.cancel();
      setFilteredItems([]);
      setDidSearch(false);
      reset();
    } else {
      setDidSearch(true);
      debouncedSearch(value);
    }
  };

  const handleClear = () => {
    setQuery("");
    setFilteredItems([]);
    setDidSearch(false);
    document.getElementById("item-search").value = "";
    reset();
  };

  return (
    <div className="searchable-search-cotaniner">
      <div className="searchable-search">
        <input
          placeholder="Search..."
          onChange={({ target }) => handleChange(target.value)}
          autoCorrect="off"
          id="item-search"
          spellCheck={false}
        />
        <button
          type="submit"
          disabled={isLoading}
          className={didSearch ? "bg-danger" : ""}
          onClick={handleClear}
        >
          <MDBIcon
            icon={didSearch ? "times" : "search"}
            className="search-icon"
          />
        </button>
      </div>

      {didSearch && filteredItems.length === 0 && (
        <div className="search-results">
          <div className="no-results">
            <p>
              No results found for <strong>"{query}"</strong>.
            </p>
            <button
              onClick={() => handleAdd(query)}
              className="btn btn-sm btn-primary"
            >
              Add "{query}"
            </button>
          </div>
        </div>
      )}
    </div>
  );
}
