import { useEffect, useState } from "react";
import { useSelector, useDispatch } from "react-redux";
import { MDBView } from "mdbreact";
import Status from "./status.jsx";
import {
  BROWSE,
  RESET,
  SetFILTERED,
  SetCOLLECTIONS,
  SetACTIVE_STATUS,
} from "../../../../../../services/redux/slices/commerce/pos/services/taskGenerator.js";
import Search from "../../../../../../components/searchables/search.jsx";
import { IDB_BROWSE } from "../../../../../../services/indexDB/commerce/pos/services/onboardings.js";
import { fetchTracker } from "../../../../../../services/utilities/index.js";

export default function Header() {
  const { token, activePlatform, auth } = useSelector(({ auth }) => auth),
    { collections } = useSelector(({ taskGenerator }) => taskGenerator),
    [status, setStatus] = useState("All"),
    dispatch = useDispatch();

  useEffect(() => {
    if (token && activePlatform?.branchId && auth._id) {
      IDB_BROWSE().then((onboardings) => {
        if (fetchTracker.hasLoaded("onboardings")) {
          dispatch(
            SetCOLLECTIONS({
              onboardings,
              department: activePlatform?.department,
            })
          );
        } else {
          let date;
          if (onboardings?.length > 0) {
            date = fetchTracker.get.formattedDate(
              fetchTracker.get.lastFetchCreatedAt(onboardings),
              true
            );
          } else {
            date = fetchTracker.get.formattedDate();
          }
          dispatch(
            BROWSE({
              key: {
                branchId: activePlatform?.branchId,
                createdAt: date,
                department: activePlatform?.department,
                timezone: fetchTracker.get.timeZone(),
              },
              token,
            })
          );
        }
      });
    }

    return () => {
      dispatch(RESET());
    };
  }, [token, dispatch, activePlatform, auth]);

  return (
    <MDBView
      cascade
      className="gradient-card-header custom-header blue-gradient narrower py-2 mx-4 mb-3 d-flex justify-content-between align-items-center"
    >
      <div className="d-flex justify-items-center" style={{ width: "20rem" }}>
        <span className="white-text mx-3 text-nowrap mt-0">
          {collections.length}-Onboarded
        </span>
      </div>

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
