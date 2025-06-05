import React, { useEffect, useState } from "react";
import { useDispatch, useSelector } from "react-redux";
import {
  VOUCHERS,
  SetFilterBySOURCE,
  RESET,
  SetMONTH,
  ResetDATE,
} from "../../../../../services/redux/slices/commerce/pos/services/deals";
import { MDBView } from "mdbreact";
import CalendarPicker from "../../../../../components/header/calendars";
const Header = () => {
  const { maxPage, token, activePlatform, auth } = useSelector(
    ({ auth }) => auth
  );
  const { sources, month, year, collections } = useSelector(
      ({ deals }) => deals
    ),
    [source, setSource] = useState("all"),
    dispatch = useDispatch();
  // Fetch vouchers
  useEffect(() => {
    dispatch(
      VOUCHERS({
        token,
        key: {
          branchId: activePlatform.branchId,
          cashierId: auth._id,
          month,
          year,
        },
      })
    );

    return () => dispatch(RESET());
  }, [dispatch, maxPage, activePlatform, auth._id, year, month, token]);

  useEffect(() => {
    if (collections.length > 0) {
      dispatch(SetFilterBySOURCE({ value: source }));
    }
  }, [source, dispatch, collections]);

  return (
    <MDBView
      cascade
      className="gradient-card-header blue-gradient narrower py-2 mx-4 mb-3 d-flex justify-content-between align-items-center"
    >
      <CalendarPicker
        month={month}
        year={year}
        moved={(next) => {
          dispatch(SetMONTH(next));
          setSource("all"); //to reset the selected source into all
        }}
        reset={() => dispatch(ResetDATE())}
      />
      <div>
        <div className="text-right d-flex items-center ">
          <select
            id="cashier-select"
            className="custom-select mr-2"
            value={source}
            onChange={(e) => setSource(e.target.value)}
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
