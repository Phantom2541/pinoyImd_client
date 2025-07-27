import { useHistory } from "react-router";
import { MDBCard, MDBCardBody, MDBIcon } from "mdbreact";
import pinoyImd from "../../../assets/iMD.png";
const Header = ({ companyId }) => {
  const history = useHistory();

  return (
    <MDBCard className="mb-4  bg-primary text-white">
      <MDBCardBody className="m-0 p-0 p-2 mx-2">
        <div className="d-flex align-items-center justify-content-between ">
          <MDBIcon
            far
            icon="arrow-alt-circle-left"
            onClick={() => history.push(`/subscribers/${companyId}`)}
            style={{ fontSize: "1.8rem", color: "white" }}
          />
          <h5 style={{ fontWeight: 500 }} className="mt-1">
            PINOY-iMD
          </h5>
          <img src={pinoyImd} alt="Pinoy IMD" style={{ height: "2.5rem" }} />
        </div>
      </MDBCardBody>
    </MDBCard>
  );
};

export default Header;
