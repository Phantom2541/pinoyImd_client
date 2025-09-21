import React, { useState, useEffect, useRef } from "react";
import SideNavigation from "../../components/sidebar";
import TopNavigation from "../../components/topbar";
import Routes from "../Routes";
import Login from "../home/login";
import { useDispatch, useSelector } from "react-redux";
import { fullName, socket } from "../../services/utilities";
import { NETWORK } from "../../services/redux/slices/assets/persons/auth";
import bell from "../../assets/bell.mp3";
import Swal from "sweetalert2";

const breakWidth = 1400;
export default function Platforms() {
  const [show, setShow] = useState(false),
    [windowWidth, setWindowWidth] = useState(window.innerWidth),
    [sideNavToggled, setSideNavToggled] = useState(false),
    [dynamicLeftPadding, setDynamicLeftPadding] = useState("0"),
    { email, auth, token, isOnline } = useSelector(({ auth }) => auth),
    dispatch = useDispatch(),
    audioRef = useRef(null);

  const handleResize = () => setWindowWidth(window.innerWidth);

  useEffect(() => {
    if (!token && !email) {
      window.location.href = "/";
    }
  }, [token, email]);

  useEffect(() => {
    audioRef.current = new Audio(bell);
  }, []);

  useEffect(() => {
    if (!auth?._id) return;

    socket.emit("join_room", auth._id);
    socket.on("received_checkup_done", (data) => {
      if (audioRef.current) {
        audioRef.current.play().catch((err) => {
          console.warn("Audio blocked until user interacts:", err);
        });
      }
      // show sweetalert
      Swal.fire({
        title: "Checkup Done",
        text: `Patient ${
          fullName(data.patient?.fullName) || "Unknown"
        } is done.`,
        icon: "info",
        confirmButtonText: "OK",
      });
    });

    return () => {
      socket.off("received_checkup_done");
    };
  }, [auth._id, socket]);
  useEffect(() => {
    socket.emit("join_room", auth._id);
  }, [auth._id]);

  useEffect(() => {
    const handleOnline = () => dispatch(NETWORK(true));
    const handleOffline = () => dispatch(NETWORK(false));

    window.addEventListener("online", handleOnline);
    window.addEventListener("offline", handleOffline);

    return () => {
      window.removeEventListener("online", handleOnline);
      window.removeEventListener("offline", handleOffline);
    };
  }, [dispatch]);

  useEffect(() => {
    if ((email && !auth._id) || !isOnline) {
      setShow(true);
    } else {
      setShow(false);
    }
  }, [email, auth, isOnline, dispatch]);

  useEffect(() => {
    if (windowWidth > breakWidth) {
      setDynamicLeftPadding("250px"); // 150
    } else {
      setDynamicLeftPadding("0");
    }
  }, [windowWidth]);

  useEffect(() => {
    window.addEventListener("resize", handleResize);

    return () => {
      window.removeEventListener("resize", handleResize);
    };
  }, []);
  const toggleSideNav = () => {
    if (windowWidth < breakWidth) {
      setSideNavToggled(!sideNavToggled);
    }
  };

  return (
    <div className="app">
      <SideNavigation
        breakWidth={breakWidth}
        style={{ transition: "all .3s" }}
        triggerOpening={sideNavToggled}
        onLinkClick={toggleSideNav}
      />
      <div className="flexible-content white-skin">
        <TopNavigation
          toggle={windowWidth < breakWidth}
          onSideNavToggleClick={toggleSideNav}
          className="white-skin"
        />
        <main
          style={{ paddingLeft: dynamicLeftPadding, margin: "7rem 1% 6rem" }}
        >
          <Login show={show} />
          <Routes />
        </main>
      </div>
    </div>
  );
}
