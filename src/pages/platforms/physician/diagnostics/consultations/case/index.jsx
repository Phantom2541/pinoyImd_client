import React, { useState, useRef, useEffect } from "react";
import "./style.css";
import { MDBIcon } from "mdbreact";
import { useDispatch, useSelector } from "react-redux";
import { Search } from "../../../../../../components/searchables";
import Modal from "./modal";
import { SetFILTERED } from "../../../../../../services/redux/slices/diagnostics/cases";
import { capitalize } from "../../../../../../services/utilities";

export default function Case() {
  const { patient } = useSelector(({ consultations }) => consultations);
  const { filtered, collections } = useSelector(({ cases }) => cases);
  const [active, setActive] = useState(false);
  const [show, setShow] = useState(false);
  const [defaultCase, setDefaultCase] = useState("");
  const [selected, setSelected] = useState([]);
  const scrollRef = useRef(null);
  const dispatch = useDispatch();
  let isDown = false;
  let startX;
  let scrollLeft;

  const color = patient?.isMale ? "#007bff" : "#e83e8c";

  const dropdownRef = useRef(null); // ref for dropdown container

  const toggleCase = (item) => {
    const _cases = [...selected];
    const index = _cases.findIndex((val) => val._id === item._id);
    if (index > -1) {
      _cases.splice(index, 1);
    } else {
      _cases.push(item);
    }
    setSelected(_cases);
  };

  const removeCase = (item) => {
    const _cases = [...selected];
    const index = _cases.findIndex((val) => val._id === item._id);
    _cases.splice(index, 1);
    setSelected(_cases);
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
    <>
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
            <div className="mr-2">
              <Search
                hideButton={collections.length > 0}
                setFiltered={(items) => dispatch(SetFILTERED(items))}
                reset={() => dispatch(SetFILTERED(collections))}
                collections={collections}
                handleAdd={(value) => {
                  setShow(true);
                  setDefaultCase(value);
                }}
              />
            </div>
            {filtered.length > 0 ? (
              filtered.map((item) => (
                <button
                  className={`w-100 ${
                    selected.includes(item) ? "selected" : ""
                  } ${patient?.isMale ? "male" : "female"}`}
                  key={item}
                  onClick={() => toggleCase(item)}
                >
                  {capitalize(item?.title)}
                </button>
              ))
            ) : (
              <div className="w-100">
                <span className="text-center d-block">No Cases Found.</span>
              </div>
            )}
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
              <button onClick={() => removeCase(item?._id)}>
                <MDBIcon icon="times" />
              </button>
              <span>{capitalize(item?.title)}</span>
            </div>
          ))}
        </div>
      </div>
      <Modal
        show={show}
        toggle={() => setShow(!show)}
        defaultCase={defaultCase}
      />
    </>
  );
}
