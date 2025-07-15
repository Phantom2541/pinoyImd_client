import React, { useEffect } from "react";
import { useDispatch, useSelector } from "react-redux";
import { MDBView } from "mdbreact";
import {
  TASKS,
  RESET,
  SetFILTERED,
  SetByGroup,
  SetByStatus,
} from "../../../../../services/redux/slices/diagnostics/laboratory/validator";
import { Search as SEARCH } from "../../../../../components/searchables";
import { Templates } from "../../../../../services/fakeDb";
import { capitalize } from "../../../../../services/utilities";

const Headers = ({ searchKey }) => {
  const dispatch = useDispatch();
  const { token, activePlatform } = useSelector(({ auth }) => auth);
  const { filtered } = useSelector(({ validator }) => validator);
  const departmentCode =
    activePlatform?.department?.toLowerCase() === "laboratory"
      ? "LAB"
      : activePlatform?.department?.toUpperCase();

  useEffect(() => {
    if (token && activePlatform?.branchId) {
      dispatch(
        TASKS({
          token,
          key: {
            department: [departmentCode],
            branchId: activePlatform?.branchId,
            createdAt: new Date().setHours(0, 0, 0, 0),
          },
        })
      );
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
              {[...Templates.getComponents(departmentCode)]
                .sort((a, b) => a.localeCompare(b))
                .map((component) => (
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
              onChange={(e) => {
                dispatch(SetByStatus(e.target.value));
              }}
            >
              <option value="" disabled style={{ fontWeight: "bold" }}>
                Status ...
              </option>
              <option value="all">All</option>
              <option value={false}>Pending</option>
              <option value={true}>Done</option>
            </select>
          </div>
          <div>
            <SEARCH
              collection={filtered}
              setFiltered={(items) => dispatch(SetFILTERED(items))}
              reset={() => dispatch(SetFILTERED(filtered))}
              haveAction={false}
            />
          </div>
        </div>
      </div>
    </MDBView>
  );
};

export default Headers;
