import React, { useState, useEffect } from "react";
import {
  MDBDropdown,
  MDBDropdownItem,
  MDBDropdownMenu,
  MDBDropdownToggle,
  MDBIcon,
} from "mdbreact";
import { useHistory } from "react-router";
import { useDispatch, useSelector } from "react-redux";
import axios from "axios";
import { UPDATE } from "../../../services/redux/slices/market/attendances";

export default function DTR({
  currentAffiliation = {},
  selectedPlatform = "",
}) {
  const { activePlatform, auth, token } = useSelector(({ auth }) => auth);
  const [dateIn, setDateIn] = useState(null);
  const [dateOut, setDateOut] = useState(null);
  const [ipIn, setIPIn] = useState("");
  const [ipOut, setIPOut] = useState("");
  const [clockedIn, setClockedIn] = useState(false);
  const dispatch = useDispatch();
  const history = useHistory();
  const branchId =
    currentAffiliation?.branch?._id ||
    currentAffiliation?.branchId ||
    currentAffiliation?.branch ||
    activePlatform?.branchId;
  const routePlatform =
    selectedPlatform || currentAffiliation?.activePlatform || activePlatform?.platform || "";

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
  }, [clockedIn, dateIn, dateOut, ipIn, ipOut, dispatch, activePlatform]);

  const handleClock = async () => {
    const currentDate = new Date();
    const hour = currentDate.getHours();
    const timeString = currentDate.toLocaleTimeString("en-US", {
      hour: "2-digit",
      minute: "2-digit",
      hour12: true,
    });

    try {
      const res = await axios.get("https://api.ipify.org?format=json", {
        withCredentials: false,
      });
      const currentIP = res.data.ip;

      const attendanceData = {
        branchId,
        userId: auth?._id,
        publicIP: currentIP,
      };

      if (clockedIn) {
        console.log("🛑 Clocking out...");
        setDateOut(currentDate);
        setIPOut(currentIP);
        setClockedIn(false);

        // ➕ Save time-out to am or pm
        if (hour < 12) {
          attendanceData.am = { out: timeString };
        } else {
          attendanceData.pm = { out: timeString };
        }
      } else {
        console.log("✅ Clocking in...");
        setDateIn(currentDate);
        setIPIn(currentIP);
        setDateOut(null);
        setIPOut("");
        setClockedIn(true);

        // ➕ Save time-in to am or pm
        if (hour < 12) {
          attendanceData.am = { in: timeString };
        } else {
          attendanceData.pm = { in: timeString };
        }
      }

      console.log("attendanceData", attendanceData);

      dispatch(
        UPDATE({
          data: attendanceData,
          token,
        })
      );
    } catch (err) {
      console.error("❌ Failed to fetch IP address:", err);

      const fallbackData = {
        branchId,
        userId: auth?._id,
        publicIP: "Unavailable",
      };

      if (clockedIn) {
        fallbackData.pm = { out: timeString };
        setDateOut(currentDate);
        setClockedIn(false);
      } else {
        fallbackData.am = { in: timeString };
        setDateIn(currentDate);
        setClockedIn(true);
      }

      dispatch(
        UPDATE({
          data: fallbackData,
          token,
        })
      );
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
            const target = `${String(routePlatform).toLowerCase()}/shifts`;
            if (history.location.pathname !== `/${target}`) {
              history.push(`/${target}`);
            }
          }}
        >
          Shifts
        </MDBDropdownItem>
        <MDBDropdownItem
          onClick={() => {
            const target = `${String(routePlatform).toLowerCase()}/shifts`;
            if (history.location.pathname !== `/${target}`) {
              history.push(`/${target}`);
            }
          }}
        >
          Schedule @Darrel ilagay mo dito work mo.
        </MDBDropdownItem>
      </MDBDropdownMenu>
    </MDBDropdown>
  );
}
