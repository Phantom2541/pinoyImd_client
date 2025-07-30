import { MDBIcon } from "mdbreact";

const Spinner = ({ formSubmitted = false, className = "ml-2" }) => {
  return formSubmitted ? (
    <MDBIcon icon="spinner" pulse className={className} />
  ) : (
    ""
  );
};

export default Spinner;
