import { MDBIcon, MDBView } from "mdbreact";
import { useEffect } from "react";
import { Policy } from "../../../../services/fakeDb";
import { useDispatch, useSelector } from "react-redux";
import { BOARD_MEMBERS } from "../../../../services/redux/slices/assets/persons/personnels";
import {
  BROWSE,
  TOGGLE,
  SetMONTH,
  ResetDATE,
  SetFIRST_SCHED,
} from "../../../../services/redux/slices/finance/bookkeeping/duties";
import { employment } from "../../../../services/utilities";
import CalendarPicker from "../../../../components/header/calendars";

const Header = () => {
  const { activePlatform, token } = useSelector(({ auth }) => auth),
    { isFirstSched, month, year, selected, isLoading } = useSelector(
      ({ duties }) => duties
    ),
    dispatch = useDispatch();

  useEffect(() => {
    const designations = Policy.getDesignationIDS(activePlatform.department);
    const bannedStats = employment.nonEmployed.map(({ abbr }) => abbr);
    dispatch(
      BOARD_MEMBERS({
        token,
        params: {
          branchId: activePlatform?.branchId,
          designations,
          bannedStats,
        },
      })
    );
  }, [activePlatform, token]);

  useEffect(() => {
    dispatch(
      BROWSE({
        token,
        params: { branchId: activePlatform?.branchId, month, year },
      })
    ).then(() => {
      dispatch(SetFIRST_SCHED(null));
    });
  }, [activePlatform, token, month, year]);

  const lastDay = new Date(year, month, 0).getDate(); // e.g., 31

  const handlePrint = () => {
    const URL = `${window.location.origin}/printout/duty`;
    const sizes = "top=100px,left=100px,width=794px,height=1123px";
    localStorage.setItem(
      "dutyPrintout",
      JSON.stringify({
        ...selected,
        isFirstSched,
        month,
        year,
        branch: activePlatform.branch,
      })
    );
    setTimeout(() => {
      const printWindow = window.open(URL, "DUTY PRINTOUT", sizes);
      if (printWindow) printWindow.focus();
    }, 100);
  };

  return (
    <MDBView
      cascade
      className="gradient-card-header custom-header blue-gradient narrower py-2 mx-4 d-flex justify-content-between align-items-center"
    >
      <i>Schedules</i>

      <div className="d-flex align-items-center">
        <CalendarPicker
          moved={(next) => dispatch(SetMONTH(next))}
          reset={() => dispatch(ResetDATE())}
          month={month}
          year={year}
        />
        <select
          className="form-control ml-2"
          disabled={isLoading}
          value={String(isFirstSched)}
          onChange={({ target }) =>
            dispatch(SetFIRST_SCHED(target.value === "true"))
          }
        >
          <option value={"true"}>1 - 15</option>
          <option value={"false"}>16 - {lastDay}</option>
        </select>
        <button
          onClick={() => (selected._id ? handlePrint() : dispatch(TOGGLE()))}
          size="sm"
          disabled={isLoading}
          className="search-add-btn ml-2"
        >
          <MDBIcon icon={selected._id ? "print" : "plus"} />
        </button>
      </div>
    </MDBView>
  );
};

export default Header;
