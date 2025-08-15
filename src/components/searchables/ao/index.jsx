import React, { useEffect, useMemo, useState } from "react";
import { debounce } from "lodash";
import { useSelector, useDispatch } from "react-redux";
import {
  BROWSE,
  RESET,
} from "./../../../services/redux/slices/assets/persons/users";
import { MDBIcon, MDBInput, MDBAnimation, MDBProgress } from "mdbreact";
import {
  formatNameToObj,
  fullName,
  getAge,
  getGenderIcon,
} from "./../../../services/utilities";
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
export default function Search({
  setUser = () => {},
  isRequired = false,
  displayWithLabel = true,
  selectedUser = {},
  label = "Please set a label",
}) {
  const { collections } = useSelector(({ users }) => users),
    { token } = useSelector((state) => state.auth),
    [users, setUsers] = useState([]),
    [didSearch, setDidSearch] = useState(false),
    [isFetch, setIsFetch] = useState(false),
    [selected, setSelected] = useState({}),
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
    setUsers(collections);
  }, [collections]);

  useEffect(() => {
    setSelected(selectedUser);
  }, [selectedUser]);

  const debouncedSearch = useMemo(
    () =>
      debounce((searchKey) => {
        const key = formatNameToObj(searchKey);
        dispatch(BROWSE({ token, key }));
        setIsFetch(false);
      }, 1000),
    [dispatch, token]
  );

  useEffect(() => {
    return () => {
      debouncedSearch.cancel();
    };
  }, [debouncedSearch]);
  const handleChange = (e) => {
    const _searchKey = e.target.value;
    if (!_searchKey) {
      setUser({ _id: "" });
      setDidSearch(false);
    }

    setSearchKey(_searchKey);
    const searchKey = _searchKey.split(",");
    if (searchKey.length > 1 && searchKey[1].trim()) {
      setDidSearch(true);
      setIsFetch(true);
      return debouncedSearch(_searchKey);
    }
  };
  const handleSelect = (user) => {
    setUser(user);
    setSelected(user);
    setSearchKey("");
    dispatch(RESET());
    setDidSearch(false);
  };

  return (
    <div className="position-relative">
      {selected._id ? (
        <h6 className="d-flex align-items-center mb-3">
          {displayWithLabel && `${label}:`}
          <strong className="ml-1 ">{fullName(selected.fullName)}</strong>
          <MDBIcon
            icon="times"
            className="ml-2"
            onClick={() => {
              setSelected({});
              setUser({});
            }}
            title="Remove"
            style={{ cursor: "pointer", color: "red" }}
          />
        </h6>
      ) : (
        <>
          <MDBInput
            label={label}
            style={{ width: "100%" }}
            required={isRequired}
            type="search"
            value={searchKey}
            onChange={handleChange}
            placeholder="Search..."
            autoCorrect="off"
            spellCheck={false}
            className="search-input"
          />
          {didSearch && (
            <div className="search-results">
              {isFetch ? (
                new Array(5).fill("").map((_, index) => (
                  <MDBAnimation
                    key={index}
                    className="p-1 ml-2 mr-2 mt-1"
                    type="flash"
                    infinite
                    delay={`${index + 1}00ms`}
                    duration="3000ms"
                  >
                    <MDBProgress
                      color="light"
                      value={3000}
                      id="progress-table"
                    ></MDBProgress>
                  </MDBAnimation>
                ))
              ) : (
                <>
                  {users.length === 0 && (
                    <h6 className="text-center mt-2">
                      No users Found. Try another keywords
                    </h6>
                  )}
                  <ul>
                    {users?.map((user) => {
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
                </>
              )}
            </div>
          )}
        </>
      )}
    </div>
  );
}
