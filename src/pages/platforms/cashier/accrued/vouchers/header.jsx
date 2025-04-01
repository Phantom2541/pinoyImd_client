import React, { useEffect, useState } from "react";
import { useDispatch, useSelector } from "react-redux";
import { MDBView } from "mdbreact";
// import { Select } from "../../../../components/customizable";
// import { Templates, Services } from "../../../services/fakeDb";
import { VOUCHERS } from "../../../../../services/redux/slices/commerce/pos/services/deals";
const Header = () => {
  const { maxPage, token, activePlatform, auth } = useSelector(
      ({ auth }) => auth
    ),
    { collections } = useSelector(({ services }) => services),
    [component, setComponent] = useState(""),
    dispatch = useDispatch();
  const month = 2,
    year = 2025;

  // initial values
  useEffect(() => {
    const startDate = new Date(year, month, 1);
    startDate.setHours(0, 0, 0, 0);
    const endDate = new Date(year, month + 1, 0, 23, 59, 59, 999);
    endDate.setHours(23, 59, 59, 999);
    dispatch(
      VOUCHERS({
        token,
        key: {
          branch: activePlatform.branchId,
          cashier: auth._id,
          startDate: startDate.toISOString(),
          endDate: endDate.toISOString(),
        },
      })
    );
  }, [dispatch, maxPage]);

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
          {collections.length} Services
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
