import React, { useEffect } from "react";
import { useDispatch, useSelector } from "react-redux";
import { MDBView } from "mdbreact";
import { useToasts } from "react-toast-notifications";
import {
  RESET,
  BROWSE,
  ResetDATE,
  SetPAYABLES,
  SetFILTERED,
  SetMONTH,
} from "../../../../../services/redux/slices/finance/journals/payables";

import { Search } from "../../../../../components/searchables";
import CalendarPicker from "../../../../../components/header/calendars";
// import { SearchUser } from "../../../../../components/searchables";
export default function TopHeader() {
  const { token, activePlatform } = useSelector(({ auth }) => auth),
    { message, isSuccess, month, year, collections } = useSelector(
      ({ payables }) => payables
    ),
    { addToast } = useToasts(),
    dispatch = useDispatch();

  // initial values
  useEffect(() => {
    if (token && activePlatform?.branchId) {
      dispatch(
        BROWSE({
          token,
          key: {
            branch: activePlatform?.branchId,
            year,
            month,
          },
        })
      );
    }
    return () => {
      dispatch(RESET());
    };
  }, [token, activePlatform, dispatch, month, year]);

  useEffect(() => {
    message &&
      addToast(message, {
        appearance: isSuccess ? "success" : "error",
      });

    return () => dispatch(RESET());
  }, [isSuccess, message, addToast, dispatch]);

  return (
    <MDBView
      cascade
      className="gradient-card-header blue-gradient narrower py-2 mx-4 mb-3 d-flex justify-content-between align-items-center"
    >
      <div className="d-flex justify-items-center" style={{ width: "20rem" }}>
        <CalendarPicker
          month={month}
          year={year}
          moved={(next) => dispatch(SetMONTH(next))}
          reset={() => dispatch(ResetDATE())}
        />
      </div>
      <span className="white-text mx-5 text-nowrap mt-0">PAYABLES</span>
      <div>
        <div className="text-right d-flex items-center">
          <Search
            collection={collections}
            setFiltered={(items) => dispatch(SetFILTERED(items))}
            handleAdd={(key) => dispatch(SetPAYABLES(key))}
            reset={() => dispatch(SetFILTERED(collections))}
            hideButton={false}
            haveAction
          />
        </div>
      </div>
    </MDBView>
  );
}
