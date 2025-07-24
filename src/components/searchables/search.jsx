import { useEffect, useMemo, useState } from "react";
import { debounce } from "lodash";
import "./search.css";
import { globalSearch } from "../../services/utilities";
import { MDBIcon } from "mdbreact";

export default function Search({
  collections = [],
  hideButton = false,
  haveAction = true,
  setFiltered = () => {},
  reset = () => {},
  handleAdd = () => {},
}) {
  const [showBtn, setShowBtn] = useState(false),
    [searchValue, setSearchValue] = useState("");

  useEffect(() => {
    if (!hideButton && haveAction) setShowBtn(true);
  }, [hideButton, haveAction]);

  const debouncedSearch = useMemo(() => {
    return debounce((key) => {
      const items = globalSearch(collections, key);
      if (hideButton && items.length === 0) setShowBtn(true);
      if (hideButton && items.length > 0) setShowBtn(false);
      setFiltered(items);
    }, 300);
  }, [collections, setFiltered, hideButton]);

  const handleChange = (value) => {
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
        <MDBIcon
          style={{ color: "#888", fontSize: "1rem" }}
          fas
          icon="search"
        />
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
      {(haveAction || showBtn) && (
        <button
          onClick={() => handleAdd(searchValue)}
          size="sm"
          style={{
            opacity: showBtn ? 1 : 0,
            marginRight: "-5px",
          }}
          // color="white"
          className="search-add-btn ml-2"
        >
          <MDBIcon icon="plus" />
        </button>
      )}
    </div>
  );
}
