import React from "react";
import { useSelector, useDispatch } from "react-redux";
import { MDBIcon } from "mdbreact";
import { SETPATIENT } from "../../../../../../services/redux/slices/commerce/pos";
export default function Search({
  searchKey,
  setSearchKey,
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

  const { customer } = useSelector(({ pos }) => pos),
    dispatch = useDispatch();

  const handleSearch = (e) => {
    e.preventDefault();

    if (didSearch && searchKey) setSearchKey("");

    if (!didSearch && customer?._id) dispatch(SETPATIENT({}));

    // setDidSearch(!didSearch);
  };

  return (
    <div
      className={`cashier-search-cotaniner ${
        customer?._id && "pickedSearched"
      }`}
    >
      <div className={`cashier-instruction ${customer?._id && "hide"}`}>
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
          customer?._id && "pickedSearch"
        }`}
      >
        <div className="cashier-search-suggestions">
          <ul className="text-dark">{children}</ul>
        </div>
        <input
          ref={searchRef}
          placeholder={placeholder}
          value={searchKey}
          onChange={({ target }) => setSearchKey(target.value)}
          autoCorrect="off"
          spellCheck={false}
        />
        <button
          type="submit"
          className={`${(didSearch || customer?._id) && "bg-danger"}`}
        >
          <MDBIcon
            icon={didSearch || customer?._id ? "times" : "search"}
            className="search-icon"
          />
        </button>
      </form>
    </div>
  );
}
