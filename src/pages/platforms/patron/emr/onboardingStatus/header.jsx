import React, { useEffect } from "react";
import { useDispatch, useSelector } from "react-redux";
import { MDBView } from "mdbreact";
import { PATIENT } from "../../../../../services/redux/slices/commerce/pos/services/onBoardings";
const Header = () => {
  const { token, auth } = useSelector(({ auth }) => auth);
  const { filtered, year } = useSelector(({ onBoardings }) => onBoardings), //
    dispatch = useDispatch();

  useEffect(() => {
    if (token && auth._id && year) {
      dispatch(PATIENT({ token, key: { pid: auth._id, year } }));
    }
  }, [token, auth, year, dispatch]);
  const handleyear = (yr) =>
    dispatch(PATIENT({ token, key: { pid: auth._id, yr } }));

  //initial values

  return (
    <MDBView
      cascade
      className="gradient-card-header custom-header blue-gradient narrower py-2 mx-4 mb-3 d-flex justify-content-between align-items-center"
    >
      <div className="d-flex justify-items-center" style={{ width: "20rem" }}>
        <span className="white-text mx-3 text-nowrap mt-0">
          {filtered?.length} Bookings
        </span>
      </div>
      <div className="text-right d-flex align-items-center">
        <select
          className="form-control"
          value={year}
          onChange={(e) => handleyear(e.target.value)}
          style={{ width: "6rem" }}
        >
          {Array.from({ length: 6 }, (_, i) => {
            const y = new Date().getFullYear() - 4 + i;
            return (
              <option key={y} value={y}>
                {y}
              </option>
            );
          })}
        </select>
      </div>
    </MDBView>
  );
};

export default Header;
