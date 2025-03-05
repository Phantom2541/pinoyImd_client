import React, { useEffect, useState } from "react";
import { debounce } from "lodash";
import { useSelector, useDispatch } from "react-redux";
import {
  FILTER,
  BROWSE,
  RESET,
} from "./../../../services/redux/slices/assets/persons/physicians";
import { MDBIcon } from "mdbreact";
import {
  formatNameToObj,
  fullName,
  getGenderIcon,
  getPhysicianGenderIcon,
} from "./../../../services/utilities";
import Notification from "./notification";

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
export default function Search({ setPhysician, setRegister, clientId }) {
  const [searchKey, setSearchKey] = useState(""),
    [didSearch, setDidSearch] = useState(false),
    { collections, isLoading } = useSelector(({ physicians }) => physicians),
    [physicians, setPhysicians] = useState([]),
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
  useEffect(() => {
    setPhysicians(collections || []);
  }, [collections]);
  const debouncedSearch = debounce((searchKey) => {
    const key = formatNameToObj(searchKey);
    dispatch(FILTER({ token, key }));
  }, 1000);
  const handleChange = (e) => {
    const _searchKey = e.target.value;
    setSearchKey(_searchKey);
    const searchKey = _searchKey.split(",");
    if (searchKey.length > 1 && searchKey[1].trim()) {
      setDidSearch(true);
      return debouncedSearch(_searchKey);
    }
  };

  const handleSelect = (user) => {
    setPhysician(user);
    setSearchKey("");
    dispatch(RESET());
    setDidSearch(false);
  };

  const handleRegister = () => {
    setRegister(formatNameToObj(searchKey));
    setSearchKey("");
    dispatch(RESET());
    setDidSearch(false);
  };

  return (
    <div className="d-flex align-items-center">
      <Notification didSearch={didSearch} />
      <div className={`searchable-search ${didSearch && "active"}`}>
        <div className="searchable-search-suggestions">
          {!physicians?.length ? (
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
              {physicians?.map((physician) => {
                const {
                  _id,
                  fullName: fullname,
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
                      {fullName(fullname)}
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
