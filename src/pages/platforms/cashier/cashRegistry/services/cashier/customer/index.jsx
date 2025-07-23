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
  const [searchDone, setSearchDone] = useState(false); // trigger animation
  const [activateOrigHeight, setActivateOrigHeight] = useState(false);
  const [asOverlay, setAsOverlay] = useState(true);
  const flipContainerRef = useRef(null);

  // if a newPatient id is present and active index is 1
  // it means a new patient has been injected, you should go back to POS
  useEffect(() => {
    if (message.name === "Error") {
      console.log("message", message);

      Swal.fire({
        title: "Duplicate Entry",
        text: message.message,
        icon: "warning",
      });
    }
  }, [message]);

  const handleCustomer = (customer) => {
    const searchEl = searchContainerRef.current;
    const targetEl = origPositionRef.current;

    if (searchEl && targetEl) {
      // Step 1: Fade out overlay
      const overlay = document.querySelector(".cashier-pos-search-overlay");
      if (overlay) {
        overlay.style.transition = "opacity 0.3s ease";
        overlay.style.opacity = "0";
        setTimeout(() => {
          overlay.style.display = "none";
        }, 300);
      }

      // Step 2: Show target container height
      setActivateOrigHeight(true);

      // Step 3: Calculate movement
      const fromRect = searchEl.getBoundingClientRect();
      const toRect = targetEl.getBoundingClientRect();

      const deltaX = toRect.left - fromRect.left;
      const deltaY = toRect.top - fromRect.top;

      // Step 4: Move the search container
      searchEl.style.transition = "transform 0.6s ease-in-out";
      searchEl.style.transform = `translate(${deltaX}px, ${deltaY}px)`;

      // Step 5: Wait + fade out both elements after 1 second

      const fadeDuration = asOverlay ? 900 : 300;

      setTimeout(() => {
        // Apply fade to both
        targetEl.style.transition = "opacity 0.4s ease";
        searchEl.style.transition = "opacity 0.4s ease";

        targetEl.style.opacity = "0";
        searchEl.style.opacity = "0";

        // Final cleanup after fade
        setTimeout(() => {
          setSearchDone(true); // hide both
          dispatch(SETPATIENT(customer));
          setShowPatientInfo(true); // show patient info
        }, 400);
      }, fadeDuration); // 600ms move + 1s delay
    } else {
      dispatch(SETPATIENT(customer));
      setShowPatientInfo(true);
    }
  };

  const handleRegister = (customer) => {
    if (isLoading) return;
    if (!activeIndex) setActiveIndex(1);
    dispatch(SETSEARCHKEY(customer));

    const searchEl = searchContainerRef.current;
    const targetEl = origPositionRef.current;

    if (searchEl && targetEl) {
      // Step 1: Fade out overlay
      const overlay = document.querySelector(".cashier-pos-search-overlay");
      if (overlay) {
        overlay.style.transition = "opacity 0.3s ease";
        overlay.style.opacity = "0";
        setTimeout(() => {
          overlay.style.display = "none";
        }, 300);
      }

      // Step 2: Show target container height
      setActivateOrigHeight(true);

      // Step 3: Calculate movement
      const fromRect = searchEl.getBoundingClientRect();
      const toRect = targetEl.getBoundingClientRect();

      const deltaX = toRect.left - fromRect.left;
      const deltaY = toRect.top - fromRect.top;

      // Step 4: Move the search container
      searchEl.style.transition = "transform 0.6s ease-in-out";
      searchEl.style.transform = `translate(${deltaX}px, ${deltaY}px)`;

      // Step 5: Fade out
      const fadeDuration = asOverlay ? 900 : 300;

      setTimeout(() => {
        targetEl.style.transition = "opacity 0.4s ease";
        searchEl.style.transition = "opacity 0.4s ease";

        targetEl.style.opacity = "0";
        searchEl.style.opacity = "0";

        setTimeout(() => {
          setSearchDone(true);
          setShowPatientInfo(true);
        }, 400);
      }, fadeDuration);
    } else {
      setShowPatientInfo(true);
    }
  };

  useEffect(() => {
    const front = document.querySelector(".flip-card-front");
    const back = document.querySelector(".flip-card-back");
    const container = flipContainerRef.current;

    if (front && back && container) {
      const newHeight =
        activeIndex === 1 ? back.offsetHeight : front.offsetHeight + 20;
      container.style.height = `${newHeight}px`;
    }
  }, [activeIndex]);

  return (
    <div className="pos-container">
      <div
        className={`pos-container-header  ${customer?._id && "pickedSearch"}`}
      >
        {customer?._id && showPatientInfo && (
          <div
            style={{
              width: "100%",
              marginBottom: "-0.5rem",
            }}
            className="d-flex cashier-pos-fade-in"
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
                  rounded
                  color="danger"
                  title="Clear"
                  size="sm"
                  onClick={() => {
                    dispatch(SETPATIENT({}));
                    dispatch(RESET_INSOURCE());

                    const searchEl = searchContainerRef.current;
                    const overlay = document.querySelector(
                      ".cashier-pos-search-overlay"
                    );

                    if (searchEl) {
                      searchEl.style.transition = "none";
                      searchEl.style.transform = "none";
                      searchEl.style.opacity = "1";
                    }

                    if (overlay) {
                      overlay.style.display = "none"; // hide na lang
                      overlay.style.opacity = "0";
                    }

                    // Important:
                    setAsOverlay(false); // ⬅️ render search in original position only

                    setSearchDone(false);
                    setShowPatientInfo(false);
                    setActivateOrigHeight(false);
                  }}
                  className="px-2"
                >
                  <MDBIcon icon="times" />
                </MDBBtn>
              </div>
              <h6
                style={{
                  marginTop: "-0.6rem",
                  display: "block",
                }}
              >
                <span className="grey-text">Birthday:</span>
                <span style={{ fontWeight: 400 }} className="ml-1">
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
              {!searchDone && asOverlay && (
                <div
                  className={`cashier-pos-search-overlay ${
                    asOverlay && "fadeInSearchContainer"
                  }`}
                />
              )}
              <div
                className="cashier-pos-search-container"
                ref={searchContainerRef}
              >
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
        {["Class", "Patient"]?.map((name, index) => {
          return (
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
          );
        })}
      </div>
      <div className="pos-card">
        <div className="pos-card-body">
          <div className={`flip-card-container `} ref={flipContainerRef}>
            <div
              className={`flip-card-inner ${
                activeIndex === 1 ? "flipped" : ""
              }`}
            >
              <section className="flip-card-front">
                <Classification />
              </section>
              <section className="flip-card-back">
                <Patient setActiveIndex={setActiveIndex} />
              </section>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}
