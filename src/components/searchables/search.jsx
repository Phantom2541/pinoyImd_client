import React, { useEffect, useMemo, useState } from "react";
import { debounce, isArrayLikeObject } from "lodash";
import "./search.css";
import { globalSearch } from "../../services/utilities";
import { MDBBtn, MDBIcon } from "mdbreact";

export default function Search({
  collections = [],
  hideButton = true,
  haveAction = true,
  setFiltered = () => {},
  reset = () => {},
  handleAdd = () => {},
}) {
  const [showBtn, setShowBtn] = useState(false),
    [searchValue, setSearchValue] = useState("");
 

  useEffect(() => {
    if (!hideButton) setShowBtn(true);
  }, [hideButton]);
  const debouncedSearch = useMemo(() => {
    return debounce((key) => {
      console.log("key", key);
      // console.log("collections", collections);

      const items = globalSearch(collections, key);
      // if (hideButton && items.length === 0) setShowBtn(true);
      // if (hideButton && items.length > 0) setShowBtn(false);
      console.log("items", items);

      setFiltered(items);
    }, 300);
  }, [collections, setFiltered, hideButton]);

  const handleChange = (value) => {
    console.log("value", value);

    if (!value) {
      debouncedSearch.cancel();
      if (hideButton) setShowBtn(false);
      reset();
    } else {
      debouncedSearch(value);
    }
    setSearchValue(value);
  };

  return (
    <div className="d-flex align-items-center transition-all">
      <div
        className="search-container"
        style={{ marginRight: haveAction && !showBtn && "-35px" }}
      >
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
      {haveAction && (
        <MDBBtn
          onClick={() => handleAdd(searchValue)}
          size="sm"
          style={{
            opacity: showBtn ? 1 : 0,
            marginRight: "-5px",
          }}
          color="white"
          rounded
          className="px-2 ml-3"
        >
          <MDBIcon icon="plus" />
        </MDBBtn>
      )}
    </div>
  );
}
