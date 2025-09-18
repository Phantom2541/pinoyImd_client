import { useDispatch, useSelector } from "react-redux";
import {
  MDBModal,
  MDBModalBody,
  MDBIcon,
  MDBModalHeader,
  MDBRow,
} from "mdbreact";
import { TOGGLE_TRANSAC_MODAL } from "../../../../../services/redux/slices/diagnostics/clinic/appointments";
import { fullName } from "../../../../../services/utilities";
import Summary from "./summary";
import Menus from "./menus";

export default function TransactionModal() {
  const { showTransacModal: show, selected } = useSelector(
      ({ appointments }) => appointments
    ),
    dispatch = useDispatch();

  const toggle = () => dispatch(TOGGLE_TRANSAC_MODAL());

  const { patient = {} } = selected;

  return (
    <MDBModal isOpen={show} toggle={toggle} backdrop size="xl">
      <MDBModalHeader
        toggle={toggle}
        className="appEhr light-blue darken-3 white-text"
      >
        <MDBIcon icon="cash-register" className="appEhr mr-2" />{" "}
        {fullName(patient?.fullName)}
      </MDBModalHeader>

      <MDBModalBody className="appEhr mb-0">
        <MDBRow>
          <Menus />

          <Summary />
        </MDBRow>
      </MDBModalBody>
    </MDBModal>
  );
}
