import React, { useState, useEffect } from "react";
import "./index.css";
import { generateCalendar } from "../../../../../../services/utilities";
import {
  SAVE,
  UPDATE,
} from "../../../../../../services/redux/slices/monitoring/temperature";
import { useSelector, useDispatch } from "react-redux";
import { MDBIcon } from "mdbreact";
import Swal from "sweetalert2";

const today = new Date();

export default function Calendar({ month, year }) {
  const { collections } = useSelector(({ temperatures }) => temperatures);
  const [temps, setTemps] = useState([]);
  const { token, activePlatform, auth } = useSelector(({ auth }) => auth);
  const dispatch = useDispatch();

  useEffect(() => {
    if (collections && collections.length) {
      setTemps(collections);
    }
  }, [collections]);
  //console.log(temps);

  const room = async (meridiem, entry) => {
    const { value: temp } = await Swal.fire({
      title: `Input Room ${meridiem} Temp`,
      input: "number",
      inputLabel: `*Only 2 decimals`,
      inputPlaceholder: "Enter temperature",
      inputAttributes: {
        step: "0.01", // Allows decimal input
      },
    });

    if (temp) {
      if (entry) {
        dispatch(
          UPDATE({
            data: {
              _id: entry._id,
              branchId: activePlatform?.branchId,
              userId: auth._id,
              [meridiem]: {
                room: temp,
                ref: entry?.[meridiem]?.ref,
              },
            },
            token,
          })
        );
      } else {
        dispatch(
          SAVE({
            data: {
              branchId: activePlatform?.branchId,
              userId: auth._id,
              [meridiem]: {
                room: temp,
                ref: entry?.[meridiem]?.ref,
              },
            },
            token,
          })
        ); // Include temp and meridiem in the payload
      }
      Swal.fire(`Entered Room ${meridiem} Temp: ${temp}`);
    }
  };

  const ref = async (meridiem, entry) => {
    const { value: temp } = await Swal.fire({
      title: `Input Ref ${meridiem} Temp`,
      input: "number",
      inputLabel: `*Only 2 decimals`,
      inputPlaceholder: "Enter temperature",
      inputAttributes: {
        step: "0.01", // Allows decimal input
      },
    });

    if (temp) {
      if (entry) {
        dispatch(
          UPDATE({
            data: {
              _id: entry._id,
              branchId: activePlatform?.branchId,
              userId: auth._id,
              [meridiem]: {
                ref: temp,
                room: entry?.[meridiem]?.room,
              },
            },
            token,
          })
        );
      } else {
        dispatch(
          SAVE({
            data: {
              branchId: activePlatform?.branchId,
              userId: auth._id,
              [meridiem]: {
                ref: temp,
                room: entry?.[meridiem]?.room,
              },
            },
            token,
          })
        ); // Include temp and meridiem in the payload
      }
      Swal.fire(`Entered Room ${meridiem} Temp: ${temp}`);
    }
  };

  return (
    <div className="pos-ledger-calendar">
      <div className="pos-ledger-calendar-header"> </div>
      <div className="pos-ledger-calendar-weeks">
        <div>Sun</div>
        <div>Mon</div>
        <div>Tue</div>
        <div>Wed</div>
        <div>Thu</div>
        <div>Fri</div>
        <div>Sat</div>
      </div>

      <div className="pos-ledger-calendar-daily">
        {generateCalendar(month, year).map(({ num, txt = "" }, index) => {
          const date = new Date(txt),
            week = txt.slice(0, 3),
            isPresent =
              date.getDate() === today.getDate() &&
              date.getMonth() === today.getMonth() &&
              date.getFullYear() === today.getFullYear(),
            isFuture = date > today;

          // Check if any entry exists for the current date
          const hasEntries = temps.some((entry) => {
            const entryDate = new Date(entry?.createdAt);
            return entryDate.toDateString() === date.toDateString(); // Compare only the date parts
          });

          // Get entry data if it exists for today's date
          const entry = temps.find((entry) => {
            const entryDate = new Date(entry?.createdAt);
            return entryDate.toDateString() === date.toDateString();
          });
          //console.log("entry", entry);

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
                    className={`${week === "Sun" && "sunday"} ${
                      isFuture && "future"
                    }`}
                  >
                    {num}
                  </small>
                  <span>
                    {isFuture || (
                      <>
                        <span style={{ textAlign: "left" }}>Room</span>
                        <span className="separator">|</span>
                        <span className="ref">Ref</span>
                        <br />
                        {hasEntries ? (
                          <>
                            {/* Morning Entries */}
                            <span>
                              {entry?.AM?.room}
                              <MDBIcon
                                icon={entry?.AM?.room ? "pencil-alt" : "plus"} // Change icon based on data
                                onClick={() => room("AM", entry)}
                              />
                            </span>
                            |
                            <span>
                              {entry?.AM?.ref} &nbsp;
                              <MDBIcon
                                icon={entry?.AM?.ref ? "pencil-alt" : "plus"} // Change icon based on data
                                onClick={() => ref("AM", entry)}
                              />
                              <strong>AM</strong>
                            </span>
                            <hr />
                            {/* Evening Entries */}
                            <span>
                              {entry?.PM?.room}
                              <MDBIcon
                                icon={entry?.PM?.room ? "pencil-alt" : "plus"} // Change icon based on data
                                onClick={() => room("PM", entry)}
                              />
                            </span>
                            |
                            <span>
                              {entry?.PM?.ref} &nbsp;
                              <MDBIcon
                                icon={entry?.PM?.ref ? "pencil-alt" : "plus"} // Change icon based on data
                                onClick={() => ref("PM", entry)}
                              />
                              <strong>PM</strong>
                            </span>
                          </>
                        ) : (
                          <>
                            <MDBIcon icon="plus" onClick={() => room("AM")} />
                            &nbsp; &nbsp;&nbsp; &nbsp;&nbsp;&nbsp;|&nbsp;
                            <MDBIcon icon="plus" onClick={() => ref("AM")} />
                            <br />
                            <hr />
                            <MDBIcon icon="plus" onClick={() => room("PM")} />
                            &nbsp; &nbsp;&nbsp; &nbsp;&nbsp;&nbsp;|&nbsp;
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
