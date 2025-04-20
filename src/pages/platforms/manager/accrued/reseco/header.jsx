import React, { useEffect } from "react";
import { useDispatch, useSelector } from "react-redux";
import {
  BROWSE,
  SetFilterBySOURCE,
  RESET,
  SetMONTH,
  ResetDATE,
} from "../../../../../services/redux/slices/commerce/pos/services/deals";
import { MDBView, MDBBtn } from "mdbreact";
import CalendarPicker from "../../../../../components/header/calendars";
import { currency } from "../../../../../services/utilities";
import { Calendar } from "../../../../../services/fakeDb";
const Header = () => {
  const { maxPage, token, activePlatform, auth } = useSelector(
    ({ auth }) => auth
  );
  const { sources, month, year, filtered, vendor } = useSelector(
      ({ deals }) => deals
    ),
    dispatch = useDispatch();
  // Fetch vouchers
  useEffect(() => {
    const startDate = new Date(year, month - 1, 1);
    startDate.setHours(0, 0, 0, 0);
    const endDate = new Date(year, month, 0, 23, 59, 59, 999);
    endDate.setHours(23, 59, 59, 999);
    dispatch(
      BROWSE({
        token,
        key: {
          branchId: activePlatform.branchId,
          department: activePlatform.department,
          createdAt: startDate,
          endDate,
        },
      })
    );

    return () => dispatch(RESET());
  }, [dispatch, maxPage, activePlatform, auth._id, year, month, token]);

  const sum = filtered
    ?.flatMap(({ deals }) => deals.map((item) => item.amount))
    .reduce((acc, item) => acc + item, 0);

  const handlePrintOut = () => {
    const source = sources.find(({ _id }) => String(_id) === String(vendor));

    localStorage.setItem("resecos", JSON.stringify(filtered));
    localStorage.setItem(
      "header",
      JSON.stringify({ month: Calendar.Months[month - 1], year, source })
    );

    window.open(
      "/printout/reseco",
      "Reseco", // Unique window name 2
      "top=100px,left=0px,width=1050px,height=750px"
    );
  };

  return (
    <MDBView
      cascade
      className="gradient-card-header blue-gradient narrower py-2 mx-4 mb-3 d-flex justify-content-between align-items-center"
    >
      <CalendarPicker
        month={month}
        year={year}
        moved={(next) => dispatch(SetMONTH(next))}
        reset={() => dispatch(ResetDATE())}
      />
      <div>Gross : {currency(sum)}</div>
      <div>
        <MDBBtn color="blue" size="sm" onClick={() => handlePrintOut("lol")}>
          print
        </MDBBtn>
        <div className="text-right d-flex items-center ">
          <select
            id="cashier-select"
            className="custom-select mr-2"
            onChange={(e) => dispatch(SetFilterBySOURCE(e.target.value))}
          >
            <option value="" disabled>
              Select a Source
            </option>
            <option key="all" value="all">
              Select all
            </option>
            {sources?.map((source, index) => (
              <option key={`source-${index}`} value={source?._id}>
                {source?.displayname}
              </option>
            ))}
          </select>
        </div>
      </div>
    </MDBView>
  );
};

export default Header;
