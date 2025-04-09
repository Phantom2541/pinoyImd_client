import React, { useState, useEffect } from "react";
import { useDispatch, useSelector } from "react-redux";
import { MDBView } from "mdbreact";
import {
  SearchServices as Services,
  SearchTemplates as Templates,
  SearchYear as Year,
  SearchMonth as Month,
} from "../../../../../../components/searchables";
import {
  RESET,
  BROWSE,
  SetSERVICES,
} from "../../../../../../services/redux/slices/diagnostics/management/controls";
const Header = () => {
  const { token, activePlatform } = useSelector(({ auth }) => auth),
    [year, setYear] = useState(new Date().getFullYear()),
    [month, setMonth] = useState(new Date().getMonth() + 1),
    [template, setTemplate] = useState(1),
    [service, setService] = useState(1),
    dispatch = useDispatch();

  useEffect(() => {
    if (token && activePlatform?.branchId && year && month && service) {
      dispatch(
        BROWSE({
          token,
          params: {
            branchId: activePlatform?.branchId,
            year,
            month,
            service,
          },
        })
      );
    }
    return () => dispatch(RESET());
  }, [token, activePlatform, year, month, service, dispatch]);

  const handleServiceId = (serviceId) => {
    setService(serviceId);
    dispatch(SetSERVICES(serviceId));
  };

  return (
    <MDBView
      cascade
      className="gradient-card-header blue-gradient narrower py-2 mx-4 mb-3 d-flex justify-content-between align-items-center"
    >
      <div className="d-flex justify-items-center" style={{ width: "20rem" }}>
        <span className="white-text mx-3 text-nowrap mt-0">Controls </span>
      </div>
      <div>
        <div className="text-right d-flex items-center">
          <Templates setTemplate={setTemplate} />
          <Services template={template} setService={handleServiceId} />
          <Month month={month} setMonth={setMonth} />
          <Year year={year} setYear={setYear} />
        </div>
      </div>
    </MDBView>
  );
};

export default Header;
