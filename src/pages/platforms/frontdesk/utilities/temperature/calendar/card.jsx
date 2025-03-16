import React, { useState } from "react";
import { useDispatch, useSelector } from "react-redux";
import Swal from "sweetalert2";
import { MDBIcon } from "mdbreact";
import {
  SAVE,
  UPDATE,
} from "../../../../../../services/redux/slices/monitoring/temperature";
import "./style.css";

const DayCell = ({ num, txt }) => {
  const dispatch = useDispatch();
  const { token, activePlatform, auth } = useSelector(({ auth }) => auth);
  const { collections } = useSelector(({ temperatures }) => temperatures);
  const [isHovered, setIsHovered] = useState(false);

  const today = new Date();
  const date = new Date(txt);
  const isPresent = date.toDateString() === today.toDateString();
  const isFuture = date > today;

  const entry = collections?.find(
    (entry) => new Date(entry?.createdAt).toDateString() === date.toDateString()
  );

  const handleTempInput = async (type, meridiem) => {
    const { value: temp } = await Swal.fire({
      title: `Input ${type} ${meridiem} Temp`,
      input: "number",
      inputLabel: "*Only 2 decimals",
      inputPlaceholder: "Enter temperature",
      inputAttributes: { step: "0.01" },
      showCancelButton: true,
      confirmButtonText: "Save",
      cancelButtonText: "Cancel",
    });

    if (temp) {
      dispatch(
        entry
          ? UPDATE({
              data: {
                _id: entry._id,
                branchId: activePlatform?.branchId,
                userId: auth._id,
                createdAt: entry.createdAt,
                [meridiem]: {
                  ...entry?.[meridiem],
                  [type]: temp,
                },
              },
              token,
            })
          : SAVE({
              data: {
                branchId: activePlatform?.branchId,
                userId: auth._id,
                createdAt: txt,
                [meridiem]: { [type]: temp },
              },
              token,
            })
      );
      Swal.fire(`Entered ${type} ${meridiem} Temp: ${temp} on ${txt}`);
    }
  };

  return (
    <div
      className={`day-cell ${!num ? "empty" : ""}`}
      style={{
        backgroundColor: isPresent ? "lightgreen" : "",
        minHeight: "135px",
        position: "relative",
      }}
      onMouseEnter={() => setIsHovered(true)}
      onMouseLeave={() => setIsHovered(false)}
    >
      {num && (
        <>
          <small
            className={`${date.getDay() === 0 ? "sunday" : ""} ${
              isFuture ? "future" : ""
            }`}
          >
            {num}
          </small>

          {!isFuture && (
            <>
              <span>
                <span style={{ textAlign: "left" }}>Room </span>
                <span>|</span>
                <span> Ref</span>
                <br />
                {entry
                  ? `${entry?.AM?.room || "-"} | ${entry?.AM?.ref || "-"}`
                  : "No Data"}
                <strong> AM</strong>
              </span>
              <hr className="temperature-divider" />

              <span>
                {entry
                  ? `${entry?.PM?.room || "-"} | ${entry?.PM?.ref || "-"}`
                  : "No Data"}
                <strong> PM</strong>
              </span>

              {isHovered && (
                <div className="icon-container">
                  <MDBIcon
                    icon="pencil-alt"
                    className="hover-icon"
                    onClick={() => handleTempInput("room", "AM")}
                  />

                  <MDBIcon
                    icon="pencil-alt"
                    className="hover-icon"
                    onClick={() => handleTempInput("ref", "AM")}
                  />

                  <MDBIcon
                    icon="pencil-alt"
                    className="hover-icon"
                    onClick={() => handleTempInput("room", "PM")}
                  />

                  <MDBIcon
                    icon="pencil-alt"
                    className="hover-icon"
                    onClick={() => handleTempInput("ref", "PM")}
                  />
                </div>
              )}
            </>
          )}
        </>
      )}
    </div>
  );
};

export default DayCell;
