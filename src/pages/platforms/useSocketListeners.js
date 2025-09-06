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

  const useSocket = (event, handler, deps = []) => {
    useEffect(() => {
      socket.on(event, handler);
      return () => socket.off(event, handler);
      // eslint-disable-next-line react-hooks/exhaustive-deps
    }, deps);
  };

  // socket connected
  useSocket(
    "me",
    (id) => {
      console.log(`[Socket] ${id} Connected.`);
    },
    []
  );

  // join_room
  useEffect(() => {
    if (activePlatform?.branchId) {
      socket.emit("join_room", activePlatform.branchId);
    }
  }, [activePlatform]);

  // received_tasks
  useSocket(
    "received_tasks",
    (data) => {
      if (data?.department === departmentCode) {
        dispatch(InsertRealtimeTask(data));
        addToast("New patient task has been received", {
          appearance: "success",
        });
      }
    },
    [departmentCode, dispatch, addToast]
  );

  // received_onboard
  useSocket(
    "received_onboard",
    (data) => {
      const pn = onboardings.length + 1;
      dispatch(
        InsertRealtimeOnboard({ ...data, pn, department: departmentCode })
      );

      addToast(`New onboarding received for patient #${pn}`, {
        appearance: "success",
      });
    },
    [onboardings, departmentCode, dispatch]
  );

  // received_updated_task
  useSocket(
    "received_updated_task",
    (data) => dispatch(UpdateRealtimeTask(data)),
    [dispatch]
  );

  // received_updated_deal_menus
  useSocket(
    "received_updated_deal_menus",
    (data) => {
      IDB_BROWSE().then((datas) => {
        let pn = 0;
        if (datas.length > 0) {
          datas.sort((a, b) => new Date(a.createdAt) - new Date(b.createdAt));
          const index = datas.findIndex((item) => item._id === data._id);
          if (index > -1) pn = index + 1;
        }
        dispatch(
          UpdateRealtimeOnboard({ ...data, pn, department: departmentCode })
        );
      });
    },
    [dispatch, departmentCode]
  );

  // received_updated_onboarding
  useSocket(
    "received_updated_onboarding",
    (data) =>
      dispatch(UpdateRealtimeOnboard({ ...data, department: departmentCode })),
    [dispatch, departmentCode]
  );

  // tracker
  useSocket("tracker", (data) => Tracker.set(data), []);
}
