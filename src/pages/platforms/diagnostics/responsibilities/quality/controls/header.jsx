import React, { useState, useEffect } from "react";
import { useDispatch, useSelector } from "react-redux";
import { MDBIcon, MDBView, MDBBtn } from "mdbreact";
import {
  SearchServices as Services,
  SearchTemplates as Templates,
  SearchYear as Year,
  SearchMonth as Month,
} from "../../../../../../components/searchables";
import {
  RESET,
  BROWSE,
} from "../../../../../../services/redux/slices/responsibilities/controls";
const Header = ({ hasAction, onCreate, setSelected }) => {
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

  const handleCreate = () => {
    setSelected({
      serviceId: service,
    });
    onCreate(true);
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
          <Services template={template} setService={setService} />
          <Templates setTemplate={setTemplate} />
          <Month month={month} setMonth={setMonth} />
          <Year year={year} setYear={setYear} />
          {hasAction && (
            <MDBBtn
              size="sm"
              className="px-2"
              rounded
              color="success"
              onClick={handleCreate}
            >
              <MDBIcon icon="plus" />
            </MDBBtn>
          )}
        </div>
      </div>
    </MDBView>
  );
};

export default Header;
