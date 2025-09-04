import React, { useState, useEffect } from "react";
import ReactDOM from "react-dom";

import "./style.css";
import { MDBIcon } from "mdbreact";
import { useSelector, useDispatch } from "react-redux";
import { RESET } from "../../../services/redux/slices/assets/providers";
import { FILTERBYCATEGORY } from "../../../services/redux/slices/assets/providers";
import FIRE from "./../../../assets/hotline/fire.jpg";
import POLICE from "./../../../assets/hotline/police.jpg";
import AMBULANCE from "./../../../assets/hotline/ambulance.jpeg";
import HOSPITAL from "./../../../assets/hotline/hospital.jpg";
import REDCROSS from "./../../../assets/hotline/redcross.jpg";
import BARANGAY from "./../../../assets/hotline/barangay.jpg";

export default function Hotline() {
  const { token, activePlatform } = useSelector(({ auth }) => auth);
  const { filtered, isSuccess, formSubmitted } = useSelector(
    ({ providers }) => providers
  );
  const dispatch = useDispatch();
  const [showModal, setShowModal] = useState(false),
    [selectedHotline, setSelectedHotline] = useState(null);
  const [direction, setDirection] = useState("");
  const [open, setOpen] = useState(false);

  useEffect(() => {
    if (token) {
      dispatch(
        FILTERBYCATEGORY({
          token,
          keys: { clients: activePlatform?.branchId, category: "hotline" },
        })
      );
    }
  }, [dispatch, token, activePlatform]);

  useEffect(() => {
    if (!formSubmitted && isSuccess) dispatch(RESET());
  }, [formSubmitted, isSuccess, dispatch]);

  function formatPhoneNumber(num = "") {
    if (!num) return "";
    let digits = num?.replace(/\D/g, "");
    if (digits.startsWith("0")) {
      digits = "+63" + digits.substring(1);
    }
    return digits.replace(
      /(\+63)(\d{3})(\d{3})(\d{4})/,
      (_, p1, p2, p3, p4) => `${p1} ${p2} ${p3} ${p4}`
    );
  }

  const stationImages = {
    "Fire Station": FIRE,
    "Police Station": POLICE,
    "Ambulance (EMS)": AMBULANCE,
    Hospital: HOSPITAL,
    "Red Cross": REDCROSS,
    "Barangay Hall": BARANGAY,
  };

  // Pagination states (responsive)
  const [currentPage, setCurrentPage] = useState(0);
  const [itemsPerPage, setItemsPerPage] = useState(6);

  useEffect(() => {
    function handleResize() {
      if (window.innerWidth < 640) {
        setItemsPerPage(2); // mobile
      } else if (window.innerWidth < 1540) {
        setItemsPerPage(4); // tablet
      } else {
        setItemsPerPage(6); // desktop
      }
    }

    handleResize(); // initial check
    window.addEventListener("resize", handleResize);
    return () => window.removeEventListener("resize", handleResize);
  }, []);

  const totalPages = Math.ceil((filtered?.length || 0) / itemsPerPage);

  // slice data per page
  const paginatedData = filtered?.slice(
    currentPage * itemsPerPage,
    currentPage * itemsPerPage + itemsPerPage
  );

  return (
    <div className="hotline-global-container">
      {/* Single button to open modal */}
      <button
        className="hotline-global-modal-open"
        onClick={() => setOpen(true)}
      >
        <span>
          <MDBIcon fas icon="phone-alt" />
        </span>
        Hotlines
      </button>

      {/* One modal only */}
      <div className={`hotline-global-modal ${open ? "open" : ""}`}>
        <div className="hotlines-global-modal-content">
          <div className="hotlines-global-list-header">
            <span>Emergency lines</span>
            <span>
              <MDBIcon fas icon="phone-volume" />
            </span>
          </div>

          {/* Loop all hotlines here */}
          <div className="hotlines-global-list-container">
            {paginatedData?.map((hotline, index) => {
              const { _id, displayname, number, address } = hotline;
              return (
                <div
                  key={`${index}-${_id}`}
                  className={`hotline-poster-card fade-in ${
                    direction === "right" ? "from-right" : "from-left"
                  }`}
                >
                  <div className="hotline-poster-title">
                    <span>
                      <MDBIcon fas icon="phone-alt" />
                    </span>
                    <span> {formatPhoneNumber(number) || "No number"}</span>
                  </div>
                  <span className="hotline-poster-number">{displayname}</span>
                  <div className="hotline-poster-address">
                    <img
                      alt=""
                      title="Click to View QR Code"
                      src={stationImages[displayname] || FIRE}
                      onClick={() => {
                        setSelectedHotline(hotline);
                        setShowModal(true);
                      }}
                    />
                    <span className="hotline-slant" title={address}>
                      {address || "No address"}
                    </span>
                  </div>
                </div>
              );
            })}

            {/* Pagination controls */}
            {totalPages > 1 && (
              <>
                <button
                  className="hotline-arrow-btn left"
                  onClick={() => {
                    setDirection("left");
                    setCurrentPage((prev) => prev - 1);
                  }}
                  disabled={currentPage === 0}
                >
                  <MDBIcon fas icon="chevron-left" />
                </button>

                <button
                  className="hotline-arrow-btn right"
                  onClick={() => {
                    setDirection("right");
                    setCurrentPage((prev) => prev + 1);
                  }}
                  disabled={currentPage === totalPages - 1}
                >
                  <MDBIcon fas icon="chevron-right" />
                </button>
              </>
            )}

            {/* Modal overlay */}
            {showModal &&
              selectedHotline &&
              ReactDOM.createPortal(
                <div
                  className="hotline-poster-mask"
                  onClick={() => setShowModal(false)}
                >
                  <div
                    className="hotline-poster-card active"
                    onClick={(e) => e.stopPropagation()}
                  >
                    <div className="hotline-poster-title">
                      <span>
                        <MDBIcon fas icon="phone-alt" />
                      </span>
                      <span>
                        {formatPhoneNumber(selectedHotline.number) ||
                          "No number"}
                      </span>
                    </div>
                    <span className="hotline-poster-number">
                      {selectedHotline.displayname}
                    </span>
                    <div className="hotline-poster-address active">
                      <img
                        alt=""
                        src={`https://api.qrserver.com/v1/create-qr-code/?size=200x200&data=tel:${formatPhoneNumber(
                          selectedHotline.number
                        )}`}
                      />
                      <span>{selectedHotline.address || "No address"}</span>
                    </div>
                  </div>
                </div>,
                document.body
              )}
            {/* {filtered?.map((hotline, index) => {
              const { _id, displayname, number, address } = hotline;
              return (
                <div key={_id || index} className="hotlines-global-list">
                  <label>{displayname || "Police Station"}</label>
                  <div>
                    <span>
                      <MDBIcon icon="phone-alt" />
                      {number || "+63 912 345 6789"}
                    </span>
                    <span title={address}>
                      <MDBIcon fas icon="map-marker-alt" className="mr-2" />
                      {address || "Poblacion Central G.T"}
                    </span>
                  </div>
                </div>
              );
            })} */}
          </div>

          {/* Close button */}
          <button
            className="hotlines-global-modal-close"
            onClick={() => setOpen(false)}
          >
            <MDBIcon icon="times" />
          </button>
        </div>
      </div>
    </div>
  );
}
