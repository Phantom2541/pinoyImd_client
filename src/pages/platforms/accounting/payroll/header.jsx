import { useEffect } from "react";
import { useSelector, useDispatch } from "react-redux";
import { MDBView } from "mdbreact";
import {
  PAYROLL,
  SetMONTH,
  RESET,
  SetFILTERED,
  ResetDATE,
} from "../../../../services/redux/slices/assets/persons/personnels";
import { employment } from "../../../../services/utilities";
// import { Select } from "../../../../components/customizable";
import CalendarPicker from "../../../../components/header/calendars";
import { Search } from "../../../../components/searchables";

const Header = () => {
  const { token, activePlatform } = useSelector(({ auth }) => auth),
    { month, year, isLoading, collections } = useSelector(
      ({ personnels }) => personnels
    ),
    dispatch = useDispatch();
  useEffect(() => {
    if (token && activePlatform?.branchId) {
      const abbr = [...employment.employed].map(({ abbr }) => abbr);
      dispatch(
        PAYROLL({
          token,
          params: {
            branchId: activePlatform?.branchId,
            abbr,
            timezone: "Asia/Manila",
            month,
            year,
          },
        })
      );
    }

    return () => dispatch(RESET());
  }, [token, dispatch, activePlatform, month, year]);

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
        isLoading={isLoading}
      />

      <span className="white-text mx-3 text-nowrap mt-0 fw-bold">
        Personnel List
      </span>

      <Search
        haveAction={false}
        collections={collections}
        setFiltered={(items) => dispatch(SetFILTERED(items))}
        reset={() => dispatch(SetFILTERED(collections))}
      />
    </MDBView>
  );
};

export default Header;
