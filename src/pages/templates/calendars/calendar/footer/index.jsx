import { MDBBtn, MDBBtnGroup, MDBIcon } from "mdbreact";

const Footer = () => {
  return (
    <MDBBtnGroup className="sales-card-footer w-100">
      <MDBBtn
        type="button"
        className="m-0"
        size="sm"
        color="primary"
        title="Edit"
        onClick={() => false}
      >
        <MDBIcon icon="pencil-alt" />
      </MDBBtn>

      <MDBBtn
        type="button"
        onClick={() => false}
        title="Pre-Analytical Supply Dispense"
        className="m-0 "
        size="sm"
        color="primary"
      >
        <MDBIcon icon="cog" spin />
      </MDBBtn>

      <MDBBtn
        type="button"
        onClick={() => false}
        className="m-0 "
        title="Generate Task"
        size="sm"
        color="primary"
      >
        <MDBIcon icon="user-injured" />
      </MDBBtn>
    </MDBBtnGroup>
  );
};

export default Footer;
