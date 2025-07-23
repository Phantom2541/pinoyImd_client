import { useDispatch, useSelector } from "react-redux";
import {
  MDBAlert,
  MDBModal,
  MDBModalBody,
  MDBModalHeader,
  MDBTable,
  MDBTableBody,
  MDBTableHead,
} from "mdbreact";
import { TOGGLE_WORK_AREA } from "../../../../../services/redux/slices/diagnostics/laboratory/validator.js";
import Patient from "./patient.jsx";
import { formColor } from "../../../../../services/utilities/index.js";
import { Services } from "../../../../../services/fakeDb/index.js";
export default function LIS_SENDER() {
  const { showWorkArea: show, work } = useSelector(
      ({ validator }) => validator
    ),
    dispatch = useDispatch();

  const { section, task = {} } = work || {};

  const toggle = () => dispatch(TOGGLE_WORK_AREA());

  return (
    <MDBModal size="lg" isOpen={show} toggle={toggle} backdrop>
      <MDBModalHeader
        toggle={toggle}
        className="light-blue darken-3 white-text"
      >
        <Patient />
      </MDBModalHeader>
      <MDBModalBody className="mb-0 text-center">
        <MDBAlert color={formColor(section)} className="text-uppercase fw-bold">
          <h5 style={{ letterSpacing: "30px" }} className="mb-0">
            {section}
          </h5>
        </MDBAlert>
        <MDBTable small>
          <MDBTableHead>
            <tr>
              <th>#</th>
              <th>Service</th>
            </tr>
          </MDBTableHead>
          <MDBTableBody>
            {task?.packages?.map((pkg, index) => {
              return (
                <tr>
                  <td>{index + 1}</td>
                  <td>{Services.find(pkg)?.name}</td>
                </tr>
              );
            })}
          </MDBTableBody>
        </MDBTable>
      </MDBModalBody>
    </MDBModal>
  );
}
