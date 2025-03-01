import React, { useState } from "react";
import { debounce } from "lodash";
import { useSelector, useDispatch } from "react-redux";
import {
    GETPATIENTS,
    RESET,
  } from "../../../../services/redux/slices/assets/persons/users";
import { MDBIcon } from "mdbreact";
import {formatNameToObj, fullName, getAge, getGenderIcon} from "../../../../services/utilities";


export default function Search({ onSelect, onRegister }) {
  const [searchKey, setSearchKey] = useState(""),
  [didSearch, setDidSearch] = useState(false),
   { collections, isLoading } = useSelector(({ users }) => users),
  {token} = useSelector((state) => state.auth),
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
  const debouncedSearch = debounce((searchKey) => {
    const key=formatNameToObj(searchKey);    
    dispatch(GETPATIENTS({ token, key }));
  }, 1000);

  const handleChange = (e) => {
    const searchKey = e.target.value;    
    setSearchKey(searchKey);
    const searchKeys = searchKey.split(",");
if (searchKeys.length > 1 && searchKeys[1].trim()) {
  setDidSearch(true);
    return debouncedSearch(searchKey);
}
  };

  const handleSelect = (user) => {
    onSelect(user);
    setSearchKey("");
    dispatch(RESET());
    setDidSearch(false);
  };

  const handleRegister = () => {
    onRegister(formatNameToObj(searchKey))
    setSearchKey(""); 
    dispatch(RESET());
    setDidSearch(false);
  };

  return (
    <div className="d-flex align-items-center">
    <div className="cashier-instruction">
      <MDBIcon
        icon="info-circle"
        size="lg"
        className="text-info cursor-pointer"
      />
      <div>
        <p>Last name, First name y Middle name</p>
        <i>Please maintain this order when searching.</i>
      </div>
    </div>
    <div
      className={`cashier-search ${didSearch && "active"}`}
    >
      <div className="cashier-search-suggestions">
        {!collections.length ? (
          <small onClick={handleRegister}>No Patient Record found...</small>
        ) : (
          <ul>
            {collections?.map((user) => {
              const { _id, fullName: fullname } = user;

              return (
                <li onClick={() => handleSelect(user)} key={_id}>
                 {getGenderIcon(user.gender)} {fullName(fullname)} | {getAge(user.dob)}
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
