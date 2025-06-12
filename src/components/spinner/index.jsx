import { MDBIcon } from "mdbreact";

const Spinner = ({ formSubmitted = false }) => {
  return formSubmitted ? <MDBIcon icon="spinner" pulse className="ml-2" /> : "";
};

export default Spinner;
