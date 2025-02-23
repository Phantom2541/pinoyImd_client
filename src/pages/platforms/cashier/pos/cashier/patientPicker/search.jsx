import { MDBIcon } from "mdbreact";
import React from "react";

export default function Search({
  handleSearch,
  searchKey,
  setSearchKey,
  selected,
  didSearch,
  // choices map
  children,
  // design
  info = {},
  placeholder = "Fullname Search...",
  searchRef,
}) {
  const {
    message = "Last name, First name y Middle name",
    description = "Please maintain this order when searching.",
  } = info;

  return (
    <div
      className={`cashier-search-cotaniner ${
        selected?._id && "pickedSearched"
      }`}
    >
      <div className={`cashier-instruction ${selected?._id && "hide"}`}>
        <MDBIcon
          icon="info-circle"
          size="lg"
          className="text-info cursor-pointer"
        />
        <div>
          <p>{message}</p>
          <i>{description}</i>
        </div>
      </div>
      <form
        onSubmit={handleSearch}
        className={`cashier-search ${didSearch && "active"} ${
          selected?._id && "pickedSearch"
        }`}
      >
        <div className="cashier-search-suggestions">
          <ul className="text-dark">{children}</ul>
        </div>
        <input
          ref={searchRef}
          placeholder={placeholder}
          value={searchKey}
          onChange={({ target }) => {
            //console.log('target.value',target.value);

            setSearchKey(target.value);
          }}
          autoCorrect="off"
          spellCheck={false}
        />
        <button
          type="submit"
          className={`${(didSearch || selected?._id) && "bg-danger"}`}
        >
          <MDBIcon
            icon={didSearch || selected?._id ? "times" : "search"}
            className="search-icon"
          />
        </button>
      </form>
    </div>
  );
}
