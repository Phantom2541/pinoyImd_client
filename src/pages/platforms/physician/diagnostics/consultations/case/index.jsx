import React, { useState, useRef, useEffect } from "react";
import "./style.css";
import { MDBIcon } from "mdbreact";
import { useDispatch, useSelector } from "react-redux";
import { Search } from "../../../../../../components/searchables";
import Modal from "./modal";
import { SetFILTERED } from "../../../../../../services/redux/slices/diagnostics/cases";
import { capitalize } from "../../../../../../services/utilities";
import { SetPATIENT } from "../../../../../../services/redux/slices/diagnostics/clinic/appointments";

export default function Case() {
  const { patient } = useSelector(({ consultations }) => consultations);
  const { patient: appointment } = useSelector(
    ({ appointments }) => appointments
  );
  const [active, setActive] = useState(false);
  const [show, setShow] = useState(false);
  const [defaultCase, setDefaultCase] = useState("");
  const [cases, setCases] = useState([]);
  const [selected, setSelected] = useState([]);
  const scrollRef = useRef(null);
  const dispatch = useDispatch();
  let isDown = false;
  let startX;
  let scrollLeft;

  const color = patient?.isMale ? "#007bff" : "#e83e8c";

  const dropdownRef = useRef(null); // ref for dropdown container

  const { cases: caseCollections = [], consultation = {} } = appointment || {};
  const { cases: selectedCases = [] } = consultation || {};
  useEffect(() => {
    // compare contents, not just reference
    setCases((prev) => {
      const prevStr = JSON.stringify(prev);
      const nextStr = JSON.stringify(caseCollections);

      return prevStr === nextStr ? prev : caseCollections;
    });
  }, [caseCollections]);

  const toggleCase = (item) => {
    const _cases = [...selectedCases];
    const index = _cases.findIndex((val) => val._id === item._id);
    if (index > -1) {
      _cases.splice(index, 1);
    } else {
      _cases.push(item);
    }
    dispatch(
      SetPATIENT({
        ...appointment,
        consultation: { ...consultation, cases: _cases },
      })
    );
  };

  const removeCase = (item) => {
    const _cases = [...selectedCases];
    const index = _cases.findIndex((val) => val._id === item._id);
    _cases.splice(index, 1);
    dispatch(
      SetPATIENT({
        ...appointment,
        consultation: { ...consultation, cases: _cases },
      })
    );
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
          {/* <div className="checkup-data-toolkit-button-skeleton" /> */}
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
                hideButton={caseCollections.length > 0}
                setFiltered={(items) => setCases(items)}
                reset={() => setCases(caseCollections)}
                collections={caseCollections}
                handleAdd={(value) => {
                  setShow(true);
                  setDefaultCase(value);
                }}
              />
            </div>
            {cases.length > 0 ? (
              cases.map((item) => (
                <button
                  className={`w-100 ${
                    selectedCases.some((val) => val?._id === item?._id)
                      ? "selected"
                      : ""
                  } ${patient?.isMale ? "male" : "female"}`}
                  key={item?._id}
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
          {/* {Array.from({ length: 3 }).map((_, i) => (
            <div
              key={i}
              className="checkup-data-toolkit-button-case-selected-item-skeleton"
            >
              <div className="checkup-data-skeleton-circle"></div>
              <div className="checkup-data-skeleton-line"></div>
            </div>
          ))} */}
          {selectedCases.map((item) => (
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
