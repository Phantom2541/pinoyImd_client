import { useEffect } from "react";
import { useDispatch, useSelector } from "react-redux";
import { MDBView } from "mdbreact";
import {
  TASKS,
  RESET,
  SetByGroup,
  SetByStatus,
} from "../../../../../../../../services/redux/slices/diagnostics/laboratory/validator";
import { BROWSE } from "../../../../../../../../services/redux/slices/market/machines";
import SEARCH from "./search";
import {
  capitalize,
  fetchTracker,
} from "../../../../../../../../services/utilities";

const Headers = ({ searchKey }) => {
  const dispatch = useDispatch();
  const { token, activePlatform } = useSelector(({ auth }) => auth);
  const { filtered, byStatus, sections } = useSelector(
    ({ validator }) => validator
  );

  useEffect(() => {
    if (token && activePlatform?.branchId) {
      dispatch(
        TASKS({
          token,
          key: {
            department: "LAB",
            branchId: "637097f0535529a3a57e933e",
            createdAt: fetchTracker.get.formattedDate(),
          },
        })
      );
    }
    return () => dispatch(RESET());
  }, [token, dispatch, activePlatform]);

  useEffect(() => {
    if (token) {
      dispatch(
        BROWSE({
          token,
          params: { branchId: activePlatform?.branchId, lisCapable: true },
        })
      );
    }
  }, [dispatch, token, activePlatform]);

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
            <SEARCH />
          </div>
        </div>
      </div>
    </MDBView>
  );
};

export default Headers;
