import React, { useState, useEffect, useRef } from "react";
import { MDBIcon } from "mdbreact";
import "./style.css";

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
  // 🔹 Store the full option object
  const [selectedValue, setSelectedValue] = useState(defaultValue);
  const [searchTerm, setSearchTerm] = useState("");
  const [selectActive, setSelectActive] = useState(false);
  const selectRef = useRef(null);

  // 🔹 Close dropdown on outside click
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
    setSelectedValue(option); // 🔹 store object
    onSelect(getValue(option)); // 🔹 notify parent
    setSelectActive(false);
  };

  return (
    <div
      className="d-flex flex-column align-items-start w-100"
      style={{ minWidth: "50%" }}
    >
      <span className="IDGenerator-setting-select-label">{label}</span>

      <div
        ref={selectRef}
        className={`IDGenerator-setting-select-container ${
          selectActive ? "active" : ""
        } ${useInput ? "inputDesign" : ""}`}
      >
        <div className="IDGenerator-setting-select-placeholder">
          {useInput ? (
            <input
              type="text"
              value={getLabel(selectedValue)}
              style={getStyle(selectedValue)} // 🔹 apply style to input
              onChange={(e) => {
                const val = e.target.value;
                const obj = { label: val, value: val }; // allow typing custom value
                setSelectedValue(obj);
                onSelect(val);
              }}
              onClick={() => setSelectActive(true)}
            />
          ) : (
            <span
              style={getStyle(selectedValue)} // 🔹 apply style to placeholder
              onClick={() => setSelectActive(!selectActive)}
            >
              {getLabel(selectedValue)}
            </span>
          )}

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
          {showSearch && (
            <div className="p-2">
              <div className="IDGenerator-setting-input-wrapper">
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
              filteredOptions.map((option, index) => (
                <li
                  key={index}
                  style={getStyle(option)} // 🔹 apply style to option
                  onClick={() => handleSelect(option)}
                  onMouseEnter={() => setSelectedValue(option)}
                >
                  {getLabel(option)}
                </li>
              ))
            ) : (
              <li style={{ color: "#888" }}>No results found</li>
            )}
          </ul>
        </div>
      </div>
    </div>
  );
}
