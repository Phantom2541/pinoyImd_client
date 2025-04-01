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
import "./style.css";
import SummaryLoading from "../../../pages/platforms/cashier/cashRegistry/services/deals/summary/loading";
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

export default function Search({
  setSource = () => {},
  handleRegister = () => {},
}) {
  const { token } = useSelector((state) => state.auth),
    { collections, isLoading, isSuccess } = useSelector(
      ({ branches }) => branches
    ),
    { collections: providerCollections = [], searchResults } = useSelector(
      ({ providers }) => providers
    ),
    [results, setResults] = useState([]),
    [isFetch, setIsFetch] = useState(true),
    // [searchInDB, setSearchInDB] = useState(false),
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
  console.log(providerCollections, "providerCollections");
  useEffect(() => {
    const removeExisting = collections?.filter(
      (item) =>
        !providerCollections?.some(
          ({ clients = { _id: "" } }) => clients?._id === item?._id
        )
    );
    setResults(removeExisting || []);
  }, [collections, providerCollections]);

  useEffect(() => {
    if (!isLoading && isSuccess) {
      setIsFetch(false);
      dispatch(RESET());
    }
  }, [isSuccess, isLoading, dispatch]);

  const debouncedSearch = debounce((searchKey) => {
    // search result from redux
    const searchResultProviders = globalSearch(providerCollections, searchKey);
    // console.log(searchResultProviders);
    dispatch(SetSEARCHRESULTS(searchResultProviders));
    // setSearchInDB(false);
    // if (searchResultProviders.length === 0) {
    dispatch(SEARCH({ token, key: searchKey }));
    // setSearchInDB(true);
    // }
    setIsFetch(true);
  }, 1000);

  const handleChange = (e) => {
    const _searchKey = e.target.value;
    setSearchKey(_searchKey);
    setDidSearch(_searchKey ? true : false);
    dispatch(ToggleDidSearch(_searchKey ? true : false));

    return debouncedSearch(_searchKey);
  };

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
      <div className={`sources-search ${didSearch && "active"}`}>
        <div className="sources-search-suggestions">
          {!results?.length && !isFetch ? (
            <div>
              <small className="grey-text">
                No branch found In Database...
              </small>
              {searchResults.length <= 0 && (
                <h6 className="text-dark">
                  <p>
                    <span
                      className="text-primary mr-1 cursor-pointer"
                      onClick={() => {
                        handleRegister(searchKey);
                        setDidSearch(false);
                        setSearchKey("");
                      }}
                      style={{ textDecoration: "underline" }}
                    >
                      Click here
                    </span>
                    to register a branch
                  </p>
                </h6>
              )}
            </div>
          ) : (
            <ul>
              <span className="grey-text mb-2 text-nowrap">
                {isLoading
                  ? "Searching from database"
                  : !isFetch && "External provider, not in your records"}
              </span>
              {!isLoading ? (
                <>
                  {results?.map((result) => {
                    const { _id, name, isGhost = false, displayname } = result;
                    const _name = `${name || ""}  ${displayname || ""}`;

                    return (
                      <li
                        onClick={() => handleSelect(result)}
                        key={_id}
                        className="d-flex"
                        title={
                          isGhost
                            ? "This is a ghost physician not register as a user"
                            : ""
                        }
                      >
                        <MDBIcon icon="database" className="mr-2 mt-1" />
                        <small>{_name}</small>
                      </li>
                    );
                  })}
                </>
              ) : (
                <SummaryLoading className={"mt-2"} rowCount={4} />
              )}
            </ul>
          )}
        </div>
        <input
          value={searchKey}
          onChange={handleChange}
          placeholder="Search..."
          autoCorrect="off"
          spellCheck={false}
        />
        <button
          type="submit"
          onClick={handleSubmit}
          className={didSearch ? "bg-danger" : "bg-primary"}
          rounded
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
