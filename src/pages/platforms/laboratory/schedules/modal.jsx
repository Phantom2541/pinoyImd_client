import { useDispatch, useSelector } from "react-redux";
import {
  MDBBtn,
  MDBIcon,
  MDBModal,
  MDBModalBody,
  MDBModalHeader,
  MDBTable,
  MDBTypography,
} from "mdbreact";
import { TOGGLE } from "../../../../services/redux/slices/finance/bookkeeping/duties";
import { fullName } from "../../../../services/utilities";
export default function Modal() {
  const { showModal } = useSelector(({ duties }) => duties),
    { collections = [] } = useSelector(({ personnels }) => personnels),
    dispatch = useDispatch();

  return (
    <MDBModal
      size="lg"
      isOpen={showModal}
      toggle={() => dispatch(TOGGLE())}
      backdrop
    >
      <MDBModalHeader
        toggle={() => dispatch(TOGGLE())}
        className="light-blue darken-3 white-text"
      >
        <MDBIcon icon="clock" className="mr-2" /> Schedule
      </MDBModalHeader>
      <MDBModalBody className="mb-0 ">
        <MDBTypography
          note
          noteColor="warning"
          bqColor="primary"
          noteTitle="Description: "
        >
          No schedule has been assigned yet. Please set or assign a schedule for
          the employees.
        </MDBTypography>
        <span className="template-schedule-legend-title">Legend:</span>
        <div className="template-schedule-legend d-flex flex-wrap justify-content-center mt-n1">
          <span style={{ margin: "0 15px", textAlign: "center" }}>
            <strong>7</strong> = 7am - 5pm
            <br />
            (Opening)
          </span>
          <span style={{ margin: "0 15px", textAlign: "center" }}>
            <strong>CM</strong> = 8am - 3pm
            <br />
            Clinical Microscopy
          </span>
          <span style={{ margin: "0 15px", textAlign: "center" }}>
            <strong>HM</strong> = 8am - 3pm
            <br />
            Hematology
          </span>
          <span style={{ margin: "0 15px", textAlign: "center" }}>
            <strong>SR</strong> = 8am - 3pm
            <br />
            Serology
          </span>
          <span style={{ margin: "0 15px", textAlign: "center" }}>
            <strong>CC</strong> = 8am - 3pm
            <br />
            Clinical Chemistry
          </span>
        </div>

        <MDBTable small>
          <thead>
            <tr>
              <th>Employee</th>
              <th>Duty Code</th>
            </tr>
          </thead>
          <tbody>
            {collections.map((item, index) => (
              <tr key={index}>
                <td>{fullName(item.user.fullName)}</td>
                <td>
                  <select className="form-control form-control-sm">
                    <option value="1">1</option>
                    <option value="2">2</option>
                    <option value="3">3</option>
                  </select>
                </td>
              </tr>
            ))}
          </tbody>
        </MDBTable>
        <div className="text-center">
          <MDBBtn rounded color="info">
            Save
          </MDBBtn>
        </div>
      </MDBModalBody>
    </MDBModal>
  );
}
