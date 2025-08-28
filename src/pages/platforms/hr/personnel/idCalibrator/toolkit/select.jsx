import React, {
  useState,
  useEffect,
  useRef,
  useMemo,
  useCallback,
} from "react";
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
  useInput = false, // toggle label or input
  showSearch = true, // toggle search bar
  disabled,
  value,
}) {
  const [selectedValue, setSelectedValue] = useState(defaultValue);
  const [inputValue, setInputValue] = useState(
    defaultValue?.value !== undefined ? defaultValue.value : ""
  );
  const [editing, setEditing] = useState(false);
  const [searchTerm, setSearchTerm] = useState("");
  const [selectActive, setSelectActive] = useState(false);
  const selectRef = useRef(null);

  useEffect(() => {
    if (value) {
      setSelectedValue(value);
    }
  }, [value]);

  // Close dropdown on outside click
  useEffect(() => {
    const handleClickOutside = (event) => {
      if (selectRef.current && !selectRef.current.contains(event.target)) {
        setSelectActive(false);
      }
    };
    document.addEventListener("mousedown", handleClickOutside);
    return () => document.removeEventListener("mousedown", handleClickOutside);
  }, []);

  // Memoized filtering
  const filteredOptions = useMemo(
    () =>
      options.filter((option) =>
        getLabel(option).toLowerCase().includes(searchTerm.toLowerCase())
      ),
    [options, searchTerm, getLabel]
  );

  // Select option
  const handleSelect = useCallback(
    (option) => {
      const value = getValue(option);
      setSelectedValue(option);
      setInputValue(option.value);
      onSelect(value, option);
      setSelectActive(false);
      setEditing(false);
    },
    [getValue, onSelect]
  );

  // Input change handler
  const handleInputChange = useCallback(
    (e) => {
      const val = e.target.value.replace(/[^\d]/g, "");
      setInputValue(val);

      if (val) {
        const numeric = parseInt(val, 10);
        const obj = { label: `${numeric}px`, value: numeric };
        setSelectedValue(obj);
        onSelect(numeric);
      }
    },
    [onSelect]
  );

  // Blur input
  const handleInputBlur = useCallback(() => {
    setEditing(false);
    if (inputValue) {
      const numeric = parseInt(inputValue, 10);
      const obj = { label: `${numeric}px`, value: numeric };
      setSelectedValue(obj);
      onSelect(numeric);
    } else {
      setInputValue(selectedValue?.value || "");
    }
  }, [inputValue, onSelect, selectedValue]);

  // Drag handler (Font Size)
  const handleMouseDown = useCallback(
    (e) => {
      e.preventDefault();
      const startX = e.clientX;
      const startValue = parseInt(selectedValue?.value || inputValue || 16, 10);
      const sensitivity = 0.2;

      // lock cursor globally
      document.documentElement.style.setProperty(
        "cursor",
        "ew-resize",
        "important"
      );
      document.body.style.userSelect = "none";
      document.body.style.pointerEvents = "none"; // disable lahat
      e.currentTarget.style.pointerEvents = "auto"; // pero enable yung mismong handle

      const handleMouseMove = (moveEvent) => {
        const deltaX = moveEvent.clientX - startX;
        let newValue = Math.max(
          1,
          Math.round(startValue + deltaX * sensitivity)
        );

        const obj = { label: `${newValue}px`, value: newValue };
        setSelectedValue(obj);
        setInputValue(newValue);
        onSelect(newValue);

        // siguraduhin hindi nawawala kahit saan
        document.documentElement.style.setProperty(
          "cursor",
          "ew-resize",
          "important"
        );
      };

      const handleMouseUp = () => {
        document.removeEventListener("mousemove", handleMouseMove);
        document.removeEventListener("mouseup", handleMouseUp);

        // restore defaults
        document.documentElement.style.removeProperty("cursor");
        document.body.style.userSelect = "";
        document.body.style.pointerEvents = "";
      };

      document.addEventListener("mousemove", handleMouseMove);
      document.addEventListener("mouseup", handleMouseUp);
    },
    [selectedValue, inputValue, onSelect]
  );

  return (
    <div
      className="d-flex flex-column align-items-start w-100"
      style={{ minWidth: "50%" }}
    >
      <span
        className={`IDGenerator-setting-select-label ${
          disabled ? "disabled" : ""
        }`}
      >
        {label}
      </span>

      <div
        ref={selectRef}
        className={`IDGenerator-setting-select-container ${
          selectActive ? "active" : ""
        } ${showSearch ? "" : "inputDesign"} ${disabled ? "disabled" : ""}`}
      >
        <div className="IDGenerator-setting-select-placeholder">
          {label === "Font Size" && (
            <span
              onMouseDown={handleMouseDown}
              style={{ cursor: "ew-resize", userSelect: "none" }}
            >
              <MDBIcon fas icon="font" />
            </span>
          )}

          {useInput ? (
            <input
              type="text"
              value={editing ? inputValue : selectedValue?.label || ""}
              style={getStyle(selectedValue)}
              onFocus={() => {
                setEditing(true);
                setInputValue(selectedValue?.value || "");
              }}
              onChange={handleInputChange}
              onBlur={handleInputBlur}
            />
          ) : (
            <span
              style={getStyle(selectedValue)}
              onClick={() => setSelectActive(!selectActive)}
            >
              {selectedValue ? getLabel(selectedValue) : "Select..."}
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
          } ${showSearch ? "" : "inputDesign"} ${
            label === "Font Weight" ? "weight" : ""
          }`}
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
                  style={getStyle(option)}
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
