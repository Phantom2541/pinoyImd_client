import React, { useEffect, useState } from "react";
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

export default function Calendar() {
  // Redux state for month & year
  const { collections, month, year } = useSelector(
    (state) => state.temperatures
  );
  const { token, activePlatform, auth } = useSelector((state) => state.auth);
  const dispatch = useDispatch();

  const [temps, setTemps] = useState([]);

  // Update temps when collections change
  useEffect(() => {
    setTemps(Array.isArray(collections) ? collections : []);
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

  return (
    <div className="pos-ledger-calendar">
      <div className="pos-ledger-calendar-header"></div>
      <div className="pos-ledger-calendar-weeks">
        <div>Sun</div> <div>Mon</div> <div>Tue</div> <div>Wed</div>
        <div>Thu</div> <div>Fri</div> <div>Sat</div>
      </div>

      <div className="pos-ledger-calendar-daily">
        {generateCalendar(month, year).map(({ num, txt = "" }, index) => {
          const date = new Date(txt);
          const isPresent = date.toDateString() === today.toDateString();
          const isFuture = date > today;

          // Find matching entry from Redux state
          const entry = Array.isArray(temps)
            ? temps.find(
                (entry) =>
                  entry?.createdAt &&
                  new Date(entry.createdAt).toDateString() ===
                    date.toDateString()
              )
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
                                onClick={() => room("AM", entry)}
                              />
                              <strong>AM</strong>
                            </span>
                            <hr />
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
                                onClick={() => room("PM", entry)}
                              />
                              <strong>PM</strong>
                            </span>
                          </>
                        ) : (
                          <>
                            <MDBIcon icon="plus" onClick={() => room("AM")} />
                            &nbsp; &nbsp;|&nbsp;
                            <MDBIcon icon="plus" onClick={() => room("PM")} />
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
