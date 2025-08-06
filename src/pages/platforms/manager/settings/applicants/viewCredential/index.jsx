import { MDBModal, MDBModalBody, MDBModalHeader } from "mdbreact";
import { useDispatch, useSelector } from "react-redux";
import { ToggleViewCredential } from "../../../../../../services/redux/slices/assets/persons/applicants";
import {
  CLOUDINARY_ENDPOINT,
  ENDPOINT,
  fullName,
} from "../../../../../../services/utilities";

const types = {
  AppLetter: "Application Letter",
  DataSheet: "Personal Data Sheet",
  Resume: "Resume",
};

export default function ViewCredential() {
  const { activePlatform } = useSelector(({ auth }) => auth),
    { selected, showViewCredential } = useSelector(
      ({ applicants }) => applicants
    ),
    dispatch = useDispatch();

  const { branch = {} } = activePlatform;
  const { companyId = {} } = branch || {};

  const toggle = () => dispatch(ToggleViewCredential());
  const { user, type } = selected;
  return (
    <MDBModal
      isOpen={showViewCredential}
      toggle={toggle}
      size="lg"
      style={{ overFlow: "auto" }}
    >
      <MDBModalHeader
        toggle={toggle}
        className="light-blue darken-3 white-text"
      >
        {types[type]} <br />
        <h6 style={{ marginBottom: "-0.8rem" }}>
          {`${fullName(user?.fullName) || ""} `}
        </h6>
      </MDBModalHeader>
      <MDBModalBody className="m-0 p-0">
        <iframe
          src={`${CLOUDINARY_ENDPOINT}/users/${user?.email}/credentials/${companyId?.name}/${type}.pdf`}
          title="Personal Data"
          style={{
            width: "100%",
            height: "30rem",
            border: "1px solid #ccc",
            borderRadius: "10px",
            boxShadow: "0 4px 12px rgba(0, 0, 0, 0.1)",
            display: "block",
            margin: "auto",
          }}
        />
      </MDBModalBody>
    </MDBModal>
  );
}
