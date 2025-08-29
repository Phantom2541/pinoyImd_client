import { useEffect, useState } from "react";
import { useSelector, useDispatch } from "react-redux";
import { MDBView } from "mdbreact";
import Status from "./status.jsx";
import {
  BROWSE,
  RESET,
  SetFILTERED,
  SetACTIVE_STATUS,
  InsertRealtimeOnboard,
} from "../../../../../../services/redux/slices/commerce/pos/services/taskGenerator.js";
import Search from "../../../../../../components/searchables/search.jsx";
import { socket } from "../../../../../../services/utilities/index.js";
import { useToasts } from "react-toast-notifications";

export default function Header() {
  const { token, activePlatform, auth } = useSelector(({ auth }) => auth),
    { collections } = useSelector(({ taskGenerator }) => taskGenerator),
    [status, setStatus] = useState("All"),
    { addToast } = useToasts(),
    dispatch = useDispatch();

  //Initial Browse and Fetch Data
  useEffect(() => {
    if (token && activePlatform?.branchId && auth._id) {
      const timezone = Intl.DateTimeFormat().resolvedOptions()?.timeZone;
      const now = new Date();
      const createdAt = `${(now.getMonth() + 1)
        .toString()
        .padStart(2, "0")}/${now
        .getDate()
        .toString()
        .padStart(2, "0")}/${now.getFullYear()}`;
      dispatch(
        BROWSE({
          key: {
            branchId: activePlatform?.branchId,
            createdAt,
            department: "RAD",
            timezone,
          },
          token,
        })
      );
    }

    return () => {
      dispatch(RESET());
    };
  }, [token, dispatch, activePlatform, auth]);

  useEffect(() => {
    socket.on("received_onboard", (data) => {
      const { branchId, department } = activePlatform;
      if (data?.branchId === branchId && data?.department === department) {
        const pn = collections.length + 1;
        dispatch(InsertRealtimeOnboard({ ...data, pn }));
        addToast(`New patient onboarded. No. ${pn}`, {
          appearance: "success",
        });
      }
    });

    return () => {
      socket.off("received_onboard");
    };
  }, [activePlatform, dispatch, collections, addToast]);

  return (
    <MDBView
      cascade
      className="gradient-card-header custom-header blue-gradient narrower py-2 mx-4 d-flex justify-content-between align-items-center"
    >
      <div className="d-flex justify-items-center" style={{ width: "20rem" }}>
        <span className="white-text mx-3 text-nowrap mt-0">
          {collections.length}-Onboarded
        </span>
      </div>
      <div>RADIOLOGY DEPARTMENT</div>
      <div className="d-flex align-items-center">
        <div className=" d-flex align-items-center mr-4">
          <span className="mr-1 ">Status:</span>
          <Status setStatus={setStatus} status={status} />
        </div>
        <Search
          collections={collections}
          haveAction={false}
          setFiltered={(results) => dispatch(SetFILTERED(results))}
          reset={() => {
            dispatch(SetFILTERED(collections));
            dispatch(SetACTIVE_STATUS("All"));
          }}
        />
      </div>
    </MDBView>
  );
}
