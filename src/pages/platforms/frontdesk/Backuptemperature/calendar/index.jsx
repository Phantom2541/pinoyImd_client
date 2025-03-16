import React, { useState, useEffect } from "react";
import "./index.css";
import { generateCalendar } from "../../../../../services/utilities";
import {
  SAVE,
  UPDATE,
} from "../../../../../services/redux/slices/monitoring/temperature";
import { useSelector, useDispatch } from "react-redux";
import { MDBIcon } from "mdbreact";
import Swal from "sweetalert2";

const today = new Date();

export default function Calendar({ month, year }) {
  const { collections } = useSelector(({ temperatures }) => temperatures);
  const { token, activePlatform, auth } = useSelector(({ auth }) => auth);
  const [temps, setTemps] = useState([]);
  const dispatch = useDispatch();

  // Ensure `collections` is always an array
  useEffect(() => {
    if (Array.isArray(collections)) {
      setTemps(collections);
    } else {
      setTemps([]); // Avoid errors if collections is not an array
    }
  }, [collections]);

  const room = async (meridiem, entry) => {
    const { value: temp } = await Swal.fire({
      title: `Input Room ${meridiem} Temp`,
      input: "number",
      inputLabel: `*Only 2 decimals`,
      inputPlaceholder: "Enter temperature",
      inputAttributes: { step: "0.01" },
    });

    if (temp) {
      dispatch(
        entry
          ? UPDATE({
              data: {
                _id: entry._id,
                branchId: activePlatform?.branchId,
                userId: auth._id,
                [meridiem]: { room: temp, ref: entry?.[meridiem]?.ref },
              },
              token,
            })
          : SAVE({
              data: {
                branchId: activePlatform?.branchId,
                userId: auth._id,
                [meridiem]: { room: temp, ref: entry?.[meridiem]?.ref },
              },
              token,
            })
      );
      Swal.fire(`Entered Room ${meridiem} Temp: ${temp}`);
    }
  };

  const ref = async (meridiem, entry) => {
    const { value: temp } = await Swal.fire({
      title: `Input Ref ${meridiem} Temp`,
      input: "number",
      inputLabel: `*Only 2 decimals`,
      inputPlaceholder: "Enter temperature",
      inputAttributes: { step: "0.01" },
    });

    if (temp) {
      dispatch(
        entry
          ? UPDATE({
              data: {
                _id: entry._id,
                branchId: activePlatform?.branchId,
                userId: auth._id,
                [meridiem]: { ref: temp, room: entry?.[meridiem]?.room },
              },
              token,
            })
          : SAVE({
              data: {
                branchId: activePlatform?.branchId,
                userId: auth._id,
                [meridiem]: { ref: temp, room: entry?.[meridiem]?.room },
              },
              token,
            })
      );
      Swal.fire(`Entered Ref ${meridiem} Temp: ${temp}`);
    }
  };

  return (
    <div className="pos-ledger-calendar">
      <div className="pos-ledger-calendar-header"></div>
      <div className="pos-ledger-calendar-weeks">
        <div>Sun</div> <div>Mon</div> <div>Tue</div> <div>Wed</div>{" "}
        <div>Thu</div> <div>Fri</div> <div>Sat</div>
      </div>

      <div className="pos-ledger-calendar-daily">
        {generateCalendar(month, year).map(({ num, txt = "" }, index) => {
          const date = new Date(txt);
          const isPresent = date.toDateString() === today.toDateString();
          const isFuture = date > today;

          // console.log("Checking temperatures data:", temps);
          // console.log("Date to compare:", date.toDateString());

          // Ensure temps is an array before running `.find()`
          const entry = Array.isArray(temps)
            ? temps.find((entry) => {
                if (!entry?.createdAt) return false;
                return (
                  new Date(entry.createdAt).toDateString() ===
                  date.toDateString()
                );
              })
            : undefined;

          return (
            <div
              style={{
                backgroundColor: isPresent ? "lightgreen" : "",
                minHeight: "100px",
              }}
              className={`${!num && "empty"}`}
              key={`pos-calendar-${index}`}
            >
              {num && (
                <>
                  <small
                    className={`${date.getDay() === 0 && "sunday"} ${
                      isFuture && "future"
                    }`}
                  >
                    {num}
                  </small>
                  <span>
                    {!isFuture && (
                      <>
                        <span style={{ textAlign: "left" }}>Room</span>
                        <span className="separator">|</span>
                        <span className="ref">Ref</span>
                        <br />
                        {entry ? (
                          <>
                            {/* Morning Entries */}
                            <span>
                              {entry?.AM?.room}
                              <MDBIcon
                                icon={entry?.AM?.room ? "pencil-alt" : "plus"}
                                onClick={() => room("AM", entry)}
                              />
                            </span>
                            |
                            <span>
                              {entry?.AM?.ref} &nbsp;
                              <MDBIcon
                                icon={entry?.AM?.ref ? "pencil-alt" : "plus"}
                                onClick={() => ref("AM", entry)}
                              />
                              <strong>AM</strong>
                            </span>
                            <hr />
                            {/* Evening Entries */}
                            <span>
                              {entry?.PM?.room}
                              <MDBIcon
                                icon={entry?.PM?.room ? "pencil-alt" : "plus"}
                                onClick={() => room("PM", entry)}
                              />
                            </span>
                            |
                            <span>
                              {entry?.PM?.ref} &nbsp;
                              <MDBIcon
                                icon={entry?.PM?.ref ? "pencil-alt" : "plus"}
                                onClick={() => ref("PM", entry)}
                              />
                              <strong>PM</strong>
                            </span>
                          </>
                        ) : (
                          <>
                            <MDBIcon icon="plus" onClick={() => room("AM")} />{" "}
                            &nbsp; &nbsp;|&nbsp;
                            <MDBIcon icon="plus" onClick={() => ref("AM")} />
                            <br />
                            <hr />
                            <MDBIcon
                              icon="plus"
                              onClick={() => room("PM")}
                            />{" "}
                            &nbsp; &nbsp;|&nbsp;
                            <MDBIcon icon="plus" onClick={() => ref("PM")} />
                          </>
                        )}
                      </>
                    )}
                  </span>
                </>
              )}
            </div>
          );
        })}
      </div>
    </div>
  );
}
