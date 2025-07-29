import React, { useEffect } from "react";
import { useDispatch, useSelector } from "react-redux";
import { MDBView } from "mdbreact";
import {
  TASKS,
  RESET,
  SetByGroup,
  SetByStatus,
  SetFILTERED_STATUS,
} from "../../../../../services/redux/slices/diagnostics/laboratory/validator";
import { Search as SEARCH } from "../../../../../components/searchables";
import { capitalize } from "../../../../../services/utilities";
const departmentMap = {
  laboratory: "LAB",
  radiology: "RAD",
};

const Headers = () => {
  const dispatch = useDispatch();
  const { token, activePlatform, auth } = useSelector(({ auth }) => auth),
    { department } = activePlatform;
  const { byStatus, sections, filteredStatus, byGroup } = useSelector(
    ({ validator }) => validator
  );

  useEffect(() => {
    if (token && activePlatform?.branchId) {
      dispatch(
        TASKS({
          token,
          key: {
            physicianId: "68009d80a3dfd9b8666da01a",
            isDaily: true,
            department: [departmentMap[department.toLowerCase()]],
            branchId: activePlatform?.branchId,
            createdAt: new Date().setHours(0, 0, 0, 0),
          },
        })
      );
    }
    return () => dispatch(RESET());
  }, [token, dispatch, activePlatform, auth]);

  return (
    <MDBView
      cascade
      className="gradient-card-header blue-gradient narrower py-2 mx-4 mb-3 d-flex flex-column"
    >
      <div className="d-flex justify-content-between align-items-center w-100">
        <span className="white-text mx-3">Daily Tasks</span>

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
                  SetByStatus({
                    status: e.target.value,
                    statusKey: "hasRead",
                  })
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
                  SetByStatus({ status: byStatus, statusKey: "hasRead" })
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
