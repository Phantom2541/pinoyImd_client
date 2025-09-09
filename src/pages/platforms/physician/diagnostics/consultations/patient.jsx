import { useLocation, useHistory } from "react-router-dom";
import { useSelector } from "react-redux";
import { EditableUser } from "../../../../../components/customizable";
import PROFILE from "./../../../../../assets/male.jpg";

export default function Patient() {
  const { patient, isLoading, isSuccess } = useSelector(
    ({ consultations }) => consultations
  );
  const location = useLocation();
  const history = useHistory();

  const setPatientId = (newId) => {
    const newParams = new URLSearchParams(location.search);
    newParams.set("ehrId", newId); // add if missing, replace if exists
    history.replace(`${location.pathname}?${newParams.toString()}`);
  };
  return (
    <div className="checkup-data-patient">
      <div className="checkup-data-patient-info">
        <img
          src={PROFILE}
          alt="avatar"
          className="checkup-data-patient-profile"
          draggable={false}
        />
        <EditableUser
          emptyLabel="Click here to select a Patient"
          user={{ patient, _id: patient?._id }}
          onSave={({ patient }) => setPatientId(patient)}
          formSubmitted={isLoading}
          isSuccess={isSuccess}
        />
      </div>
    </div>
  );
}
