import { useEffect } from "react";
import { useDispatch, useSelector } from "react-redux";
import {
  MDBAnimation,
  MDBBadge,
  MDBCard,
  MDBCardBody,
  MDBCardHeader,
  MDBTable,
  MDBTableBody,
  MDBTableHead,
} from "mdbreact";
import TableLoading from "../../../../components/tableLoading";
import {
  BROWSE,
  SetDayFilter,
  SetPhysicianFilter,
} from "../../../../services/redux/slices/diagnostics/clinic/clinicalSchedules";

const dayOptions = ["Sun", "M", "T", "W", "TH", "F", "Sat"];

const Schedules = () => {
  const dispatch = useDispatch();
  const { token, activePlatform, auth } = useSelector(({ auth }) => auth);
  const { filtered, physicianOptions, physicianFilter, dayFilter, isLoading } =
    useSelector(({ clinicalSchedules }) => clinicalSchedules);

  useEffect(() => {
    if (!token || !activePlatform?.branch) return;

    const physicianIds =
      activePlatform.branch.physicians?.map(({ _id }) => _id).filter(Boolean) ||
      [];
    const secretaryId = auth?._id || "";
    const branchId =
      activePlatform?.branchId || activePlatform?.branch?._id || "";

    if (!secretaryId && !physicianIds.length) return;

    dispatch(
      BROWSE({
        token,
        data: {
          ...(secretaryId ? { secretaryId } : {}),
          ...(branchId ? { branchId } : {}),
          ...(physicianIds.length ? { physicianIds } : {}),
        },
      }),
    );
  }, [dispatch, token, activePlatform, auth]);

  return (
    <MDBAnimation type="fadeIn">
      <MDBCard narrow className="pb-3">
        <MDBCardHeader className="d-flex flex-wrap align-items-center justify-content-between">
          <div>
            <strong>Physicians Schedule</strong>
          </div>
          <div
            className="d-flex flex-wrap align-items-center"
            style={{ gap: "0.75rem" }}
          >
            <select
              className="form-control"
              style={{ minWidth: "16rem" }}
              value={physicianFilter}
              onChange={({ target }) =>
                dispatch(SetPhysicianFilter(target.value))
              }
            >
              <option value="">All Physicians</option>
              {physicianOptions.map((physician) => (
                <option key={physician._id} value={physician._id}>
                  Dr. {physician.name}
                </option>
              ))}
            </select>
          </div>
        </MDBCardHeader>
        <MDBCardBody>
          {isLoading ? (
            <TableLoading />
          ) : (
            <MDBTable bordered small responsive>
              <MDBTableHead>
                <tr>
                  <th>Doctor</th>
                  <th>Clinic</th>
                  <th>Day</th>
                  <th>Time</th>
                  <th>Type</th>
                  <th>Location</th>
                  <th>Slots</th>
                  <th>Duration</th>
                  <th>Status</th>
                </tr>
              </MDBTableHead>
              <MDBTableBody>
                {filtered.length ? (
                  filtered.map((item) => (
                    <tr key={item._id}>
                      <td>
                        {item.physicianName
                          ? `Dr. ${item.physicianName}`
                          : "--"}
                      </td>
                      <td>{item.clinicTitle || "--"}</td>
                      <td>{item.day || "--"}</td>
                      <td>{item.timeLabel}</td>
                      <td className="text-capitalize">{item.type || "--"}</td>
                      <td>{item.location || "--"}</td>
                      <td>
                        {item.slot || item.capacity
                          ? `${item.slot || 0} / ${item.capacity || 0}`
                          : "--"}
                      </td>
                      <td>{item.duration ? `${item.duration} mins` : "--"}</td>
                      <td>
                        <MDBBadge
                          color={
                            item.clinicStatus === "posted" ? "success" : "info"
                          }
                        >
                          {item.clinicStatus || "draft"}
                        </MDBBadge>
                      </td>
                    </tr>
                  ))
                ) : (
                  <tr>
                    <td colSpan="9" className="text-center text-muted">
                      No schedules found.
                    </td>
                  </tr>
                )}
              </MDBTableBody>
            </MDBTable>
          )}
        </MDBCardBody>
      </MDBCard>
    </MDBAnimation>
  );
};

export default Schedules;
