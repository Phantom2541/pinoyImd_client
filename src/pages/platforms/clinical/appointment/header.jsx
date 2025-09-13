import { useEffect, useState } from "react";
import { useDispatch, useSelector } from "react-redux";
import { MDBView } from "mdbreact";
import {
  SetPHYSICIAN,
  SetSCHED,
} from "../../../../services/redux/slices/diagnostics/clinic/appointments";
import { properFullname } from "../../../../services/utilities";
const Header = () => {
  const { activePlatform } = useSelector(({ auth }) => auth);
  const { filtered, physicians, scheds, activeSched, activePhysician } =
    useSelector(({ appointments }) => appointments);
  const [appointments, setAppointments] = useState([]),
    dispatch = useDispatch();

  console.log("activePlatform", activePlatform.branch.physicians);

  useEffect(() => {
    if (filtered) setAppointments(filtered);
  }, [filtered]);

  return (
    <MDBView
      cascade
      className="gradient-card-header custom-header blue-gradient narrower py-2 mx-4 mb-3 d-flex justify-content-between align-items-center"
    >
      <div className="d-flex justify-items-center" style={{ width: "20rem" }}>
        <div className="white-text mx-3 text-nowrap mt-0 d-flex align-items-center">
          <span className="mr-2">Physician:</span>
          <select
            className="form-control bg-light"
            style={{ padding: "0 5px", fontSize: ".8rem " }}
            value={activePhysician?._id}
            onChange={({ target }) => dispatch(SetPHYSICIAN(target.value))}
          >
            <option value="all">All</option>
            {activePlatform.branch.physicians.map((user) => {
              const isExisting = physicians.some(({ _id }) => _id === user._id);
              return (
                <option
                  key={user?._id}
                  value={user?._id}
                  disabled={!isExisting}
                  title={!isExisting && "No Clinic has been Register"}
                >
                  Dr. {properFullname(user?.fullName)}
                </option>
              );
            })}
          </select>
        </div>
      </div>
      <div className="d-flex justify-items-center" style={{ width: "20rem" }}>
        <div className="white-text mx-3 text-nowrap mt-0 d-flex align-items-center">
          <span className="mr-2">Sched:</span>
          <select
            className="form-control bg-light"
            value={activeSched}
            onChange={({ target }) => {
              dispatch(SetSCHED(target.value));
            }}
          >
            <option value="all">All</option>
            {scheds.map((sched) => (
              <option key={sched} value={sched}>
                {sched}
              </option>
            ))}
          </select>
        </div>
      </div>
      <div>
        <div className="text-right d-flex align-items-center">
          <select
            className="form-control bg-light"
            onChange={({ target }) => dispatch(SetPHYSICIAN(target.value))}
          >
            <option value="all">All</option>
            {appointments.map(({ patient }) => (
              <option key={patient?._id} value={patient?._id}>
                {properFullname(patient?.fullName)}
              </option>
            ))}
          </select>
        </div>
      </div>
    </MDBView>
  );
};

export default Header;
