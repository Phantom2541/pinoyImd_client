import { useEffect, useState } from "react";
import { useDispatch, useSelector } from "react-redux";
import { MDBView } from "mdbreact";
import {
  SEND_OUTS,
  SetMONTH,
  ResetDATE,
  SetVENDOR,
} from "../../../../../services/redux/slices/commerce/pos/services/onBoardings";
import CalendarPicker from "../../../../../components/header/calendars";

const Header = () => {
  const { token, activePlatform } = useSelector(({ auth }) => auth),
    { month, year, collections } = useSelector(
      ({ onBoardings }) => onBoardings
    ),
    [vendors, setVendors] = useState([]),
    dispatch = useDispatch();

  useEffect(() => {
    if (token) {
      const startDate = new Date(year, month - 1, 1);
      const endDate = new Date(year, month, 0, 23, 59, 59, 999);
      dispatch(
        SEND_OUTS({
          token,
          params: {
            branchId: activePlatform?.branchId,
            createdAt: startDate,
            endDate,
          },
        })
      );
    }
  }, [token, dispatch, activePlatform, month, year]);

  useEffect(() => {
    if (collections.length > 0) {
      setVendors([
        ...new Map(
          collections.map((item) => [item?.vendor?._id, item?.vendor])
        ).values(),
      ]);
    }
  }, [collections]);

  return (
    <MDBView
      cascade
      className="gradient-card-header custom-header blue-gradient narrower py-2 mx-4 d-flex justify-content-between align-items-center"
    >
      <CalendarPicker
        month={month}
        year={year}
        moved={(next) => dispatch(SetMONTH(next))}
        reset={() => dispatch(ResetDATE())}
      />
      <div>
        <span className="white-text  text-nowrap fw-bold  mr-5">
          Sendout List
        </span>
      </div>
      <div className="d-flex align-items-center" style={{ width: "300px" }}>
        <span className="mr-2">Branch:</span>
        <select
          className="form-control"
          onChange={({ target }) => dispatch(SetVENDOR(target.value))}
        >
          <option value={"all"}> All</option>
          {vendors.map((vendor) => (
            <option key={vendor?._id} value={vendor?._id}>
              {vendor?.displayname || vendor?.name}
            </option>
          ))}
        </select>
      </div>
    </MDBView>
  );
};

export default Header;
