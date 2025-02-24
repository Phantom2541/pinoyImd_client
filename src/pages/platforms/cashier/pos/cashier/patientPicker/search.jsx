import React, { useState} from "react";
import {useSelector, useDispatch} from "react-redux";
import { MDBIcon } from "mdbreact";
import {
  GETPATIENTS,
  RESET,
} from "../../../../../../services/redux/slices/assets/persons/users";
import {formatNameToObj} from "./../../../../../../services/utilities"

export default function Search({
  didSearch,
  children,
  // design
  info = {},
  placeholder = "Fullname Search...",
  searchRef,
}) {
  const {
    message = "Last name, First name y Middle name",
    description = "Please maintain this order when searching.",
  } = info,
  {token} = useSelector(({auth}) => auth),
  [searchKey, setSearchKey] = useState(""),
  {customer} = useSelector(({pos}) => pos),
  dispatch = useDispatch();

    const handleSearchKey = (value) => setSearchKey(value)

    const handleMatch = (e) => {
      e.preventDefault();
      const query = formatNameToObj(searchKey)
      

        dispatch(GETPATIENTS({ token, query }));
        return () => {
          dispatch(RESET());
        };
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
        onSubmit={handleMatch}
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
          onChange={({ target }) => {
            handleSearchKey(target.value);
          }}
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
