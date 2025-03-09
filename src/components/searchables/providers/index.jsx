import React, { useState } from "react";
import { debounce } from "lodash";
import { useSelector, useDispatch } from "react-redux";
import {
  GETENROLLED,
  RESET,
} from "./../../../services/redux/slices/assets/providers";
import { MDBIcon } from "mdbreact";

import Notification from "./notification";

/**
 * A Search component that allows the user to search for a patient by last name, first name, and middle name.
 * The component will make an API call to search for patients and render a list of results below the search input.
 * The user can select a patient from the list and the setPatient callback will be called with the selected patient.
 * The component also renders a button to register a new patient if no patient record is found with the search key.
 * The setSearchKey callback will be called with the search key when the button is clicked.
 *
 * @param {function} setEnrolled - A callback function that will be called when a patient is selected from the list.
 * @param {function} setRegister - A callback function that will be called when the button to register a new patient is clicked.
 *
 * @returns {JSX.Element} users
 */
export default function Search({ setEnrolled, setRegister }) {
  const [searchKey, setSearchKey] = useState(""),
    [didSearch, setDidSearch] = useState(false),
    { enrolled, isLoading } = useSelector(({ providers }) => providers),
    { token, activePlatform } = useSelector((state) => state.auth),
    dispatch = useDispatch();

  console.log("Searchable providers: ", enrolled);

  // This function is debounced which means it will only be executed after 1000 milliseconds (1 second)
  // of not being called again. This is useful for when the user is typing in the search
  // input quickly and we don't want to make multiple API calls to search for the patient
  // for each keystroke.
  //
  // The function takes a search key as an argument which is the value of the search
  // input. The key is then formatted into an object with last name, first name, and
  // middle name as separate properties. This is because the API endpoint for searching
  // for patients expects the search key to be an object with these properties.
  //
  // The function then dispatches the GETPATIENTS action with the token and the formatted
  // search key as arguments. The GETPATIENTS action will make the API call to search
  // for patients and update the state with the result.
  const debouncedSearch = debounce((searchKey) => {
    const key = formatNameToObj(searchKey);

    dispatch(GETPATIENTS({ token, query: key }));
  }, 1000);

  const handleChange = (e) => {
    const _searchKey = e.target.value;
    setSearchKey(_searchKey);
    const searchKey = _searchKey.split(",");
    const query = {
      vendors: activePlatform?.branchId,
      companyName: searchKey[0],
      name: searchKey[1] ? searchKey[1] : "",
    };
    // setDidSearch(true);
    // return debouncedSearch(query);
    // if (searchKey.length > 1 && searchKey[1].trim()) {
    //   setDidSearch(true);
    //   return debouncedSearch(_searchKey);
    // }
  };

  const handleSelect = (user) => {
    setEnrolled(user);
    setSearchKey("");
    dispatch(RESET());
    setDidSearch(false);
  };

  const handleRegister = () => {
    setSearchKey("");
    dispatch(RESET());
    setDidSearch(false);
  };

  return (
    <div className="d-flex align-items-center">
      <Notification didSearch={didSearch} />
      <div className={`cashier-search ${didSearch && "active"}`}>
        <div className="cashier-search-suggestions">
          {!enrolled?.length ? (
            <small onClick={handleRegister}>No Branch record found...</small>
          ) : (
            // <div className={`searchable-search ${didSearch && "active"}`}>
            //   <div className="searchable-search-suggestions">
            //     {!collections.length ? (
            //       <small onClick={handleRegister}>No Patient Record found...</small>
            <ul>
              {enrolled?.map((provider) => {
                const { _id, name, subName } = provider;

                return (
                  <li onClick={() => handleSelect(provider)} key={_id}>
                    {name}, {subName}
                  </li>
                );
              })}
            </ul>
          )}
        </div>
        <input
          disabled={isLoading}
          value={searchKey}
          onChange={handleChange}
          placeholder="Search..."
          autoCorrect="off"
          spellCheck={false}
        />
        <button type="submit">
          <MDBIcon
            pulse={isLoading}
            icon={isLoading ? "spinner" : didSearch ? "times" : "search"}
            className="search-icon"
          />
        </button>
      </div>
    </div>
  );
}
