import { useEffect } from "react";
import { useDispatch, useSelector } from "react-redux";
import { MDBView } from "mdbreact";
import {
  BROWSE,
  RESET,
  SetMONTH,
  ResetDATE,
  SetSTATUS,
} from "../../../../../services/redux/slices/finance/journals/soa";
import Search from "../../../../../components/searchables/search";
import CalendarPicker from "../../../../../components/header/calendars";
const Header = () => {
  const { token, activePlatform } = useSelector(({ auth }) => auth),
    { month, year } = useSelector(({ soa }) => soa),
    dispatch = useDispatch();

  //initial values
  useEffect(() => {
    if (token && activePlatform?.branchId) {
      const startDate = new Date(year, month - 1, 1);
      const endDate = new Date(year, month, 0, 23, 59, 59, 999);
      dispatch(
        BROWSE({
          token,
          keys: {
            branchId: activePlatform?.branchId,
            createdAt: startDate,
            endDate,
          },
        })
      );
    }
    return () => dispatch(RESET());
  }, [token, dispatch, activePlatform, month, year]);

  return (
    <MDBView
      cascade
      className="gradient-card-header custom-header blue-gradient narrower py-2 mx-4  d-flex justify-content-between align-items-center"
    >
      <CalendarPicker
        month={month}
        year={year}
        moved={(next) => dispatch(SetMONTH(next))}
        reset={() => dispatch(ResetDATE())}
      />
      <div className="d-flex justify-items-center">
        <span className="white-text mx-3 text-nowrap mt-0">
          Account Receivable List
        </span>
      </div>
      <div className="d-flex align-items-center">
        <div className="d-flex align-items-center">
          <span className="mr-2">Status:</span>
          <select
            className="form-control mr-4 bg-light"
            onChange={({ target }) => dispatch(SetSTATUS(target.value))}
          >
            <option value="all">All</option>
            <option value="sent">Sent</option>
            <option value="partial">Partial</option>
            <option value="settled">Settled</option>
          </select>
        </div>
        <div className="text-right d-flex items-center">
          <Search />
        </div>
      </div>
    </MDBView>
  );
};

export default Header;
