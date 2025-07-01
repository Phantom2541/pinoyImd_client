import React, { useEffect } from "react";
import { useDispatch, useSelector } from "react-redux";
import { MDBView } from "mdbreact";
import { TIEUPS } from "../../../../../services/redux/slices/assets/persons/physicians";
const Header = () => {
  const { activePlatform, token } = useSelector(({ auth }) => auth),
    { collections } = useSelector(({ physicians }) => physicians),
    dispatch = useDispatch(); //

  //Initial Browse
  useEffect(() => {
    if (token && activePlatform?.branchId)
      dispatch(TIEUPS({ key: { branch: activePlatform?.branchId }, token }));

    // return () => dispatch(RESET());
  }, [token, activePlatform, dispatch]);

  return (
    <MDBView
      cascade
      className="gradient-card-header custom-header blue-gradient narrower py-2 mx-4 mb-3 d-flex justify-content-between align-items-center"
    >
      <div className="d-flex justify-items-center" style={{ width: "20rem" }}>
        <span className="white-text mx-3 text-nowrap mt-0">
          {collections.length} Affiliated Physicians
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
