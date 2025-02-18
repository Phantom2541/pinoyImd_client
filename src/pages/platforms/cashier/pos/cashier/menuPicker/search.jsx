import React, { useState, useEffect } from "react";
import { useDispatch, useSelector } from "react-redux";

import { MDBIcon } from "mdbreact";

import { BROWSE as MENUS } from "../../../../../../services/redux/slices/commerce/menus";
import { SETMENUS } from "../../../../../../services/redux/slices/commerce/checkout";

export default function Search({
  selected,
  didSearch,
  // choices map
  children,
  searchRef,
}) {
  const { category, privilege, cart, customer, menus } = useSelector(
      ({ checkout }) => checkout
    ),
    { collections } = useSelector(({ menus }) => menus),
    { token, auth } = useSelector(({ auth }) => auth),
    [searchKey, setSearchKey] = useState(""),
    dispatch = useDispatch();

  useEffect(() => {
    dispatch(MENUS({ token, key: { branchId: "637097f0535529a3a57e933e" } }));
  }, [searchKey, token]);
  useEffect(() => {
    dispatch(SETMENUS(collections));
  }, [collections]);

  const handleSearch = (e) => {
    e.preventDefault();

    if (didSearch && searchKey) setSearchKey("");

    // setDidSearch(!didSearch);
  };

  const handeSearchKey = (e) => setSearchKey(e.target.value);

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
          <p>Search your menus</p>
          <i>You can search by name or abbreviation.</i>
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
          placeholder="Menu Search.."
          value={searchKey}
          onChange={handeSearchKey}
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
