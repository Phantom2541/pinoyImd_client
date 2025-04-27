import React, { useEffect, useState } from "react";
import { useDispatch, useSelector } from "react-redux";
import { MDBView } from "mdbreact";
// import { Select } from "../../../../../../components/customizable";
import { BROWSE } from "../../../../services/redux/slices/diagnostics/management/temperatures";
import { temperatures } from "../../../../services/redux/slices/diagnostics";

const Header = () => {
  const { maxPage, token, activePlatform } = useSelector(({ auth }) => auth),
    {
      collections = {},
      month,
      year,
    } = useSelector(({ temperatures }) => temperatures),
    [ecg, setEcg] = useState([]),
    dispatch = useDispatch();

  //initial values
  useEffect(() => {
    if (maxPage)
      dispatch(
        BROWSE({
          token,
          data: { branchId: activePlatform.branchId, month, year },
        })
      );
  }, [dispatch, maxPage, month, year]);

  useEffect(() => {
    if (collections) setEcg(collections);
  }, [collections]);

  const handleMoved = (month, year) => {
    console.log("month", month, year);
  };

  return (
    <MDBView
      cascade
      className="gradient-card-header custom-header blue-gradient narrower py-2 mx-4 mb-3 d-flex justify-content-between align-items-center"
    >
      <div className="d-flex justify-items-center" style={{ width: "20rem" }}>
        {/* <CalendarPicker month={month} year={year} moved={handleMoved} /> */}
        <span className="white-text mx-3 text-nowrap mt-0">
          {temperatures?.length} Temperatures
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
