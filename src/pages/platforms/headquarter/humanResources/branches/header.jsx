import React, { useEffect } from "react";
import { useDispatch, useSelector } from "react-redux";
import { MDBView } from "mdbreact";
import { Select } from "../../../../../components/customizable";
import { BROWSE } from "../../../../../services/redux/slices/assets/branches";

const Header = () => {
  const { activePlatform, token } = useSelector(({ auth }) => auth),
    { filtered } = useSelector(({ branches }) => branches),
    dispatch = useDispatch();

  //initial values
  useEffect(() => {
    if (token && activePlatform?.branchId)
      dispatch(
        BROWSE({
          token,
          key: { companyId: activePlatform?.branch.companyId._id },
        })
      );
  }, [dispatch, activePlatform, token]);

  return (
    <MDBView
      cascade
      className="gradient-card-header blue-gradient narrower py-2 mx-4 mb-3 d-flex justify-content-between align-items-center"
    >
      <div className="d-flex justify-items-center" style={{ width: "20rem" }}>
        <span className="white-text mx-3 text-nowrap mt-0">
          {filtered.length} Branches
        </span>
      </div>
      <div>
        <div className="text-right d-flex items-center">
          <Select
            className="m-0 p-0  mr-4 "
            // value={component}
            // onChange={(value) => handleComponent(value || "LAB")}
            inputClassName="m-0 p-0 text-white"
            // preValue={component}
            // collections={Templates.getComponents("LAB")}
          />
        </div>
      </div>
    </MDBView>
  );
};

export default Header;
