import { useEffect } from "react";
import { useDispatch, useSelector } from "react-redux";
import { MDBView } from "mdbreact";
import {
  TASKS,
  RESET,
  SetByGroup,
  SetByStatus,
  SetFILTERED_STATUS,
  SetCOLLECTIONS,
} from "../../../../../services/redux/slices/diagnostics/laboratory/validator";
import { Search as SEARCH } from "../../../../../components/searchables";
import { capitalize, fetchTracker } from "../../../../../services/utilities";
import { IDB_BROWSE } from "../../../../../services/indexDB/commerce/pos/services/tasks";

const departmentMapping = {
  laboratory: "LAB",
  radiology: "RAD",
};

const Headers = ({ searchKey }) => {
  const dispatch = useDispatch();
  const { token, activePlatform } = useSelector(({ auth }) => auth);
  const { filtered, byStatus, sections, filteredStatus, byGroup } = useSelector(
    ({ validator }) => validator
  );

  const departmentCode =
    departmentMapping[activePlatform?.department?.toLowerCase()] || "";

  useEffect(() => {
    if (token && activePlatform?.branchId) {
      IDB_BROWSE().then((_tasks) => {
        if (fetchTracker.hasLoaded("tasks")) {
          dispatch(SetCOLLECTIONS(_tasks));
        } else {
          let date;
          if (_tasks?.length > 0) {
            date = fetchTracker.get.formattedDate(
              fetchTracker.get.lastFetchCreatedAt(_tasks),
              true
            );
          } else {
            date = fetchTracker.get.formattedDate();
          }

          dispatch(
            TASKS({
              token,
              key: {
                department: [departmentCode],
                branchId: activePlatform?.branchId,
                createdAt: date,
                timezone: fetchTracker.get.timeZone(),
              },
            })
          );
        }
      });
    }
    return () => dispatch(RESET());
  }, [token, dispatch, activePlatform, departmentCode]);

  return (
    <MDBView
      cascade
      className="gradient-card-header blue-gradient narrower py-2 mx-4 mb-3 d-flex flex-column"
    >
      <div className="d-flex justify-content-between align-items-center w-100">
        <span className="white-text mx-3">
          {filtered.length}&nbsp;
          {searchKey ? `Matches with ${searchKey}` : "Onboarding Tasks"}
        </span>

        <div className="d-flex align-items-center" style={{ gap: 10 }}>
          <div>
            <select
              className="form-control"
              style={{ width: 180 }}
              onChange={(e) => dispatch(SetByGroup(e.target.value))}
            >
              <option value="" disabled style={{ fontWeight: "bold" }}>
                Group by ...
              </option>
              <option value="all">Patient</option>
              {sections.map((component) => (
                <option key={component} value={component}>
                  {capitalize(component)}
                </option>
              ))}
            </select>
          </div>
          <div>
            <select
              className="form-control"
              style={{ width: 150 }}
              value={byStatus}
              onChange={(e) => {
                dispatch(
                  SetByStatus({ status: e.target.value, statusKey: "hasDone" })
                );
              }}
            >
              <option value="" disabled style={{ fontWeight: "bold" }}>
                Status ...
              </option>
              <option value="all">All</option>
              <option value={"false"}>Pending</option>
              <option value={"true"}>Done</option>
            </select>
          </div>
          <div>
            <SEARCH
              collections={filteredStatus}
              setFiltered={(items) => dispatch(SetFILTERED_STATUS(items))}
              reset={() => {
                dispatch(SetByGroup(byGroup));
                dispatch(
                  SetByStatus({ status: byStatus, statusKey: "hasDone" })
                );
              }}
              haveAction={false}
            />
          </div>
        </div>
      </div>
    </MDBView>
  );
};

export default Headers;
