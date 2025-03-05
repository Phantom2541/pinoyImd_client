import React, { useEffect, useState, useCallback, useRef } from "react";
import { useDispatch, useSelector } from "react-redux";
import { debounce } from "lodash";
import { MDBIcon } from "mdbreact";
import { useToasts } from "react-toast-notifications";
import {
  BROWSE as MENUS,
  SETMENUS,
  RESET as MENUSRESET,
} from "./../../../services/redux/slices/commerce/menus";
import { currency, globalSearch } from "./../../../services/utilities";
import Notification from "./notifications";
import "../style.css";

export default function Search({ setMenu, setRegister }) {
  const { token, activePlatform } = useSelector(({ auth }) => auth),
    { collections } = useSelector(({ menus }) => menus),
    [match, setMatch] = useState([]),
    [searchKey, setSearchKey] = useState(""),
    { addToast } = useToasts(),
    dispatch = useDispatch();

  const inputRef = useRef(null); // Reference to the input field

  useEffect(() => {
    if (token && activePlatform.branchId) {
      const branchId = activePlatform.branchId;

      // Check if the data for the specific branchId is already in localStorage
      const storedMenus = localStorage.getItem(`menus_${branchId}`);

      if (storedMenus) {
        // If menus are found in localStorage, use them (parse back to an object)
        const menus = JSON.parse(storedMenus);
        console.log("Using stored menus:", menus);
        // You can dispatch the menus here if needed
        dispatch(SETMENUS(menus)); // Optionally dispatch to update the store if necessary
      } else {
        // If no data in localStorage, make the server request
        dispatch(MENUS({ key: { branchId }, token }))
          .then(({ payload }) => {
            // Assuming the response contains the menus data in 'payload'
            const menus = payload.payload;

            // Store the fetched data in localStorage for future use
            localStorage.setItem(`menus_${branchId}`, JSON.stringify(menus));
          })
          .catch((error) => {
            console.error("Error fetching menus:", error);
          });
      }

      // Cleanup function (reset state if necessary)
      return () => {
        dispatch(MENUSRESET());
      };
    }
  }, [token, dispatch, activePlatform]);

  // Debounced search function to avoid too many re-renders
  const debouncedSearch = useCallback(
    debounce((key) => {
      if (key.trim().length <= 1) return setMatch([]);
      const _match = globalSearch(collections, key.trim());
      setMatch(_match);
    }, 500),
    [collections]
  );

  const handleChange = (value) => {
    setSearchKey(value);
    // Debounced search trigger
    debouncedSearch(value);
  };

  const handleSelect = (menu) => {
    setMenu(menu);
    setSearchKey(""); // Reset the search key after selection
    setMatch([]); // Clear the match list after selection
    inputRef.current.focus(); // Keep focus on the input field after selection
  };

  const handleRegister = () => {
    setRegister(searchKey);
    setSearchKey(""); // Reset the search key after registration
    setMatch([]); // Clear the match list after registration
    inputRef.current.focus(); // Keep focus on the input field after registration
  };

  const handleClear = () => {
    setSearchKey(""); // Clear the search key
    setMatch([]); // Clear the match list
  };

  return (
    <div className="searchable-search-cotaniner ">
      <Notification didSearch={match.length > 0} />
      <div className={`searchable-search  ${match.length > 0 && "active"}`}>
        <div className="searchable-search-suggestions">
          {searchKey && match.length === 0 && (
            <li onClick={handleRegister}>No match found.</li>
          )}

          {match.length === 0 && !searchKey && (
            <li>Please type a menu name.</li>
          )}

          {match.length > 0 &&
            match.map((menu, index) => {
              const { description = "", abbreviation = "", opd = 0 } = menu;

              return (
                <li
                  key={`menu-suggestion-${index}`}
                  onClick={() => {
                    if (opd) {
                      handleSelect(menu);
                    } else {
                      addToast("This product has no set price.", {
                        appearance: "warning",
                      });
                    }
                  }}
                >
                  <div className="d-flex align-items-left justify-content-between menu-suggestion ">
                    <span className="text-left  ">
                      {description && (
                        <span className="description text-dark">
                          {description}
                        </span>
                      )}
                      {abbreviation && (
                        <span className="abbreviation text-dark ">
                          {abbreviation}
                        </span>
                      )}
                    </span>
                    <span className="ml-3 text-dark">
                      {opd ? currency(opd) : "N/A"}
                    </span>
                  </div>
                </li>
              );
            })}
        </div>
        <input
          ref={inputRef} // Attach the reference to the input element
          placeholder="Search menus..."
          value={searchKey}
          onChange={({ target }) => handleChange(target.value)}
          autoCorrect="off"
          spellCheck={false}
        />
        <button
          type="submit"
          className={`${match.length > 0 && "bg-danger"}`}
          onClick={handleClear}
        >
          <MDBIcon
            icon={match.length > 0 ? "times" : "search"}
            className="search-icon"
          />
        </button>
      </div>
    </div>
  );
}
