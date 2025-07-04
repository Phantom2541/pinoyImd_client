import React, { useState, useEffect } from "react";
import {
  MDBDropdown,
  MDBDropdownItem,
  MDBDropdownMenu,
  MDBDropdownToggle,
  MDBIcon,
} from "mdbreact";
import { useHistory } from "react-router";
import { useSelector } from "react-redux";
import axios from "axios";

export default function DTR() {
  const { activePlatform } = useSelector(({ auth }) => auth);
  const [dateIn, setDateIn] = useState(null);
  const [dateOut, setDateOut] = useState(null);
  const [ipIn, setIPIn] = useState("");
  const [ipOut, setIPOut] = useState("");
  const [clockedIn, setClockedIn] = useState(false);
  const history = useHistory();

  // Load stored DTR info
  useEffect(() => {
    const savedClockedIn = localStorage.getItem("clockedIn");
    const savedStartTime = localStorage.getItem("startTime");
    const savedEndTime = localStorage.getItem("endTime");
    const savedIPIn = localStorage.getItem("publicIP");
    const savedIPOut = localStorage.getItem("endIP");

    setClockedIn(savedClockedIn === "true");
    if (savedStartTime) setDateIn(new Date(savedStartTime));
    if (savedEndTime) setDateOut(new Date(savedEndTime));
    if (savedIPIn) setIPIn(savedIPIn);
    if (savedIPOut) setIPOut(savedIPOut);
  }, []);

  // Save all DTR data
  useEffect(() => {
    localStorage.setItem("clockedIn", clockedIn.toString());
    if (dateIn) localStorage.setItem("startTime", dateIn.toISOString());
    if (dateOut) localStorage.setItem("endTime", dateOut.toISOString());
    if (ipIn) localStorage.setItem("publicIP", ipIn);
    if (ipOut) localStorage.setItem("endIP", ipOut);

    console.log("📦 Saved to localStorage:", {
      clockedIn,
      startTime: dateIn?.toISOString(),
      endTime: dateOut?.toISOString(),
      publicIP: ipIn,
      endIP: ipOut,
    });
  }, [clockedIn, dateIn, dateOut, ipIn, ipOut]);

  const handleClock = async () => {
    const currentDate = new Date();

    try {
      // Use no credentials to avoid CORS issue
      const res = await axios.get("https://api.ipify.org?format=json", {
        withCredentials: false,
      });
      const currentIP = res.data.ip;

      if (clockedIn) {
        console.log("🛑 Clocking out...");
        setDateOut(currentDate);
        setIPOut(currentIP);
        setClockedIn(false);
      } else {
        console.log("✅ Clocking in...");
        setDateIn(currentDate);
        setIPIn(currentIP);
        setDateOut(null);
        setIPOut("");
        setClockedIn(true);
      }
    } catch (err) {
      console.error("❌ Failed to fetch IP address:", err);
      if (clockedIn) {
        setIPOut("Unavailable");
        setDateOut(currentDate);
        setClockedIn(false);
      } else {
        setIPIn("Unavailable");
        setDateIn(currentDate);
        setClockedIn(true);
      }
    }
  };

  const format = (date) =>
    date?.toLocaleString("en-US", {
      year: "numeric",
      month: "short",
      day: "2-digit",
      hour: "2-digit",
      minute: "2-digit",
      second: "2-digit",
    });

  return (
    <MDBDropdown>
      <MDBDropdownToggle nav caret>
        <MDBIcon icon="calendar-alt" />
        &nbsp;
        <span className="d-none d-md-inline">DTR</span>
      </MDBDropdownToggle>
      <MDBDropdownMenu right style={{ minWidth: "300px" }}>
        <MDBDropdownItem onClick={handleClock}>
          {clockedIn ? "Clock Out" : "Clock In"}

          <div className="text-right mt-2 small">
            {dateIn && (
              <div>
                🟢 In: {format(dateIn)}
                <br />
                🌐 {ipIn}
              </div>
            )}
            {dateOut && (
              <div className="mt-2">
                🔴 Out: {format(dateOut)}
                <br />
                🌐 {ipOut}
              </div>
            )}
          </div>
        </MDBDropdownItem>
        <MDBDropdownItem
          onClick={() => {
            const target = `${activePlatform?.platform?.toLowerCase()}/shifts`;
            if (history.location.pathname !== `/${target}`) {
              history.push(`/${target}`);
            }
          }}
        >
          Shifts
        </MDBDropdownItem>
      </MDBDropdownMenu>
    </MDBDropdown>
  );
}
