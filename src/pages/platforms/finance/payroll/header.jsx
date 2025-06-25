import { useEffect } from "react";
import { useSelector, useDispatch } from "react-redux";
import { MDBView } from "mdbreact";
import {
  PAYROLL,
  RESET,
} from "../../../../services/redux/slices/assets/persons/personnels";
import { employment } from "../../../../services/utilities";
// import { Select } from "../../../../components/customizable";
const Header = () => {
  const { token, activePlatform } = useSelector(({ auth }) => auth),
    dispatch = useDispatch();
  console.log("employment", employment);
  //Initial Browse
  useEffect(() => {
    if (token && activePlatform?.branchId) {
      const abbr = [...employment.employed].map(({ abbr }) => abbr);
      dispatch(
        PAYROLL({ token, params: { branchId: activePlatform?.branchId, abbr } })
      );
    }

    return () => dispatch(RESET());
  }, [token, dispatch, activePlatform]);

  return (
    <MDBView
      cascade
      className="gradient-card-header custom-header blue-gradient narrower py-2 mx-4 mb-3 d-flex justify-content-between align-items-center"
    >
      <div
        className="d-flex justify-items-center my-2"
        style={{ width: "20rem" }}
      >
        <span className="white-text mx-3 text-nowrap mt-0">Person List</span>
      </div>
      <div>
        <div className="text-right d-flex items-center">
          {/* <Select
            className="m-0 p-0 calendar mr-4"
            value={component}
            onChange={(value) => handleComponent(value)}
            inputClassName="m-0 p-0"
            preValue={component}
            collections={Templates.getComponents("LAB")}
          /> */}
        </div>
      </div>
    </MDBView>
  );
};

export default Header;
