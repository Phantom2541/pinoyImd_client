import { useSelector } from "react-redux";
import { MDBView } from "mdbreact";
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
        <div>
          {/* <Select
            className="m-1 mt-2 mr-4"
            value={component}
            onChange={(value) => handleComponent(value)}
            inputClassName="m-0"
            preValue={component}
            collections={Templates.getComponents("LAB")}
            label="Select Component"
          /> */}
        </div>
      </div>
    </MDBView>
  );
};

export default Header;
