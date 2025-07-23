import React, { useEffect, useState, useMemo, useRef } from "react";
import { useDispatch, useSelector } from "react-redux";
import { debounce, isEmpty } from "lodash";
import { MDBIcon, MDBAnimation, MDBProgress } from "mdbreact";
import { useToasts } from "react-toast-notifications";
import {
  BROWSE as MENUS,
  SetCOLLECTIONS,
  RESET as MENUSRESET,
} from "../../../services/redux/slices/commerce/catalog/menus";
import { globalSearch } from "../../../services/utilities";
import Notification from "./notifications";
import "../style.css";

/**
 * A Search component that allows the user to search for a menu item by name.
 * The component will make an API call to search for menu items and render a list of results below the search input.
 * The user can select a menu item from the list and the setMenu callback will be called with the selected menu item.
 * The component also renders a button to register a new menu item if no menu item record is found with the search key.
 * The setRegister callback will be called with the search key when the button is clicked.
 *
 * @param {function} setMenu - A callback function that will be called when a menu item is selected from the list.
 * @param {function} setRegister - A callback function that will be called when the button to register a new menu item is clicked.
 *
 * @returns {JSX.Element} user
 */
export default function Search({
  setMenu,
  setRegister = () => {},
  filtered = [],
}) {
  const { token, activePlatform } = useSelector(({ auth }) => auth),
    { collections } = useSelector(({ menus }) => menus),
    [match, setMatch] = useState([]),
    [searchKey, setSearchKey] = useState(""),
    [isLoading, setIsLoading] = useState(false),
    { addToast } = useToasts(),
    dispatch = useDispatch();

  const inputRef = useRef(null); // Reference to the input field

  // initial values
  useEffect(() => {
    if (token && activePlatform.branchId) {
      const branchId = activePlatform.branchId;

      // Check if the data for the specific branchId is already in localStorage
      const storedMenus = localStorage.getItem(`menus_${branchId}`);

      if (storedMenus) {
        // If menus are found in localStorage, use them (parse back to an object)
        const menus = JSON.parse(storedMenus);
        // You can dispatch the menus here if needed
        dispatch(SetCOLLECTIONS(menus));
      } else {
        // If no data in localStorage, make the server request
        dispatch(MENUS({ token, key: { branchId } }))
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
  const debouncedSearch = useMemo(
    () =>
      debounce((key) => {
        setIsLoading(false);

        if (key.trim().length <= 1) return setMatch([]);
        const _match = globalSearch(
          isEmpty(filtered) ? collections : filtered,
          key.trim()
        );
        setMatch(_match);
      }, 500),
    [collections, filtered, setMatch, setIsLoading]
  ); // dependencies

  const handleChange = (value) => {
    setSearchKey(value);
    setIsLoading(true);
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
    <div className=" d-flex align-items-center " style={{ width: "100%" }}>
      <Notification didSearch={match.length > 0} />
      <div className={`searchable-search  ${searchKey && "active"}`}>
        <div className="searchable-search-suggestions">
          {!isLoading ? (
            <>
              {" "}
              {searchKey && match.length === 0 && (
                <li onClick={handleRegister} className="text-dark">
                  No services found for "{searchKey}". try another keywords
                </li>
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
                        </span>
                        <span className="ml-3 text-dark">{abbreviation}</span>
                      </div>
                    </li>
                  );
                })}
            </>
          ) : (
            <>
              {new Array(5).fill("").map((_, index) => (
                <MDBAnimation
                  key={index}
                  className="p-1 ml-2 mr-2 "
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
              ))}
            </>
          )}
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
