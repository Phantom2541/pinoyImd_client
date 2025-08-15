import { getAge } from "../../../../services/utilities";

const Header = ({ task }) => {
  const { patient = {} } = task;
  const { fullName = {} } = patient;
  const { fname, lname, mname } = fullName;
  const patientName = `${lname?.toUpperCase()}, ${fname?.toUpperCase()} ${
    mname ? `y ${mname?.toUpperCase()}` : ""
  }`;

  const formattedDate = (_dob) => {
    const dob = new Date(_dob);
    return dob.toLocaleDateString("en-US", {
      year: "numeric",
      month: "2-digit",
      day: "2-digit",
    });
  };
  return (
    <div>
      <div className="mt-3 d-flex align-items-center justify-content-between">
        <div>
          <h6 style={{ fontWeight: 400 }}>
            CCF No: <span style={{ marginLeft: "2.5rem" }}> 201904010013</span>
          </h6>
          <h6 style={{ fontWeight: 400 }} className="mt-n1">
            Name: <span style={{ marginLeft: "3.2rem" }}>{patientName}</span>
          </h6>
          <div
            className="d-flex align-items-center "
            style={{ marginTop: "-5px" }}
          >
            <h6 style={{ fontWeight: 400 }}>
              Birthdate:{" "}
              <span style={{ marginLeft: "1.8rem" }}>
                {formattedDate(patient.dob)}
              </span>
            </h6>
            <h6 style={{ fontWeight: 400 }} className="ml-5">
              Age:{" "}
              <span style={{ marginLeft: "0.5rem" }}>
                {getAge(patient.dob)}
              </span>
            </h6>
            <h6 style={{ fontWeight: 400 }} className="ml-5">
              Gender:{" "}
              <span style={{ marginLeft: "0.5rem" }}>
                {patient.isMale ? "M" : "F"}
              </span>
            </h6>
          </div>
        </div>
        <div>
          <h6 style={{ fontWeight: 400 }}>
            Transaction Date Time:
            <span style={{ marginLeft: "1.5rem" }}>
              4/13/2022 <span className="ml-2">11:00:00AM</span>
            </span>
          </h6>
          <h6 style={{ fontWeight: 400 }} className="mt-n1">
            Report Date Time:
            <span style={{ marginLeft: "3.8rem" }}>
              5/20/2022 <span className="ml-2">3:00:00PM</span>
            </span>
          </h6>
        </div>
      </div>

      <div className="mt-2 ">
        <h6>
          <span style={{ fontWeight: 800 }}>Test Method</span>
          <span style={{ fontWeight: 400 }} className="ml-5">
            {task?.method?.toUpperCase()}
          </span>
        </h6>
      </div>
      <div className="mt-3 ml-2 d-flex align-items-center">
        <div style={{ width: "28rem" }}>
          <h6 style={{ fontWeight: 500 }}>Purpose</h6>
          <h6 style={{ fontWeight: 400, marginTop: "-5px" }}>
            {task?.purpose?.toUpperCase()}
          </h6>
        </div>
        <div>
          <h6 style={{ fontWeight: 500 }}>Requesting Parties</h6>
          <h6 style={{ fontWeight: 400, marginTop: "-5px" }}>
            {task?.company?.toUpperCase()}
          </h6>
        </div>
      </div>
    </div>
  );
};

export default Header;
