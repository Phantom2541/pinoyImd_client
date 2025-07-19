import { useEffect, useState, useRef } from "react";
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
  source = {},
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
  const [isRegister, setIsRegister] = useState(false);
  const [hideRegMsg, setHideRegMsg] = useState(true); // hide register message
  const [physicians, setPhysicians] = useState([]);
  const [results, setResults] = useState([]);

  const onChangeRef = useRef(onChange);

  useEffect(() => {
    setHideRegMsg(true);
  }, []);

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
      setIsRegister(false);
    }
  }, [formSubmitted, isSuccess]);

  useEffect(() => {
    onChangeRef.current = onChange;
  }, [onChange]);

  useEffect(() => {
    if (didSearch) {
      onChangeRef.current({ _id: query, isRegister });
    } else {
      onChangeRef.current({ _id: selectedId });
    }
  }, [didSearch, query, selectedId, isRegister]);

  useEffect(() => {
    if (isEditable) {
      setQuery(defaultValue);
    }
  }, [isEditable, defaultValue]);

  const physiciansRef = useRef(physicians);
  useEffect(() => {
    physiciansRef.current = physicians;
  }, [physicians]);

  const debouncedSearch = useRef(
    debounce((value) => {
      const _results = globalSearch(physiciansRef.current, value);
      setResults(_results);
      setIsSearching(false);
      setDidSearch(true);
    }, 1000)
  ).current;

  // Cleanup on unmount
  useEffect(() => {
    return () => {
      debouncedSearch.cancel();
    };
  }, []);

  const handleInputChange = (e) => {
    const value = e.target.value;
    if (!value) setIsRegister(false);
    setQuery(value);

    const startsOrEndsWithSpace = /^\s|\s$/.test(value);

    if (physicians.length === 0) {
      setResults([]);
      setDidSearch(true);
    } else if (!startsOrEndsWithSpace && value.trim()) {
      setIsSearching(true);
      setDidSearch(true);
      setIsRegister(false);
      setHideRegMsg(false);
      onChange(value);
      debouncedSearch(value);
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
    setIsRegister(false);
    setHideRegMsg(true);
  };

  return (
    <div className={`d-flex align-items-center ${classNameContainer}`}>
      <div className="physicians-search-container">
        <div className="d-flex align-items-center">
          <Notification iconSize="md" />
          {isRegister && (
            <MDBIcon
              fas
              icon="user-tag"
              className="text-primary"
              title="Register and Tag Physician"
            />
          )}
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
        ) : (
          <>
            {query.length !== 0 && !isRegister && !hideRegMsg && (
              <ul className="physicians-results-list">
                <li className="p-1 text-center">
                  <span role="img" aria-label="physician not found">
                    🚫
                  </span>
                  Physician Not Found. <br />{" "}
                  <span style={{ fontSize: "13px" }}>
                    Do you want to register
                    {source?._id
                      ? " and tag them to your selected source"
                      : " this physician to your branch"}
                    ?
                  </span>
                  <span
                    className="text-primary cursor-pointer ml-1"
                    onClick={() => setIsRegister(true)}
                    style={{ textDecoration: "underline" }}
                  >
                    Register
                  </span>
                </li>
              </ul>
            )}
          </>
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
