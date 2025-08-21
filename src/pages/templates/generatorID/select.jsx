import React, { useState, useEffect, useRef } from "react";
import { MDBIcon } from "mdbreact";

export default function Select({
  label = "",
  options = [],
  searchPlaceholder = "Search...",
  onSelect = () => {},
  getLabel = (option) => option,
  getValue = (option) => option,
  getStyle = () => ({}),
  defaultValue = "",
  useInput = false, // 🔹 toggle label or input
  showSearch = true, // 🔹 toggle search bar
}) {
  const [searchTerm, setSearchTerm] = useState("");
  const [selectActive, setSelectActive] = useState(false);
  const [selectedValue, setSelectedValue] = useState(getValue(defaultValue));
  const selectRef = useRef(null); // 🔹 ref sa buong select container

  // 🔹 close dropdown kapag nag click sa labas
  useEffect(() => {
    const handleClickOutside = (event) => {
      if (selectRef.current && !selectRef.current.contains(event.target)) {
        setSelectActive(false);
      }
    };

    document.addEventListener("mousedown", handleClickOutside);
    return () => {
      document.removeEventListener("mousedown", handleClickOutside);
    };
  }, []);

  const filteredOptions = options.filter((option) =>
    getLabel(option).toLowerCase().includes(searchTerm.toLowerCase())
  );

  const handleSelect = (option) => {
    const value = getValue(option);
    setSelectedValue(value); // store the actual value
    onSelect(value); // notify parent
    setSelectActive(false);
  };

  return (
    <div
      className="d-flex flex-column align-items-start w-100"
      style={{ minWidth: "50%" }}
    >
      <span className="IDGenerator-setting-select-label">{label}</span>
      <div
        ref={selectRef} // 🔹 attach ref
        className={`IDGenerator-setting-select-container ${
          selectActive ? "active" : ""
        } ${useInput ? "inputDesign" : ""}`}
      >
        <div className="IDGenerator-setting-select-placeholder">
          {/* 🔹 pwede label or input depende sa prop */}
          {useInput ? (
            <input
              type="text"
              value={selectedValue}
              onChange={(e) => {
                const val = e.target.value;
                setSelectedValue(val);
                onSelect(val); // 🔹 trigger immediately while typing
              }}
            />
          ) : (
            <span
              style={getStyle(selectedValue)}
              onClick={() => setSelectActive(!selectActive)}
            >
              {getLabel(selectedValue)}
            </span>
          )}

          {/* 🔹 kapag useInput=true dito lang ang toggle */}
          <MDBIcon
            className="IDGenerator-setting-select-icon"
            fas
            icon={selectActive ? "angle-up" : "angle-down"}
            onClick={() => setSelectActive(!selectActive)}
          />
        </div>

        <div
          className={`IDGenerator-setting-select-options ${
            selectActive ? "active" : ""
          } ${useInput ? "inputDesign" : ""}`}
        >
          {/* 🔹 search bar (toggle on/off) */}
          {showSearch && (
            <div className="p-2">
              <div className="IDGenerator-setting-input-container">
                <label className="IDGenerator-setting-label">
                  <MDBIcon fas icon="search" />
                </label>
                <input
                  className="IDGenerator-setting-input"
                  type="text"
                  placeholder={searchPlaceholder}
                  value={searchTerm}
                  onChange={(e) => setSearchTerm(e.target.value)}
                />
              </div>
            </div>
          )}

          <ul>
            {filteredOptions.length > 0 ? (
              filteredOptions.map((option, index) => {
                const value = getValue(option);
                return (
                  <li
                    key={index}
                    style={getStyle(value)}
                    onClick={() => handleSelect(option)}
                    onMouseEnter={() => {
                      setSelectedValue(value); // 🔹 update selection on hover
                      onSelect(value); // 🔹 trigger effect on hover
                    }}
                  >
                    {getLabel(option)}
                  </li>
                );
              })
            ) : (
              <li style={{ color: "#888" }}>No results found</li>
            )}
          </ul>
        </div>
      </div>
    </div>
  );
}
