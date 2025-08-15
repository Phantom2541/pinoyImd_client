import { useEffect, useState, useRef, useMemo } from "react";
import { useSelector, useDispatch } from "react-redux";
import { debounce } from "lodash";
import { MDBAnimation, MDBProgress, MDBIcon } from "mdbreact";
import {
  BROWSE,
  RESET,
} from "../../../services/redux/slices/assets/persons/users";
import {
  fullName,
  getGenderIcon,
  getAge,
  formatNameToObj,
} from "../../../services/utilities";
import "./style.css"; // your editUser CSS file

const PickUser = ({
  defaultValue = "",
  classNameInput = "editUser-search-input",
  classNameContainer = "",
  disabled,
  formSubmitted,
  isSuccess,
  isEditable = false,
  onChange = () => {},
  handleCheck = () => {},
  handleClose = () => {},
}) => {
  const { collections: users = [] } = useSelector(({ users }) => users);
  const { token } = useSelector((state) => state.auth);
  const dispatch = useDispatch();

  const [query, setQuery] = useState("");
  const [selectedId, setSelectedId] = useState("");
  const [isSearching, setIsSearching] = useState(false);
  const [didSearch, setDidSearch] = useState(false);
  const [isFocused, setIsFocused] = useState(false);
  const [results, setResults] = useState([]);

  const onChangeRef = useRef(onChange);

  useEffect(() => {
    onChangeRef.current = onChange;
  }, [onChange]);

  useEffect(() => {
    if (isEditable) {
      setQuery(defaultValue);
    }
  }, [isEditable, defaultValue]);

  // Debounced API search
  const debouncedSearch = useMemo(
    () =>
      debounce((searchKey) => {
        const key = formatNameToObj(searchKey);
        dispatch(BROWSE({ token, key }));
        setIsSearching(false);
      }, 1000),
    [dispatch, token]
  );

  useEffect(() => {
    return () => {
      debouncedSearch.cancel();
    };
  }, [debouncedSearch]);

  // Sync search results from Redux collections
  useEffect(() => {
    setResults(users);
  }, [users]);

  // Handle input change
  const handleInputChange = (e) => {
    const value = e.target.value;
    setQuery(value);

    if (!value.trim()) {
      setResults([]);
      setDidSearch(false);
      dispatch(RESET());
      return;
    }

    setIsSearching(true);
    setDidSearch(true);
    debouncedSearch(value);
  };

  // Handle selecting a user
  const handlePick = (user) => {
    const name = fullName(user.fullName);
    setQuery(name);
    setSelectedId(user._id);
    setResults([]);
    setDidSearch(false);
    onChangeRef.current(user);
  };

  // Clear input on successful save
  useEffect(() => {
    if (isSuccess && !formSubmitted) {
      setQuery("");
      setDidSearch(true);
    }
  }, [formSubmitted, isSuccess]);

  return (
    <div className={`d-flex align-items-center ${classNameContainer}`}>
      <div className="editUser-search-container">
        <div className="d-flex align-items-center">
          <input
            type="text"
            placeholder="Search users..."
            className={classNameInput}
            value={query}
            onFocus={() => setIsFocused(true)}
            onBlur={() => setTimeout(() => setIsFocused(false), 200)}
            onChange={handleInputChange}
            disabled={disabled}
          />
        </div>

        {isSearching ? (
          <div className="editUser-results-list">
            {new Array(5).fill("").map((_, index) => (
              <MDBAnimation
                key={index}
                className="p-1 ml-2 mr-2 mt-1"
                type="flash"
                infinite
                delay={`${index + 1}00ms`}
                duration="3000ms"
              >
                <MDBProgress color="light" value={3000} id="progress-table" />
              </MDBAnimation>
            ))}
          </div>
        ) : isFocused && results.length > 0 ? (
          <ul className="editUser-results-list">
            {results.map((item) => (
              <li
                key={item._id}
                className="editUser-result-item"
                onClick={() => handlePick(item)}
              >
                <div className="editUser-result-content">
                  {getGenderIcon(item.gender)} {fullName(item.fullName)} |{" "}
                  {getAge(item.dob)}
                </div>
              </li>
            ))}
          </ul>
        ) : (
          didSearch &&
          !isSearching &&
          results.length === 0 && (
            <ul className="editUser-results-list">
              <li className="editUser-no-result">
                <div className="editUser-result-content">
                  🚫 User not found.
                </div>
              </li>
            </ul>
          )
        )}
      </div>

      {isEditable && (
        <div className="d-flex align-items-center ml-2">
          {!formSubmitted ? (
            <MDBIcon
              icon="check"
              onClick={() => handleCheck()}
              style={{
                color: "blue",
                fontSize: "1rem",
                marginRight: "10px",
                marginLeft: "7px",
              }}
              className="cursor-pointer"
            />
          ) : (
            <MDBIcon
              icon="spinner"
              pulse
              style={{
                color: "black",
                fontSize: "1rem",
                marginRight: "10px",
                marginLeft: "10px",
              }}
            />
          )}
          <MDBIcon
            icon="times"
            onClick={() => handleClose()}
            className="cursor-pointer"
            style={{ color: "red", fontSize: "1rem" }}
          />
        </div>
      )}
    </div>
  );
};

export default PickUser;
