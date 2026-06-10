import { useEffect, useMemo, useState } from "react";
import { MDBCard, MDBCardBody, MDBIcon, MDBView } from "mdbreact";
import { useDispatch, useSelector } from "react-redux";
import CalendarPicker from "../../../../components/header/calendars";
import TableLoading from "../../../../components/tableLoading";
import { Policy } from "../../../../services/fakeDb";
import {
  BROWSE as BROWSE_DUTIES,
  RESET as RESET_DUTIES,
  SetMONTH,
  ResetDATE,
} from "../../../../services/redux/slices/finance/bookkeeping/duties";
import {
  BROWSE as BROWSE_PERSONNELS,
  RESET as RESET_PERSONNELS,
} from "../../../../services/redux/slices/assets/persons/personnels";
import { fullName } from "../../../../services/utilities";
import "../../hr/dtr/schedule/style.css";
import "./style.css";

const getDominantDepartment = (breakdown = [], personnelsByUserId = {}) => {
  const counts = breakdown.reduce((acc, { eid }) => {
    const personnel = personnelsByUserId[eid?._id];
    const department =
      Policy.getDepartment(Number(personnel?.contract?.designation)) ||
      "Unassigned";

    acc[department] = (acc[department] || 0) + 1;
    return acc;
  }, {});

  const [department = "Unassigned"] =
    Object.entries(counts).sort((a, b) => b[1] - a[1])[0] || [];

  return department;
};

const buildWeekHeaders = (year, month, isFirstSched) => {
  const lastDayOfMonth = new Date(year, month, 0).getDate();
  const startDay = isFirstSched ? 1 : 16;
  const daysInSchedule = isFirstSched ? 15 : lastDayOfMonth - 15;

  return {
    dayHeaders: Array.from({ length: daysInSchedule }, (_, i) => startDay + i),
    weekHeaders: Array.from({ length: daysInSchedule }, (_, i) => {
      const date = new Date(year, month - 1, startDay + i);
      return date.toLocaleDateString("en-US", { weekday: "short" });
    }),
  };
};

export default function ScheduleManager() {
  const dispatch = useDispatch();
  const { token, activePlatform } = useSelector(({ auth }) => auth);
  const {
    collections: dutyCollections,
    isLoading: isLoadingDuties,
    month,
    year,
  } = useSelector(({ duties }) => duties);
  const {
    collections: personnelCollections,
    isLoading: isLoadingPersonnels,
  } = useSelector(({ personnels }) => personnels);
  const [isFirstSched, setIsFirstSched] = useState(true);
  const [selectedDepartment, setSelectedDepartment] = useState("all");

  useEffect(() => {
    if (!token || !activePlatform?.branchId) return;

    dispatch(
      BROWSE_DUTIES({
        token,
        params: { branchId: activePlatform.branchId, month, year },
      })
    );
    dispatch(
      BROWSE_PERSONNELS({
        token,
        branchId: activePlatform.branchId,
      })
    );

    return () => {
      dispatch(RESET_DUTIES());
      dispatch(RESET_PERSONNELS());
    };
  }, [dispatch, token, activePlatform, month, year]);

  const personnelsByUserId = useMemo(
    () =>
      personnelCollections.reduce((acc, personnel) => {
        const userId = personnel?.user?._id;
        if (userId) acc[userId] = personnel;
        return acc;
      }, {}),
    [personnelCollections]
  );

  const periodSchedules = useMemo(() => {
    return dutyCollections
      .filter((item) => item?.isFirstSched === isFirstSched)
      .map((item) => ({
        ...item,
        department: getDominantDepartment(item?.breakdown, personnelsByUserId),
      }))
      .sort((a, b) => a.department.localeCompare(b.department));
  }, [dutyCollections, isFirstSched, personnelsByUserId]);

  const departmentOptions = useMemo(
    () => [...new Set(periodSchedules.map((item) => item.department))],
    [periodSchedules]
  );

  useEffect(() => {
    if (
      selectedDepartment !== "all" &&
      !departmentOptions.includes(selectedDepartment)
    ) {
      setSelectedDepartment("all");
    }
  }, [departmentOptions, selectedDepartment]);

  const visibleSchedules = useMemo(() => {
    if (selectedDepartment === "all") return periodSchedules;

    return periodSchedules.filter(
      ({ department }) => department === selectedDepartment
    );
  }, [periodSchedules, selectedDepartment]);

  const { dayHeaders, weekHeaders } = useMemo(
    () => buildWeekHeaders(year, month, isFirstSched),
    [year, month, isFirstSched]
  );

  const isLoading = isLoadingDuties || isLoadingPersonnels;
  const lastDay = new Date(year, month, 0).getDate();

  return (
    <MDBCard narrow>
      <MDBView
        cascade
        className="gradient-card-header custom-header blue-gradient narrower py-2 mx-4 d-flex justify-content-between align-items-center"
      >
        <div>
          <strong>Department Schedules</strong>
          <div className="small white-text">
            Manager view for all department duty schedules
          </div>
        </div>

        <div className="d-flex align-items-center flex-wrap manager-schedule-toolbar">
          <CalendarPicker
            moved={(next) => dispatch(SetMONTH(next))}
            reset={() => dispatch(ResetDATE())}
            month={month}
            year={year}
            isLoading={isLoading}
          />
          <select
            className="form-control form-control-sm ml-2"
            disabled={isLoading}
            value={String(isFirstSched)}
            onChange={({ target }) => setIsFirstSched(target.value === "true")}
          >
            <option value="true">1 - 15</option>
            <option value="false">16 - {lastDay}</option>
          </select>
          <select
            className="form-control form-control-sm ml-2"
            disabled={isLoading || !departmentOptions.length}
            value={selectedDepartment}
            onChange={({ target }) => setSelectedDepartment(target.value)}
          >
            <option value="all">All Departments</option>
            {departmentOptions.map((department) => (
              <option key={department} value={department}>
                {department}
              </option>
            ))}
          </select>
        </div>
      </MDBView>

      <MDBCardBody>
        {isLoading ? (
          <TableLoading />
        ) : visibleSchedules.length ? (
          <div className="manager-schedule-list">
            {visibleSchedules.map((schedule) => (
              <section
                key={schedule._id}
                className="manager-schedule-department-card"
              >
                <div className="manager-schedule-department-header">
                  <div>
                    <h5 className="mb-1">{schedule.department}</h5>
                    <small className="text-muted">
                      {schedule.breakdown?.length || 0} staff
                    </small>
                  </div>
                  <div className="text-right">
                    <span className="badge badge-info text-uppercase">
                      {schedule.status || "draft"}
                    </span>
                  </div>
                </div>

                <div className="table-responsive">
                  <table className="template-schedule-table mb-0">
                    <thead>
                      <tr>
                        <th rowSpan="2">EMPLOYEE</th>
                        {dayHeaders.map((day) => (
                          <th key={`${schedule._id}-day-${day}`}>{day}</th>
                        ))}
                      </tr>
                      <tr>
                        {weekHeaders.map((day, index) => (
                          <th
                            key={`${schedule._id}-week-${index}`}
                            style={{ color: day === "Sun" ? "red" : "" }}
                          >
                            {day}
                          </th>
                        ))}
                      </tr>
                    </thead>
                    <tbody>
                      {schedule.breakdown?.map(({ eid, sched = [] }, rowIdx) => {
                        const personnel = personnelsByUserId[eid?._id];
                        const designation = Policy.getPositions(
                          Number(personnel?.contract?.designation)
                        );

                        return (
                          <tr key={`${schedule._id}-${eid?._id || rowIdx}`}>
                            <td>
                              <div className="font-weight-bold">
                                {fullName(eid?.fullName)}
                              </div>
                              {designation && (
                                <small className="text-muted d-block">
                                  {designation}
                                </small>
                              )}
                            </td>
                            {sched.map((value, colIdx) => {
                              const displayValue = value || "RO";

                              return (
                                <td
                                  key={`${schedule._id}-${rowIdx}-${colIdx}`}
                                  className={
                                    displayValue === "O" || displayValue === "RO"
                                      ? "template-schedule-red"
                                      : ""
                                  }
                                >
                                  {displayValue}
                                </td>
                              );
                            })}
                          </tr>
                        );
                      })}
                    </tbody>
                  </table>
                </div>
              </section>
            ))}
          </div>
        ) : (
          <div className="manager-schedule-empty text-center text-muted py-5">
            <MDBIcon icon="calendar-alt" size="2x" className="mb-3" />
            <div>No saved schedules found for this period.</div>
          </div>
        )}
      </MDBCardBody>
    </MDBCard>
  );
}
