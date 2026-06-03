import { useEffect, useState } from "react";
import { useSelector, useDispatch } from "react-redux";
import { MDBIcon } from "mdbreact";
import ReactDOM from "react-dom";
import { RESET } from "../../../../../../services/redux/slices/assets/providers";
import FIRE from "./../../../../../../assets/hotline/fire.jpg";
import POLICE from "./../../../../../../assets/hotline/police.jpg";
import AMBULANCE from "./../../../../../../assets/hotline/ambulance.jpeg";
import HOSPITAL from "./../../../../../../assets/hotline/hospital.jpg";
import REDCROSS from "./../../../../../../assets/hotline/redcross.jpg";
import BARANGAY from "./../../../../../../assets/hotline/barangay.jpg";
import {
  formatPhoneNumber,
  getPrimaryDialNumber,
} from "../../../../../../services/utilities/phoneNumber";
import "./style.css";

const Body = () => {
  const {
      filtered = [],
      isSuccess,
      formSubmitted,
    } = useSelector(({ providers }) => providers),
    dispatch = useDispatch(),
    [showModal, setShowModal] = useState(false),
    [selectedHotline, setSelectedHotline] = useState(null);
  const [direction, setDirection] = useState("");

  // Pagination states
  const [currentPage, setCurrentPage] = useState(0);
  const itemsPerPage = 6; // ilang items per page
  const totalPages = Math.ceil((filtered?.length || 0) / itemsPerPage);

  useEffect(() => {
    if (!formSubmitted && isSuccess) dispatch(RESET());
  }, [formSubmitted, isSuccess, dispatch]);

  const stationImages = {
    "Fire Station": FIRE,
    "Police Station": POLICE,
    "Ambulance (EMS)": AMBULANCE,
    Hospital: HOSPITAL,
    "Red Cross": REDCROSS,
    "Barangay Hall": BARANGAY,
  };

  // slice data per page
  const paginatedData = filtered?.slice(
    currentPage * itemsPerPage,
    currentPage * itemsPerPage + itemsPerPage
  );

  return (
    <div className="hotline-poster-container">
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
              <span> {formatPhoneNumber(number || "") || "No number"}</span>
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
              <span title={address}>{address || "No address"}</span>
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
                  {formatPhoneNumber(selectedHotline.number) || "No number"}
                </span>
              </div>
              <span className="hotline-poster-number">
                {selectedHotline.displayname}
              </span>
              <div className="hotline-poster-address active">
                <img
                  alt=""
                  src={`https://api.qrserver.com/v1/create-qr-code/?size=200x200&data=tel:${getPrimaryDialNumber(
                    selectedHotline.number
                  )}`}
                />
                <span>{selectedHotline.address || "No address"}</span>
              </div>
            </div>
          </div>,
          document.body
        )}
    </div>
  );
};

export default Body;
