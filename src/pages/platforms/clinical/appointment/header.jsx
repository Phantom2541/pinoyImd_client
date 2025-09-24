import { useDispatch, useSelector } from "react-redux";
import { MDBView } from "mdbreact";
import {
  SetPHYSICIAN,
  SetSCHED,
  TOGGLE_PATIENT_MODAL,
  SetFILTERED,
} from "../../../../services/redux/slices/diagnostics/clinic/appointments";
import { properFullname } from "../../../../services/utilities";
import { Search } from "../../../../components/searchables";
import { useState } from "react";

const Header = () => {
  const { activePlatform } = useSelector(({ auth }) => auth);
  const { collections, physicians, scheds, activeSched, activePhysician } =
      useSelector(({ appointments }) => appointments),
    [lastSched, setLastSched] = useState(""),
    dispatch = useDispatch();

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
            <option value="">All</option>
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
      {activePhysician?._id && (
        <div className="white-text mx-3 text-nowrap mt-0 d-flex align-items-center ml-n5">
          <span className="mr-2">Schedule:</span>
          <select
            className="form-control bg-light"
            value={activeSched}
            onChange={({ target }) => {
              dispatch(SetSCHED({ sched: target.value }));
            }}
          >
            <option value="">All</option>
            {scheds.map((sched) => (
              <option key={sched} value={sched}>
                {sched}
              </option>
            ))}
          </select>
        </div>
      )}
      <Search
        setFiltered={(items) => {
          dispatch(SetFILTERED(items));
          dispatch(SetSCHED({ sched: "", isSearch: true }));
          setLastSched(activeSched);
        }}
        reset={() => {
          dispatch(SetSCHED({ sched: lastSched }));
        }}
        collections={collections}
        handleAdd={(searchValue) => dispatch(TOGGLE_PATIENT_MODAL(searchValue))}
        hideButton
      />
    </MDBView>
  );
};

export default Header;
