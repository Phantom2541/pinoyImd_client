import React, { useEffect, useState } from "react";
import { debounce } from "lodash";
import { useSelector, useDispatch } from "react-redux";
import {
  BROWSE,
  RESET,
} from "./../../../services/redux/slices/assets/persons/users";
import { MDBIcon } from "mdbreact";
import {
  formatNameToObj,
  fullName,
  getAge,
  getGenderIcon,
} from "./../../../services/utilities";
import Notification from "./notification";
import "../style.css";

/**
 * A Search component that allows the user to search for a patient by last name, first name, and middle name.
 * The component will make an API call to search for patients and render a list of results below the search input.
 * The user can select a patient from the list and the setPatient callback will be called with the selected patient.
 * The component also renders a button to register a new patient if no patient record is found with the search key.
 * The setSearchKey callback will be called with the search key when the button is clicked.
 *
 * @param {function} setPatient - A callback function that will be called when a patient is selected from the list.
 * @param {function} setRegister - A callback function that will be called when the button to register a new patient is clicked.
 *
 * @returns {JSX.Element} users
 */
export default function Search({ setPatient, setRegister = () => {} }) {
  const { collections, isLoading } = useSelector(({ users }) => users),
    { token } = useSelector((state) => state.auth),
    [patients, setPatients] = useState([]),
    [didSearch, setDidSearch] = useState(false),
    [didHover, setDidHover] = useState(false),
    [searchKey, setSearchKey] = useState(""),
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
    setPatients(collections);
  }, [collections]);
  const debouncedSearch = debounce((searchKey) => {
    const key = formatNameToObj(searchKey);
    dispatch(BROWSE({ token, key }));
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
    setPatient(user);
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
    <div
      className="d-flex align-items-center  "
      style={{ position: "relative" }}
    >
      <Notification didSearch={didSearch} />
      <div className={`searchable-search ${didSearch && "active"}`}>
        <div className="searchable-search-suggestions">
          {!patients.length ? (
            <small
              className={didHover ? "text-success" : ""}
              onClick={handleRegister}
              onMouseEnter={() => setDidHover(true)}
              onMouseLeave={() => setDidHover(false)}
            >
              No Patient Record found. <br /> click here to register
            </small>
          ) : (
            <ul>
              {patients?.map((user) => {
                const { _id, fullName: fullname } = user;

                return (
                  <li
                    onClick={() => handleSelect(user)}
                    key={_id}
                    className="text-dark text-nowrap"
                  >
                    {getGenderIcon(user.gender)} {fullName(fullname)} |{" "}
                    {getAge(user.dob)}
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
          className={didSearch && !isLoading ? "bg-danger" : ""}
          onClick={
            didSearch
              ? () => {
                  setDidSearch(false);
                  setSearchKey("");
                }
              : () => console.log("search")
          }
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
