import { useSelector } from "react-redux";
import { MDBBtn, MDBView } from "mdbreact";
// import { Select } from "../../../components/customizable";
const Header = () => {
  const { filtered } = useSelector(({ personnels }) => personnels); //
  // const handleComponent = (value) => {
  //   setComponent(value);

  //   const template = Templates.getComponentIndex(value);
  //   dispatch(SetByTEMPLATES(template));
  // };

  return (
    <MDBView
      cascade
      className="gradient-card-header custom-header blue-gradient narrower py-2 mx-4 mb-3 d-flex justify-content-between align-items-center"
    >
      <div className="d-flex justify-items-center" style={{ width: "20rem" }}>
        <span className="white-text mx-3 text-nowrap mt-0">
          {filtered.length} Personels
        </span>
      </div>
      <div>
        <div className="id-generator-prinout-btn">
          <MDBBtn size="sm" color="primary">
            <i class="fas fa-print" /> <span>Print</span>
          </MDBBtn>
        </div>
      </div>
    </MDBView>
  );
};

export default Header;
