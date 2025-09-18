import React, { useState, useRef, useEffect } from "react";
import "./style.css";
import { MDBIcon } from "mdbreact";
import { useSelector } from "react-redux";

export default function Case() {
  const { patient } = useSelector(({ consultations }) => consultations);
  const [active, setActive] = useState(false);
  const [selected, setSelected] = useState([]);
  const scrollRef = useRef(null);
  let isDown = false;
  let startX;
  let scrollLeft;

  const color = patient?.isMale ? "#007bff" : "#e83e8c";

  const dropdownRef = useRef(null); // ref for dropdown container

  const caseOptions = [
    // Surgical cases
    "hip replacement",
    "knee replacement",
    "appendectomy",
    "cholecystectomy",
    "cesarean section",
    "hernia repair",

    // Chronic diseases
    "diabetes",
    "hypertension",
    "asthma",
    "chronic kidney disease",
    "heart failure",
    "tuberculosis",

    // Acute conditions
    "pneumonia",
    "dengue fever",
    "influenza",
    "myocardial infarction",
    "stroke",
    "sepsis",

    // Others
    "cancer",
    "allergy",
    "arthritis",
    "migraine",
    "peptic ulcer disease",
  ];

  const toggleCase = (item) => {
    if (selected.includes(item)) {
      setSelected(selected.filter((val) => val !== item));
    } else {
      setSelected([...selected, item]);
    }
    // ❌ dropdown stays open
  };

  const removeCase = (item) => {
    setSelected(selected.filter((val) => val !== item));
  };

  // 🔹 close dropdown if clicked outside
  useEffect(() => {
    const handleClickOutside = (event) => {
      if (dropdownRef.current && !dropdownRef.current.contains(event.target)) {
        setActive(false);
      }
    };
    document.addEventListener("mousedown", handleClickOutside);
    return () => {
      document.removeEventListener("mousedown", handleClickOutside);
    };
  }, []);

  const handleMouseDown = (e) => {
    isDown = true;
    startX = e.pageX - scrollRef.current.offsetLeft;
    scrollLeft = scrollRef.current.scrollLeft;
  };

  const handleMouseLeave = () => {
    isDown = false;
  };

  const handleMouseUp = () => {
    isDown = false;
  };

  const handleMouseMove = (e) => {
    if (!isDown) return;
    e.preventDefault();
    const x = e.pageX - scrollRef.current.offsetLeft;
    const walk = (x - startX) * 1.5; // scroll speed
    scrollRef.current.scrollLeft = scrollLeft - walk;
  };

  return (
    <div
      className="checkup-data-toolkit-button-case-container"
      ref={dropdownRef}
    >
      <div className="checkup-data-toolkit-button-case-content">
        <button
          className="checkup-data-toolkit-button-case"
          onClick={() => setActive(!active)}
          style={{ backgroundColor: color }}
        >
          <span>case</span>
          <i
            className="fas fa-angle-up"
            style={{ transform: `rotate(${active ? -180 : 0}deg)` }}
          ></i>
        </button>

        <div
          className={`checkup-data-toolkit-button-case-list ${
            active && "active"
          }`}
        >
          {caseOptions.map((item) => (
            <button
              className={`${selected.includes(item) ? "selected" : ""} ${
                patient?.isMale ? "male" : "female"
              }`}
              key={item}
              onClick={() => toggleCase(item)}
            >
              {item}
            </button>
          ))}
        </div>
      </div>

      <div
        className="checkup-data-toolkit-button-case-selected"
        ref={scrollRef}
        onMouseDown={handleMouseDown}
        onMouseLeave={handleMouseLeave}
        onMouseUp={handleMouseUp}
        onMouseMove={handleMouseMove}
      >
        {selected.map((item) => (
          <div
            key={item}
            className={`checkup-data-toolkit-button-case-selected-item ${
              patient?.isMale ? "male" : "female"
            }`}
          >
            <button onClick={() => removeCase(item)}>
              <MDBIcon icon="times" />
            </button>
            <span>{item}</span>
          </div>
        ))}
      </div>
    </div>
  );
}
