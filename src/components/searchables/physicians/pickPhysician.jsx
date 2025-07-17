import { useEffect, useState, useCallback } from "react";
import {
  fullName,
  formatNameToObj,
  getGenderIcon,
} from "../../../services/utilities";
import { useDispatch, useSelector } from "react-redux";
import { SEARCH } from "../../../services/redux/slices/assets/persons/physicians";
import { debounce } from "lodash";
import { MDBAnimation, MDBProgress, MDBIcon } from "mdbreact";
import "./style.css";

const PickPhysician = ({
  defaultValue = "",
  classNameInput = "form-control form-control-sm",
  classNameContainer = "",
  disabled,
  formSubmitted,
  isSuccess,
  isEditable = false,
  onChange = () => {},
  handleCheck = () => {},
  handleClose = () => {},
}) => {
  const dispatch = useDispatch();
  const { token } = useSelector(({ auth }) => auth);
  const [query, setQuery] = useState("");
  const [results, setResults] = useState([]);
  const [isSearching, setIsSearching] = useState(false);
  const [didSearch, setDidSearch] = useState(false);
  const [selectedId, setSelectedId] = useState("");

  useEffect(() => {
    if (isSuccess && !formSubmitted) {
      setQuery("");
      setDidSearch(true);
    }
  }, [formSubmitted, isSuccess]);

  // 🔁 Debounced search
  const debouncedSearch = useCallback(
    debounce((value) => {
      const key = formatNameToObj(value);
      dispatch(SEARCH({ token, key })).then((action) => {
        const { payload = {} } = action || {};
        setResults(payload?.payload || []);
        setIsSearching(false);
      });
    }, 500),
    [dispatch, token]
  );

  useEffect(() => {
    if (didSearch) {
      onChange(query);
    } else {
      onChange(selectedId);
    }
  }, [didSearch, query, selectedId]);

  useEffect(() => {
    if (isEditable) {
      setQuery(defaultValue);
    }
  }, [isEditable, defaultValue]);
  const handleInputChange = (e) => {
    const value = e.target.value;

    setQuery(value);
    const sanitizedValue = value.trim();
    // const isTypingNew =
    //   sanitizedValue.length > 0 && sanitizedValue !== query.trim();

    if (sanitizedValue) {
      setIsSearching(true);
      debouncedSearch(value);
      setDidSearch(true);
      onChange(value);
    } else {
      setIsSearching(false);
    }
  };

  const handlePick = (item) => {
    const name = fullName(item.user.fullName);
    setQuery(name);
    setSelectedId(item.user._id);
    setResults([]);
    setDidSearch(false);
    onChange(name);
  };

  return (
    <div className={`d-flex align-items-center ${classNameContainer} `}>
      <div className="physicians-search-container">
        <input
          type="text"
          disabled={disabled}
          placeholder="Search physician (Last name, First name)"
          className={`physicians-search-input ${classNameInput}`}
          value={query}
          onChange={handleInputChange}
        />

        {!isSearching ? (
          <>
            {query && results.length > 0 && (
              <ul className="physicians-results-list">
                {results.map((item, index) => (
                  <li
                    key={index}
                    className="physicians-result-item"
                    onClick={() => handlePick(item)}
                  >
                    <div className="physicians-result-content">
                      {getGenderIcon(item.user.isMale)}
                      {fullName(item.user.fullName)}
                    </div>
                  </li>
                ))}
              </ul>
            )}
          </>
        ) : (
          <div className="physicians-results-list">
            {new Array(5).fill("").map((_, index) => (
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
            ))}
          </div>
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

export default PickPhysician;
