import { useEffect, useState, useMemo, useRef } from "react";
import {
  fullName,
  getPhysicianGenderIcon,
  globalSearch,
} from "../../../services/utilities";
import { useSelector } from "react-redux";
import { debounce } from "lodash";
import { MDBAnimation, MDBProgress, MDBIcon } from "mdbreact";
import "./style.css";
import Notification from "./notification";

const PickPhysician = ({
  defaultValue = "",
  classNameInput = "form-control form-control-sm",
  classNameContainer = "",
  disabled,
  formSubmitted,
  isSuccess,
  isEditable = false,
  suggested = [],
  onChange = () => {},
  handleCheck = () => {},
  handleClose = () => {},
}) => {
  const { collections } = useSelector(({ physicians }) => physicians);
  const [query, setQuery] = useState("");
  const [selectedId, setSelectedId] = useState("");
  const [isSearching, setIsSearching] = useState(false);
  const [didSearch, setDidSearch] = useState(false);
  const [isFocused, setIsFocused] = useState(false);
  const [physicians, setPhysicians] = useState([]);
  const [results, setResults] = useState([]);

  const onChangeRef = useRef(onChange);

  useEffect(() => {
    const base = [...collections].filter(({ user }) => user?._id);
    const merged = [...base];
    if (suggested.length > 0) {
      suggested.forEach((s) => {
        const exists = base.some((b) => b.user._id === s.user._id);
        if (!exists) merged.push(s);
      });
    }
    setPhysicians(merged);
  }, [collections, suggested]);

  useEffect(() => {
    if (isSuccess && !formSubmitted) {
      setQuery("");
      setDidSearch(true);
    }
  }, [formSubmitted, isSuccess]);

  useEffect(() => {
    onChangeRef.current = onChange;
  }, [onChange]);

  useEffect(() => {
    if (didSearch) {
      onChangeRef.current(query);
    } else {
      onChangeRef.current(selectedId);
    }
  }, [didSearch, query, selectedId]);

  useEffect(() => {
    if (isEditable) {
      setQuery(defaultValue);
    }
  }, [isEditable, defaultValue]);

  const debouncedSearch = useMemo(
    () =>
      debounce((value) => {
        const _results = globalSearch(physicians, value);
        setResults(_results);
        setIsSearching(false);
        setDidSearch(true);
      }, 1000),
    [physicians]
  );
  const handleInputChange = (e) => {
    const value = e.target.value;
    setQuery(value);

    const startsOrEndsWithSpace = /^\s|\s$/.test(value);

    if (physicians.length === 0) {
      setResults([]);
      setDidSearch(true);
    } else if (!startsOrEndsWithSpace && value.trim()) {
      setIsSearching(true);
      debouncedSearch(value);
      setDidSearch(true);
      onChange(value);
    } else {
      setIsSearching(false);
      setResults([]);
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
    <div className={`d-flex align-items-center ${classNameContainer}`}>
      <div className="physicians-search-container">
        <div className="d-flex align-items-center">
          <Notification iconSize="md" />

          <input
            type="text"
            placeholder="Search..."
            className={`physicians-search-input ${classNameInput}`}
            value={query}
            onFocus={() => setIsFocused(true)}
            onBlur={() => setTimeout(() => setIsFocused(false), 200)}
            onChange={handleInputChange}
            disabled={disabled}
          />
        </div>

        {isSearching ? (
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
                <MDBProgress color="light" value={3000} id="progress-table" />
              </MDBAnimation>
            ))}
          </div>
        ) : isFocused && query.trim() === "" && suggested.length > 0 ? (
          <ul className="physicians-results-list">
            {suggested.map((item, index) => (
              <li
                key={index}
                className="physicians-result-item"
                onClick={() => handlePick(item)}
              >
                <div className="physicians-result-content">
                  {getPhysicianGenderIcon(item?.user?.isMale)}
                  {fullName(item?.user?.fullName)}
                </div>
              </li>
            ))}
          </ul>
        ) : results.length > 0 ? (
          <ul className="physicians-results-list">
            {results.map((item, index) => (
              <li
                key={index}
                className="physicians-result-item"
                onClick={() => handlePick(item)}
              >
                <div className="physicians-result-content">
                  {getPhysicianGenderIcon(item?.user?.isMale)}
                  {fullName(item.user.fullName)}
                </div>
              </li>
            ))}
          </ul>
        ) : null}
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
