import React, { useEffect, useState } from "react";
import { useDispatch, useSelector } from "react-redux";
import { MDBView } from "mdbreact";
// import { Select } from "../../../../../../components/customizable";
import { BROWSE } from "../../../../../../services/redux/slices/diagnostics/radiology/xray";

const Header = () => {
  const { maxPage, token } = useSelector(({ auth }) => auth),
    { collections } = useSelector(({ xray }) => xray),
    [xray, setXray] = useState([]),
    dispatch = useDispatch();

  //initial values
  useEffect(() => {
    if (maxPage) dispatch(BROWSE({ token }));
  }, [dispatch, maxPage]);

  useEffect(() => {
    if (collections) setXray(collections);
  }, [collections]);

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
          {xray.length} Xray
        </span>
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
