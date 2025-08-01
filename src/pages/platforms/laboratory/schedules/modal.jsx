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
import { DutyCodes, Policy } from "../../../../services/fakeDb";
import { useEffect, useState } from "react";
export default function Modal() {
  const { showModal } = useSelector(({ duties }) => duties),
    { collections = [] } = useSelector(({ personnels }) => personnels),
    [personnels, setPersonnels] = useState([]),
    [codes, setCodes] = useState([]),
    dispatch = useDispatch();

  useEffect(() => {
    setCodes([]);
    if (showModal) {
      setPersonnels(collections);
    }
  }, [showModal, collections]);

  const handleChange = (personnelID, code) => {
    const _personnels = [...personnels];
    const pIndex = _personnels.findIndex((p) => p._id === personnelID);
    _personnels[pIndex] = { ..._personnels[pIndex], code };

    setPersonnels(_personnels);
    setCodes(_personnels.map((p) => p.code).filter(Boolean));
  };
  console.log("codes", codes);
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
          {DutyCodes.collections.map((collec) => (
            <span
              key={collec.code}
              style={{ margin: "0 15px", textAlign: "center" }}
            >
              <strong>{collec.code}</strong> = {collec.time}
              <br />
              {collec.label}
            </span>
          ))}
        </div>

        <MDBTable small>
          <thead>
            <tr>
              <th>Employee</th>
              <th>Designation</th>
              <th>Duty Code</th>
            </tr>
          </thead>
          <tbody>
            {collections.map((item, index) => (
              <tr key={index}>
                <td>{fullName(item.user.fullName)}</td>
                <td>{Policy.getPositions(item?.contract?.designation)}</td>
                <td>
                  <select
                    className="form-control form-control-sm"
                    value={item?.code}
                    onChange={({ target }) =>
                      handleChange(item._id, target.value)
                    }
                  >
                    <option value="">Choose a duty code</option>
                    {DutyCodes.collections.map(
                      ({ code, label, time }, index) => (
                        <option
                          value={code}
                          style={{
                            display: codes.includes(code) ? "none" : "block",
                          }}
                          title={`${code} = ${time} ${label}`}
                          key={index}
                        >
                          {code}
                        </option>
                      )
                    )}
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
