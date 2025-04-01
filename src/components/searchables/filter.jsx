import React, { useMemo, useState } from "react";
import { debounce } from "lodash";
import { MDBIcon } from "mdbreact";
import "./style.css";

export default function Search({ setFiltered, isLoading }) {
  const [didSearch, setDidSearch] = useState(false);
  const debouncedSearch = useMemo(() => {
    const searchFn = debounce((key) => {
      setFiltered(key);
    }, 500);

    return searchFn;
  }, [setFiltered]); // dependencies

  const handleChange = (value) => {
    if (!value) {
      debouncedSearch.cancel();
      setFiltered("");
      setDidSearch(false);
    } else {
      setDidSearch(true);
      debouncedSearch(value);
    }
  };

  return (
    <div className="searchable-search-cotaniner">
      <div className="searchable-search">
        <input
          placeholder="Search patients..."
          onChange={({ target }) => handleChange(target.value)}
          autoCorrect="off"
          id="patient-search"
          spellCheck={false}
        />
        <button
          type="submit"
          disabled={isLoading}
          className={didSearch ? "bg-danger" : ""}
          onClick={() => {
            if (didSearch) {
              setDidSearch(false);
              setFiltered("");
              document.getElementById("patient-search").value = "";
            }
          }}
        >
          <MDBIcon
            icon={didSearch ? "times" : "search"}
            className="search-icon"
          />
        </button>
      </div>
    </div>
  );
}
