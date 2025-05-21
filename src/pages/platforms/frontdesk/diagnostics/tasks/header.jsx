import React, { useEffect } from "react";
import { useDispatch, useSelector } from "react-redux";
import { MDBView } from "mdbreact";
import {
  TASKS,
  RESET,
  SetFILTERED,
} from "../../../../../services/redux/slices/diagnostics/laboratory/validator";
import { Search as SEARCH } from "../../../../../components/searchables";

const Headers = ({ searchKey }) => {
  const { token, activePlatform } = useSelector(({ auth }) => auth),
    { filtered } = useSelector(({ validator }) => validator),
    dispatch = useDispatch();

  //Initial Browse
  useEffect(() => {
    if (token && activePlatform?.branchId) {
      dispatch(
        TASKS({
          token,
          key: {
            department: [
              activePlatform?.department?.toLowerCase() === "laboratory"
                ? "LAB"
                : "RAD",
            ],
            branchId: activePlatform?.branchId,
            createdAt: new Date().setHours(0, 0, 0, 0),
          },
        })
      );
    }

    return () => dispatch(RESET());
  }, [token, dispatch, activePlatform]);

  return (
    <MDBView
      cascade
      className="gradient-card-header blue-gradient narrower py-2 mx-4 mb-3 d-flex justify-content-between align-items-center"
    >
      <span className="white-text mx-3">
        {filtered.length}&nbsp;
        {searchKey ? `Matches with ${searchKey}` : "Onboarding Tasks"}
      </span>
      <div className="text-right">
        {console.log("filtered", filtered)}
        <SEARCH
          collection={filtered}
          setFiltered={(items) => dispatch(SetFILTERED(items))}
          reset={() => dispatch(SetFILTERED(filtered))}
          haveAction={false}
        />
      </div>
    </MDBView>
  );
};

export default Headers;
