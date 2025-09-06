import { useEffect } from "react";
import { useDispatch, useSelector } from "react-redux";
import { socket, Tracker } from "../../services/utilities";
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

export function useSocketListeners() {
  const dispatch = useDispatch();
  const { addToast } = useToasts();
  const { activePlatform } = useSelector(({ auth }) => auth);
  const { collections: onboardings } = useSelector(
    ({ taskGenerator }) => taskGenerator
  );

  const departmentCode =
    departmentMapping[activePlatform?.department?.toLowerCase()];

  // socket connected
  useEffect(() => {
    socket.on("me", (id) => {
      console.log(`[Socket] ${id} Connected.`);
    });

    return () => socket.off("me");
  }, []);

  // received_tasks
  useEffect(() => {
    socket.on("received_tasks", (data) => {
      const { branchId } = activePlatform;
      if (
        data?.branchId?._id === branchId &&
        data?.department === departmentCode
      ) {
        dispatch(InsertRealtimeTask(data));
        addToast("New patient task has been received", {
          appearance: "success",
        });
      }
    });

    return () => socket.off("received_tasks");
  }, [activePlatform, departmentCode, dispatch, addToast]);

  // received_onboard
  useEffect(() => {
    socket.on("received_onboard", (data) => {
      const { branchId } = activePlatform;
      if (data?.branchId === branchId && data?._id) {
        const pn = onboardings.length + 1;
        dispatch(
          InsertRealtimeOnboard({ ...data, pn, department: departmentCode })
        );
      }
    });

    return () => socket.off("received_onboard");
  }, [activePlatform, onboardings, departmentCode, dispatch]);

  // received_updated_task
  useEffect(() => {
    socket.on("received_updated_task", (data) => {
      const { branchId } = activePlatform;
      if (data?.branchId?._id === branchId) {
        dispatch(UpdateRealtimeTask(data));
      }
    });

    return () => socket.off("received_updated_task");
  }, [activePlatform, dispatch]);

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
          dispatch(
            UpdateRealtimeOnboard({ ...data, pn, department: departmentCode })
          );
        });
      }
    });

    return () => socket.off("received_updated_deal_menus");
  }, [activePlatform, dispatch, departmentCode]);

  // received_updated_onboarding
  useEffect(() => {
    socket.on("received_updated_onboarding", (data) => {
      const { branchId } = activePlatform;
      if (data?.branchId === branchId) {
        dispatch(
          UpdateRealtimeOnboard({ ...data, department: departmentCode })
        );
      }
    });

    return () => socket.off("received_updated_onboarding");
  }, [activePlatform, dispatch, departmentCode]);

  //this is for tracker
  useEffect(() => {
    if (!activePlatform?.branchId) return;
    socket.emit("join_room", activePlatform?.branchId);
    socket.on("tracker", (data) => {
      Tracker.set(data);
    });

    return () => {
      socket.off("tracker");
    };
  }, [activePlatform]);
}
