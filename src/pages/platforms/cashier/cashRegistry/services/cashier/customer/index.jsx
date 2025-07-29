import { useEffect, useState, useRef } from "react";
import { useSelector, useDispatch } from "react-redux";
import { MDBBtn, MDBIcon } from "mdbreact";
import Patient from "./form/patient";
import Classification from "./form/classification";
import {
  RESET_INSOURCE,
  SETPATIENT,
  SETSEARCHKEY,
} from "../../../../../../../services/redux/slices/commerce/pos/services/pos";
import { fullName, getAge } from "../../../../../../../services/utilities";
import { SearchUser as Search } from "../../../../../../../components/searchables";
import Swal from "sweetalert2";

export default function POS() {
  const { isLoading, message } = useSelector(({ users }) => users),
    { customer } = useSelector(({ pos }) => pos),
    [activeIndex, setActiveIndex] = useState(0),
    dispatch = useDispatch();

  const searchContainerRef = useRef(null);
  const origPositionRef = useRef(null);
  const [showPatientInfo, setShowPatientInfo] = useState(false);
  const [searchDone, setSearchDone] = useState(false);
  const [activateOrigHeight, setActivateOrigHeight] = useState(false);
  const [asOverlay, setAsOverlay] = useState(true);
  const frontRef = useRef(null);
  const backRef = useRef(null);
  const containerRef = useRef(null);

  useEffect(() => {
    const front = frontRef.current;
    const back = backRef.current;
    const container = containerRef.current;
    if (front && back && container) {
      container.style.height = `${
        activeIndex === 1 ? back.offsetHeight : front.offsetHeight
      }px`;
    }
  }, [activeIndex]);

  useEffect(() => {
    if (message.name === "Error") {
      Swal.fire({
        title: "Duplicate Entry",
        text: message.message,
        icon: "warning",
      });
    }
  }, [message]);

  const hideOverlay = () => {
    const overlay = document.querySelector(".cashier-pos-search-overlay");
    if (overlay) {
      overlay.style.transition = "opacity 0.3s ease";
      overlay.style.opacity = "0";
      setTimeout(() => {
        overlay.style.display = "none";
      }, 300);
    }
  };

  const animateSearchToTarget = (callback, fadeDelay = 900) => {
    const searchEl = searchContainerRef.current;
    const targetEl = origPositionRef.current;

    if (searchEl && targetEl) {
      const fromRect = searchEl.getBoundingClientRect();
      const toRect = targetEl.getBoundingClientRect();
      const deltaX =
        toRect.left + toRect.width / 2 - (fromRect.left + fromRect.width / 2);
      const deltaY = toRect.top - fromRect.top;
      const targetWidth = toRect.width;

      searchEl.style.transition =
        "transform 0.6s ease-in-out, width 0.6s ease-in-out";
      searchEl.style.transform = `translate(${deltaX}px, ${deltaY}px)`;
      searchEl.style.width = `${targetWidth}px`;

      setTimeout(() => {
        searchEl.style.transition = "opacity 0.4s ease";
        targetEl.style.transition = "opacity 0.4s ease";
        searchEl.style.opacity = "0";
        targetEl.style.opacity = "0";
        setTimeout(callback, 400);
      }, fadeDelay);
    } else {
      callback();
    }
  };

  const handleCustomer = (customer) => {
    hideOverlay();
    setActivateOrigHeight(true);

    animateSearchToTarget(
      () => {
        dispatch(SETPATIENT(customer));
        setShowPatientInfo(true);
        setSearchDone(true);
      },
      asOverlay ? 900 : 300
    );
  };

  const handleRegister = (customer) => {
    if (isLoading) return;
    if (!activeIndex) setActiveIndex(1);
    dispatch(SETSEARCHKEY(customer));

    const searchEl = searchContainerRef.current;
    const targetEl = origPositionRef.current;

    if (searchEl && targetEl && asOverlay) {
      hideOverlay();
      setActivateOrigHeight(true);

      const fromRect = searchEl.getBoundingClientRect();
      const toRect = targetEl.getBoundingClientRect();
      const deltaX =
        toRect.left + toRect.width / 2 - (fromRect.left + fromRect.width / 2);
      const deltaY = toRect.top - fromRect.top;
      const targetWidth = toRect.width;

      searchEl.style.transition =
        "transform 0.6s ease-in-out, width 0.6s ease-in-out";
      searchEl.style.transform = `translate(${deltaX}px, ${deltaY}px)`;
      searchEl.style.width = `${targetWidth}px`;

      setTimeout(() => {
        searchEl.style.transition = "none";
        searchEl.style.transform = "none";
        searchEl.style.width = "100%";
        setAsOverlay(false);
      }, 700);
    }
  };

  const clearPatient = () => {
    dispatch(SETPATIENT({}));
    dispatch(RESET_INSOURCE());

    const searchEl = searchContainerRef.current;
    const overlay = document.querySelector(".cashier-pos-search-overlay");

    if (searchEl) {
      searchEl.style.transition = "none";
      searchEl.style.transform = "none";
      searchEl.style.opacity = "1";
    }

    if (overlay) {
      overlay.style.display = "none";
      overlay.style.opacity = "0";
    }

    setAsOverlay(false);
    setSearchDone(false);
    setShowPatientInfo(false);
    setActivateOrigHeight(false);
  };

  useEffect(() => {
    const resetUI = () => {
      const searchEl = searchContainerRef.current;
      const overlay = document.querySelector(".cashier-pos-search-overlay");

      if (searchEl) {
        searchEl.style.transition = "none";
        searchEl.style.transform = "none";
        searchEl.style.opacity = "1";
        searchEl.style.width = "100%";
      }

      if (overlay) {
        overlay.style.display = "none";
        overlay.style.opacity = "0";
      }

      setSearchDone(false);
      setShowPatientInfo(false);
      setActivateOrigHeight(false);
      setAsOverlay(true);
      setActiveIndex(0);
    };

    // Add event listener
    window.addEventListener("reset-ui", resetUI);

    // Clean up on unmount
    return () => {
      window.removeEventListener("reset-ui", resetUI);
    };
  }, []);

  return (
    <div className="pos-container">
      <div
        className={`pos-container-header ${customer?._id && "pickedSearch"}`}
      >
        {customer?._id && showPatientInfo && (
          <div
            className="d-flex cashier-pos-fade-in"
            style={{ width: "100%", marginBottom: "-0.5rem" }}
          >
            <h5>
              <MDBIcon icon="mars" className="text-primary mr-2 mt-2" />
            </h5>
            <div style={{ width: "100%" }}>
              <div
                className="d-flex justify-content-between align-items-center"
                style={{ width: "100%" }}
              >
                <div>
                  <h5 style={{ fontWeight: "500" }}>
                    {fullName(customer?.fullName)} |{" "}
                    <span>{getAge(customer?.dob)}</span>
                  </h5>
                </div>
                <MDBBtn
                  color="danger"
                  title="Clear"
                  className="d-flex justify-content-center align-items-center p-0"
                  style={{
                    width: "33px",
                    aspectRatio: "1/1",
                    borderRadius: "50%",
                    fontSize: ".9rem",
                  }}
                  onClick={clearPatient}
                >
                  <MDBIcon icon="times" />
                </MDBBtn>
              </div>
              <h6 style={{ marginTop: "-0.6rem" }}>
                <span className="grey-text">Birthday:</span>
                <span className="ml-1" style={{ fontWeight: 400 }}>
                  {new Date(customer?.dob).toDateString()}
                </span>
              </h6>
            </div>
          </div>
        )}
        {!searchDone && (
          <div
            className={`cashier-pos-search-origPosition ${
              activateOrigHeight ? "active-height" : ""
            }`}
            ref={origPositionRef}
          >
            <div
              className={`cashier-pos-search-wrapper ${
                asOverlay ? "as-overlay" : "in-place"
              }`}
              style={{ overflow: asOverlay ? "hidden" : "visible" }}
            >
              {asOverlay && <div className="cashier-pos-search-overlay" />}
              <div
                className={`cashier-pos-search-container ${
                  asOverlay && "fixedWidth"
                }`}
                ref={searchContainerRef}
              >
                {asOverlay && (
                  <button
                    className="cashier-pos-search-close-button"
                    onClick={() => handleRegister("")}
                  >
                    <MDBIcon icon="times" />
                  </button>
                )}
                <Search
                  setPatient={handleCustomer}
                  setRegister={handleRegister}
                />
              </div>
            </div>
          </div>
        )}
      </div>

      <div className="pos-card-button">
        {["Class", "Patient"].map((name, index) => (
          <button
            key={`button-${index}`}
            className={`${activeIndex === index && "active"}`}
            onClick={() => setActiveIndex(index)}
          >
            {name}
            <MDBIcon
              icon={name === "Class" ? "cogs" : "user-injured"}
              className="pos-button-icon"
            />
          </button>
        ))}
      </div>

      <div className="pos-card-body" ref={containerRef}>
        <div className={`flip-card ${activeIndex === 1 ? "flipped" : ""}`}>
          <div className="flip-card-front" ref={frontRef}>
            <Classification />
          </div>
          <div className="flip-card-back" ref={backRef}>
            <Patient setActiveIndex={setActiveIndex} />
          </div>
        </div>
      </div>
    </div>
  );
}
