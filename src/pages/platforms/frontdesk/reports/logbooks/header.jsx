import React, { useEffect } from "react";
import { useLocation, useHistory } from "react-router-dom";
import { MDBView, MDBBtnGroup, MDBBtn, MDBIcon } from "mdbreact";
import { useDispatch, useSelector } from "react-redux";
import Months from "../../../../../services/fakeDb/calendar/months";
import Years from "../../../../../services/fakeDb/calendar/years";
const today = new Date();

const Header = ({ BROWSE, RESET, title, printPath = "chem" }) => {
  const { token, activePlatform } = useSelector(({ auth }) => auth),
    { search, pathname } = useLocation(),
    query = new URLSearchParams(search),
    month = query.get("month"),
    year = query.get("year"),
    focusedDay = query.get("focusedDay"),
    history = useHistory(),
    dispatch = useDispatch();

  useEffect(() => {
    if (token && activePlatform?.branchId) {
      dispatch(
        BROWSE({
          data: {
            branch: activePlatform?.branchId,
            month: month || today.getMonth() + 1,
            year: year || today.getFullYear(),
          },
          token,
        })
      );
    }
    return () => RESET();
  }, [activePlatform, dispatch, token, month, year, RESET, BROWSE]);

  useEffect(() => {
    const params = new URLSearchParams({
      month: today.getMonth() + 1, // Add 1 to match human-readable month format
      year: today.getFullYear(),
    });
    history.push(`${pathname}?${params.toString()}`);
  }, [history, pathname]);

  const prev = (clearFocused = true) => {
    let _month = Number(month) === 1 ? 12 : Number(month) - 1, // Adjust the month to be 1-based
      _year = Number(month) === 1 ? Number(year) - 1 : Number(year);

    const params = new URLSearchParams({
      month: _month,
      year: _year,
      ...(!clearFocused && { focusedDay }),
    });

    history.push(`${pathname}?${params.toString()}`);

    if (!clearFocused) dispatch(RESET({ resetCollections: true }));
  };

  const next = (clearFocused = true) => {
    let _month = Number(month) === 12 ? 1 : Number(month) + 1, // Adjust the month to be 1-based
      _year = Number(month) === 12 ? Number(year) + 1 : Number(year);

    const params = new URLSearchParams({
      month: _month,
      year: _year,
      ...(!clearFocused && { focusedDay }),
    });

    history.push(`${pathname}?${params.toString()}`);

    if (!clearFocused) dispatch(RESET({ resetCollections: true }));
  };

  const selectToday = () => {
    const params = new URLSearchParams({
      month: today.getMonth() + 1, // Add 1 to match human-readable month format
      year: today.getFullYear(),
    });
    history.push(`${pathname}?${params.toString()}`);
  };
  const disablePrevOnLastChoice = () => {
    if (Number(month) === 0 && Number(year) === Years[0]) return true;
    return false;
  };

  const isTodaySelected =
    Number(month) === today.getMonth() + 1 &&
    Number(year) === today.getFullYear();

  const disableNextOnLastChoice = () => {
    if (Number(month) === 11 && Number(year) === Years[Years.length - 1])
      return true;
    return false;
  };

  const handlePrint = () => {
    localStorage.setItem("month", JSON.stringify(month));
    localStorage.setItem("year", JSON.stringify(year));
    window.open(
      `/printout/${printPath}`,
      `${title} Logbook`,
      "top=100px,left=100px,width=1050px,height=750px" // size of page that will open
    );
  };

  return (
    <MDBView
      cascade
      className="gradient-card-header blue-gradient narrower py-2 mx-4 mb-3 d-flex justify-content-between align-items-center"
    >
      <div>
        <i>{title}</i>
      </div>
      <div className="d-flex align-items-center justify-content-center">
        <MDBBtnGroup>
          <MDBBtn
            onClick={prev}
            disabled={disablePrevOnLastChoice()}
            size="sm"
            className="p-2 m-0"
            rounded
            color="light"
          >
            <MDBIcon icon="angle-left" style={{ fontSize: "1rem" }} />
          </MDBBtn>
          <MDBBtn color="light" style={{ fontSize: "1rem" }} className="m-0">
            {Months[month - 1]}&nbsp;
            {year}
          </MDBBtn>
          <MDBBtn
            onClick={next}
            disabled={disableNextOnLastChoice()}
            size="sm"
            className="p-2 m-0"
            rounded
            color="light"
          >
            <MDBIcon icon="angle-right" style={{ fontSize: "1rem" }} />
          </MDBBtn>
        </MDBBtnGroup>
        <MDBBtn
          size="sm"
          rounded
          className="ml-3 p-2 z-depth-0"
          onClick={selectToday}
          color="warning"
          style={{ marginTop: "-14px" }}
          disabled={isTodaySelected}
        >
          Today
        </MDBBtn>
      </div>
      <MDBBtn color="primary" size="sm" onClick={handlePrint}>
        <MDBIcon icon="print" /> Print
      </MDBBtn>
    </MDBView>
  );
};

export default Header;
