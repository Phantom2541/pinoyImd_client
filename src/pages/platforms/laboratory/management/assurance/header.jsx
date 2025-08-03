import React, { useState, useEffect, useCallback } from "react";
import { useDispatch, useSelector } from "react-redux";
import { MDBIcon, MDBView, MDBBtn } from "mdbreact";
import {
  SearchServices as Services,
  SearchTemplates as Templates,
} from "./../../../../../components/searchables";
import {
  RESET,
  BROWSE,
  SetCREATE,
  SetMONTH,
} from "./../../../../../services/redux/slices/diagnostics/management/assurances";
import CalendarPicker from "../../../../../components/header/calendars";

const Header = () => {
  const { token, activePlatform } = useSelector(({ auth }) => auth),
    { month, year } = useSelector(({ assurances }) => assurances),
    [template, setTemplate] = useState(1),
    [service, setService] = useState(1),
    memoizedSetService = useCallback((value) => {
      setService(value);
    }, []),
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

  return (
    <MDBView
      cascade
      className="gradient-card-header blue-gradient narrower py-0 mx-4 mb-3 d-flex justify-content-between align-items-center"
    >
      <div
        className="d-flex justify-items-center align-items-center"
        style={{ maxWidth: "400px" }}
      >
        <span className="white-text mx-3 text-nowrap mt-0">EQAS </span>
        <Templates setTemplate={setTemplate} />
        <Services
          template={template}
          service={service}
          setService={memoizedSetService}
        />
      </div>
      <div>
        <div className="text-right d-flex items-center">
          <CalendarPicker
            month={month}
            year={year}
            moved={(direction) => dispatch(SetMONTH(direction))}
            reset={() => dispatch(RESET())}
          />
          <MDBBtn
            size="sm"
            className="px-2"
            rounded
            color="success"
            onClick={() =>
              dispatch(
                SetCREATE({
                  serviceId: service,
                })
              )
            }
          >
            <MDBIcon icon="plus" />
          </MDBBtn>
        </div>
      </div>
    </MDBView>
  );
};

export default Header;
