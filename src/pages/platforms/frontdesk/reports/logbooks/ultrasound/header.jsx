import React, { useEffect, useState } from "react";
import { useDispatch, useSelector } from "react-redux";
import { MDBView } from "mdbreact";
// import { Select } from "../../../../../../components/customizable";
import { BROWSE } from "../../../../../../services/redux/slices/diagnostics/radiology/ultrasound";
// import Calendar from "../../../../../templates/calendars/calendar";
import CalendarPicker from "../../../../../../components/header/calendars";

const Header = () => {
  const { maxPage, token, activePlatform } = useSelector(({ auth }) => auth),
    { collections, month, year } = useSelector(({ ultrasound }) => ultrasound),
    [ultrasound, setUltrasound] = useState([]),
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
  }, [dispatch, maxPage, activePlatform, month, year, token]);

  useEffect(() => {
    if (collections) setUltrasound(collections);
  }, [collections]);

  const handleMoved = (month, year) => {
    // dispatch(
    //   BROWSE({
    //     token,
    //     data: { branchId: activePlatform.branchId, month, year },
    //   })
    // );
  };

  return (
    <MDBView
      cascade
      className="gradient-card-header custom-header blue-gradient narrower py-2 mx-4 mb-3 d-flex justify-content-between align-items-center"
    >
      <div
        className="d-flex justify-items-center align-items-center"
        style={{ width: "20rem" }}
      >
        <CalendarPicker month={month} year={year} moved={handleMoved} />
        <span className="white-text mx-3 text-nowrap mt-0">
          {ultrasound.length} Ultrasound
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
