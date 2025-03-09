import React, { useState } from "react";
import { debounce } from "lodash";
import { useSelector, useDispatch } from "react-redux";
import {
  SEARCH,
  RESET,
} from "./../../../services/redux/slices/assets/branches";
import { MDBIcon } from "mdbreact";
import {
  getGenderIcon,
  getPhysicianGenderIcon,
  globalSearch,
} from "./../../../services/utilities";
import Notification from "./notifications";
import { SetSEARCHRESULTS } from "../../../services/redux/slices/assets/providers";

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

export default function Search({ setPhysician }) {
  const [searchKey, setSearchKey] = useState(""),
    [didSearch, setDidSearch] = useState(false),
    { isLoading } = useSelector(({ branches }) => branches),
    { collections: providerCollections } = useSelector(
      ({ providers }) => providers
    ),
    [results, setResults] = useState([]),
    { token } = useSelector((state) => state.auth),
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

  // useEffect(() => {
  //   setSearchResults(collections || []);
  // }, [collections]);

  const debouncedSearch = debounce((searchKey) => {
    // search result from redux
    const searchResultProviders = globalSearch(providerCollections, searchKey);
    // console.log(searchResultProviders);

    dispatch(SetSEARCHRESULTS(searchResultProviders));

    if (searchResultProviders.length < 0) {
      dispatch(SEARCH({ token, key: searchKey }));
    }
  }, 1000);
  const handleChange = (e) => {
    const _searchKey = e.target.value;
    setSearchKey(_searchKey);

    setDidSearch(true);
    return debouncedSearch(_searchKey);
  };

  const handleSelect = (user) => {
    setPhysician(user);
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
      <div className={`searchable-search ${didSearch && "active"}`}>
        <div className="searchable-search-suggestions">
          {!results?.length ? (
            <div>
              <small>
                No Physician found...
                <i
                  onClick={handleRegister}
                  style={{ color: "blue", cursor: "pointer" }}
                >
                  Click to register
                </i>
              </small>
            </div>
          ) : (
            <ul>
              {results?.map((physician) => {
                const {
                  _id,
                  isPhysician = false,
                  isGhost = false,
                  specialization,
                  isMale,
                } = physician;

                return (
                  <li
                    onClick={() => handleSelect(physician)}
                    key={_id}
                    title={
                      isGhost
                        ? "This is a ghost physician not register as a user"
                        : ""
                    }
                  >
                    <h6>
                      {isPhysician
                        ? getPhysicianGenderIcon(isMale, isGhost)
                        : getGenderIcon(isMale)}
                      {"test"}
                    </h6>
                    <small>{specialization}</small>
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
          onClick={() => {
            setDidSearch(!didSearch);
            setResults([]);
            setSearchKey("");
          }}
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
