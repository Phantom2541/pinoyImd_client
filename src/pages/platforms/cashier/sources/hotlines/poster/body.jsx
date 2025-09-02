import { useEffect, useState } from "react";
import { useSelector, useDispatch } from "react-redux";
import { MDBIcon } from "mdbreact";
import ReactDOM from "react-dom";
import Swal from "sweetalert2";
import {
  SetSELECTED,
  DESTROY,
  RESET,
} from "../../../../../../services/redux/slices/assets/providers";
import FireStation from "./../../../../../../assets/hotline/fire.jpg";
import "./style.css";

const Body = () => {
  const { token } = useSelector(({ auth }) => auth),
    { filtered, activePage, maxPage, isSuccess, formSubmitted } = useSelector(
      ({ providers }) => providers
    ),
    dispatch = useDispatch(),
    [showModal, setShowModal] = useState(false),
    [selectedHotline, setSelectedHotline] = useState(null);

  useEffect(() => {
    if (!formSubmitted && isSuccess) dispatch(RESET());
  }, [formSubmitted, isSuccess, dispatch]);

  const handleEdit = (hotlines) => {
    dispatch(SetSELECTED(hotlines));
    //console.log("SetSelected service :", service);
  };

  const handleDelete = (_id) => {
    Swal.fire({
      title: "Are you sure?",
      text: "You won't be able to revert this!",
      icon: "warning",
      showCancelButton: true,
      confirmButtonColor: "#3085d6",
      cancelButtonColor: "#d33",
      confirmButtonText: "Yes, delete it!",
    }).then((result) => {
      if (result.isConfirmed) {
        dispatch(DESTROY({ token, data: { _id } }));
      }
    });
  };

  function formatPhoneNumber(num) {
    // alisin lahat ng hindi digits
    let digits = num.replace(/\D/g, "");

    // kung nagsisimula sa 0, palitan ng +63
    if (digits.startsWith("0")) {
      digits = "+63" + digits.substring(1);
    }

    // i-format: +63 927 342 2159
    return digits.replace(
      /(\+63)(\d{3})(\d{3})(\d{4})/,
      (_, p1, p2, p3, p4) => `${p1} ${p2} ${p3} ${p4}`
    );
  }

  const itemsPerPage = maxPage; // Number of items per page
  const startIndex = (activePage - 1) * itemsPerPage;
  const endIndex = startIndex + itemsPerPage;
  const paginatedData = filtered.slice(startIndex, endIndex); // Get only items for the active page
  return (
    <div className="hotline-poster-container">
      {paginatedData?.map((hotline, index) => {
        const { _id, displayname, number, address } = hotline;
        return (
          <div key={`${index}-${_id}`} className="hotline-poster-card">
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
                src={FireStation}
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
    </div>
  );
};

export default Body;
