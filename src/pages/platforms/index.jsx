import React, { useState, useEffect } from "react";
import SideNavigation from "../../components/sidebar";
import TopNavigation from "../../components/topbar";
import Routes from "../Routes";
import Login from "../home/login";
import { useDispatch, useSelector } from "react-redux";
import { socket } from "../../services/utilities";
import { NETWORK } from "../../services/redux/slices/assets/persons/auth";
import { useToasts } from "react-toast-notifications";
import {
  InsertRealtimeTask,
  UpdateRealtimeTask,
} from "../../services/redux/slices/diagnostics/laboratory/validator";
import {
  InsertRealtimeOnboard,
  UpdateRealtimeOnboard,
} from "../../services/redux/slices/commerce/pos/services/taskGenerator";
import { IDB_BROWSE } from "../../services/indexDB/commerce/pos/services/onboardings";
const departmentMapping = {
  laboratory: "LAB",
  radiology: "RAD",
};
const breakWidth = 1400;
export default function Platforms() {
  const { activePlatform } = useSelector(({ auth }) => auth),
    departmentCode =
      departmentMapping[activePlatform?.department?.toLowerCase()],
    [show, setShow] = useState(false),
    [windowWidth, setWindowWidth] = useState(window.innerWidth),
    [sideNavToggled, setSideNavToggled] = useState(false),
    [dynamicLeftPadding, setDynamicLeftPadding] = useState("0"),
    { email, auth, token, isOnline } = useSelector(({ auth }) => auth),
    { collections: onboardings } = useSelector(
      ({ taskGenerator }) => taskGenerator
    ),
    dispatch = useDispatch(),
    { addToast } = useToasts();

  const handleResize = () => setWindowWidth(window.innerWidth);

  useEffect(() => {
    if (!token && !email) {
      window.location.href = "/";
    }
  }, [token, email]);

  useEffect(() => {
    socket.on("me", (id) => {
      // console.log(`[Socket] ${id} Connected.`);
    });

    return () => socket.off("me");
  }, []);

  //received task
  useEffect(() => {
    socket.on("received_tasks", (data) => {
      const { branchId } = activePlatform;
      if (
        data?.branchId?._id === branchId &&
        data?.department === departmentCode
      ) {
        dispatch(InsertRealtimeTask(data));
        addToast(`New patient task has been received`, {
          appearance: "success",
        });
      }
    });
    return () => {
      socket.off("received_tasks");
    };
  }, [activePlatform, dispatch, addToast, departmentCode]);

  //received onboard
  useEffect(() => {
    socket.on("received_onboard", (data) => {
      const { branchId, department } = activePlatform;
      if (
        data?.branchId === branchId &&
        data?.department === department &&
        data?._id
      ) {
        const pn = onboardings.length + 1;
        dispatch(InsertRealtimeOnboard({ ...data, pn }));
      }
    });

    return () => {
      socket.off("received_onboard");
    };
  }, [activePlatform, dispatch, onboardings, addToast, auth]);

  //received updated task
  useEffect(() => {
    socket.on("received_updated_task", (data) => {
      const { branchId } = activePlatform;
      if (data?.branchId?._id === branchId) {
        dispatch(UpdateRealtimeTask(data));
      }
    });

    return () => {
      socket.off("received_updated_task");
    };
  }, [activePlatform, dispatch, addToast]);

  // received_updated_deal_menus
  useEffect(() => {
    socket.on("received_updated_deal_menus", (data) => {
      const { branchId } = activePlatform;
      if (data?.branchId === branchId) {
        IDB_BROWSE().then((datas) => {
          var pn = 0;
          if (datas.length > 0) {
            datas.sort((a, b) => new Date(a.createdAt) - new Date(b.createdAt));
            const index = datas.findIndex((item) => item._id === data._id);
            if (index > -1) {
              pn = index + 1;
            }
          }
          dispatch(UpdateRealtimeOnboard({ ...data, pn }));
        });
      }
    });

    return () => {
      socket.off("received_updated_deal_menus");
    };
  }, [activePlatform, dispatch, addToast]);

  // received_updated_onboarding
  useEffect(() => {
    socket.on("received_updated_onboarding", (data) => {
      const { branchId } = activePlatform;
      if (data?.branchId === branchId) {
        dispatch(UpdateRealtimeOnboard(data));
      }
    });

    return () => {
      socket.off("received_updated_onboarding");
    };
  }, [activePlatform, dispatch, addToast]);

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
