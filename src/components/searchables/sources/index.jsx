import React, { useEffect, useState } from "react";
import { debounce } from "lodash";
import { useSelector, useDispatch } from "react-redux";
import {
  SEARCH,
  RESET,
} from "./../../../services/redux/slices/assets/branches";
import { MDBIcon } from "mdbreact";
import { globalSearch } from "./../../../services/utilities";
import Notification from "./notifications";
import {
  SetSEARCHRESULTS,
  ToggleDidSearch,
} from "../../../services/redux/slices/assets/providers";

/**
 * A Search component that allows the user to search for a patient by last name, first name, and middle name.
 * The component will make an API call to search for patients and render a list of results below the search input.
 * The user can select a patient from the list and the setPhysician callback will be called with the selected patient.
 * The component also renders a button to register a new patient if no patient record is found with the search key.
 * The setSearchKey callback will be called with the search key when the button is clicked.
 *
 * @param {function} setPhysician - A callback function that will be called when a patient is selected from the list.
 * @param {function} setRegister - A callback function that will be called when the button to register a new patient is clicked.
 *
 * @returns {JSX.Element} users
 */

export default function Search({ setSource = () => {} }) {
  const { token } = useSelector((state) => state.auth),
    { collections, isLoading } = useSelector(({ branches }) => branches),
    { collections: providerCollections } = useSelector(
      ({ providers }) => providers
    ),
    [results, setResults] = useState([]),
    [searchInDB, setSearchInDB] = useState(false),
    [searchKey, setSearchKey] = useState(""),
    [didSearch, setDidSearch] = useState(false),
    dispatch = useDispatch();

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

  useEffect(() => {
    const removeExisting = collections.filter(
      (item) =>
        !providerCollections.some(
          ({ clients = { _id: "" } }) => clients?._id === item?._id
        )
    );
    setResults(removeExisting || []);
  }, [collections, providerCollections]);

  const debouncedSearch = debounce((searchKey) => {
    // search result from redux
    const searchResultProviders = globalSearch(providerCollections, searchKey);
    // console.log(searchResultProviders);

    dispatch(SetSEARCHRESULTS(searchResultProviders));
    setSearchInDB(false);
    if (searchResultProviders.length === 0) {
      dispatch(ToggleDidSearch());
      dispatch(SEARCH({ token, key: searchKey }));
      setSearchInDB(true);
    }
  }, 1000);

  const handleChange = (e) => {
    const _searchKey = e.target.value;
    setSearchKey(_searchKey);
    setDidSearch(_searchKey ? true : false);
    return debouncedSearch(_searchKey);
  };

  console.log(searchInDB);

  const handleSelect = (selected) => {
    setSource(selected);
    setSearchKey("");
    dispatch(RESET());
    setDidSearch(false);
  };

  const handleSubmit = () => {
    if (!didSearch) return;
    setDidSearch(false);
    setResults([]);
    setSearchKey("");
    dispatch(ToggleDidSearch(false));
  };

  return (
    <div className="d-flex align-items-center">
      <Notification didSearch={didSearch} />
      <div
        className={`searchable-search ${didSearch && searchInDB && "active"}`}
      >
        <div className="searchable-search-suggestions">
          {!results?.length ? (
            <div>
              <small>No Company Found In Database...</small>
            </div>
          ) : (
            <ul>
              <span className="text-dark mb-2 text-nowrap">
                {isLoading
                  ? "Searching from database"
                  : "External provider, not in your records"}
              </span>
              {results?.map((result) => {
                const { _id, name, isGhost = false, companyName } = result;

                return (
                  <li
                    onClick={() => handleSelect(result)}
                    key={_id}
                    className="d-flex text-dark"
                    title={
                      isGhost
                        ? "This is a ghost physician not register as a user"
                        : ""
                    }
                  >
                    <MDBIcon
                      icon="database"
                      className="mr-2"
                      style={{ color: "blue" }}
                    />
                    <small>{`${name} ${companyName}`}</small>
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
        <button
          type="submit"
          onClick={handleSubmit}
          className={didSearch && !isLoading ? "bg-danger" : "bg-primary"}
          rounded
        >
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
