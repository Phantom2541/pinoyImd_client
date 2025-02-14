import React, { useState, useEffect } from "react";
import {
  MDBDropdown,
  MDBDropdownItem,
  MDBDropdownMenu,
  MDBDropdownToggle,
  MDBIcon,
} from "mdbreact";

export default function DTR() {
  const [date, setDate] = useState(null);
  const [timer, setTimer] = useState(null);
  const [clockedIn, setClockedIn] = useState(false);
  const [elapsedTime, setElapsedTime] = useState(0);

  useEffect(() => {
    const savedClockedIn = localStorage.getItem("clockedIn");
    const savedStartTime = localStorage.getItem("startTime");

    if (savedClockedIn === "true" && savedStartTime) {
      const savedStartDate = new Date(savedStartTime);
      const currentTime = new Date();
      const timeDiff = Math.floor((currentTime - savedStartDate) / 1000);
      setDate(savedStartDate);
      setClockedIn(true);
      setElapsedTime(timeDiff);
    }
  }, []);

  useEffect(() => {
    if (clockedIn) {
      localStorage.setItem("clockedIn", "true");
      localStorage.setItem("startTime", date.toISOString());
    } else {
      localStorage.removeItem("clockedIn");
      localStorage.removeItem("startTime");
    }
  }, [clockedIn, date]);

  useEffect(() => {
    if (date) {
      const timerId = setInterval(() => {
        const currentTime = new Date();
        const timeDiff = Math.floor((currentTime - date) / 1000);
        setElapsedTime(timeDiff);
      }, 1000);

      setTimer(timerId);

      return () => {
        clearInterval(timerId);
      };
    }
  }, [date]);

  const formatTime = (seconds) => {
    const hours = Math.floor(seconds / 3600);
    const minutes = Math.floor((seconds % 3600) / 60);
    const remainingSeconds = seconds % 60;

    return `${hours.toString().padStart(2, "0")}:${minutes
      .toString()
      .padStart(2, "0")}:${remainingSeconds.toString().padStart(2, "0")}`;
  };

  const handleClock = () => {
    if (clockedIn) {
      clearInterval(timer);
      setDate(null);
      setClockedIn(false);
      setElapsedTime(0);
    } else {
      const currentDate = new Date();
      setDate(currentDate);
      setClockedIn(true);
    }
  };

  return (
    <MDBDropdown>
      <MDBDropdownToggle nav caret>
        <MDBIcon icon="calendar-alt" />
        &nbsp;
        <span className="d-none d-md-inline">DTR</span>
      </MDBDropdownToggle>
      <MDBDropdownMenu right style={{ minWidth: "250px" }}>
        <MDBDropdownItem onClick={handleClock}>
          {clockedIn ? "Clock Out" : "Clock In"}
          {date && (
            <span className="float-right">
              <MDBIcon icon="clock" /> {formatTime(elapsedTime)}
            </span>
          )}
        </MDBDropdownItem>
        <MDBDropdownItem href="#!">Shifts</MDBDropdownItem>
      </MDBDropdownMenu>
    </MDBDropdown>
  );
}
