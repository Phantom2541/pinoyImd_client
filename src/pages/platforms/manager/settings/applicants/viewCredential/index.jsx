import { MDBModal, MDBModalBody, MDBModalHeader } from "mdbreact";
import { useDispatch, useSelector } from "react-redux";
import { ToggleViewCredential } from "../../../../../../services/redux/slices/assets/persons/applicants";
import { Cloudinary, fullName } from "../../../../../../services/utilities";
import DocumentViewer from "../../../../../../components/documentViewer";

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
        <DocumentViewer
          src={`${Cloudinary.getEndpoint(false)}/users/${
            user?.email
          }/credentials/${companyId?.name}/${type}`}
          height="585px"
        />
      </MDBModalBody>
    </MDBModal>
  );
}
