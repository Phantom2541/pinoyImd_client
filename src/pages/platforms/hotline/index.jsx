import React, { useState, useEffect } from "react";
import "./style.css";
import { MDBIcon } from "mdbreact";
import { useSelector, useDispatch } from "react-redux";
import { FILTERBYCATEGORY } from "../../../services/redux/slices/assets/providers";

export default function Hotline() {
  const { token, activePlatform } = useSelector(({ auth }) => auth);
  const { filtered } = useSelector(({ providers }) => providers);
  const dispatch = useDispatch();

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
            {filtered?.map((hotline, index) => {
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
            })}
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
