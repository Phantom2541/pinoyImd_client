import React, { useState, useEffect } from "react";
import { useDispatch, useSelector } from "react-redux";
import { MDBView } from "mdbreact";
import {
  SearchServices as Services,
  SearchTemplates as Templates,
} from "../../../../../../components/searchables";
import {
  RESET,
  BROWSE,
  SetSERVICES,
  SetMONTH,
} from "../../../../../../services/redux/slices/diagnostics/management/controls";
import CalendarPicker from "../../../../../../components/header/calendars";

const Header = () => {
  const { token, activePlatform } = useSelector(({ auth }) => auth),
    { month, year } = useSelector(({ controls }) => controls),
    [template, setTemplate] = useState(1),
    dispatch = useDispatch();

  useEffect(() => {
    if (token && activePlatform?.branchId && year && month) {
      dispatch(
        BROWSE({
          token,
          params: {
            branchId: activePlatform?.branchId,
            year,
            month,
          },
        })
      );
    }
    return () => dispatch(RESET());
  }, [token, activePlatform, year, month, dispatch]);

  const handleServiceId = (id) => dispatch(SetSERVICES(id));

  return (
    <MDBView
      cascade
      className="gradient-card-header blue-gradient narrower py-0 px-4 mx-4 mb-3 d-flex justify-content-between align-items-center"
      style={{ flexWrap: "wrap" }}
    >
      {/* Left Section */}
      <div className="d-flex align-items-center" style={{ width: "20rem" }}>
        <CalendarPicker
          year={year}
          month={month}
          moved={(direction) => dispatch(SetMONTH(direction))}
          reset={() => dispatch(RESET())}
        />
      </div>

      {/* Right Section */}
      <div
        className="d-flex justify-content-end align-items-center flex-wrap"
        style={{ gap: "10px" }}
      >
        <Templates setTemplate={setTemplate} />
        <Services template={template} setService={handleServiceId} />
      </div>
    </MDBView>
  );
};

export default Header;
