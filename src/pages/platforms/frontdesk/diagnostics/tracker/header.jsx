import React, { useEffect } from "react";
import { useDispatch, useSelector } from "react-redux";

import {
  TRACKER,
  SetPatient,
} from "../../../../../services/redux/slices/commerce/pos/services/deals";
import { fullName, getAge } from "../../../../../services/utilities";
import { SearchUser } from "../../../../../components/searchables";
import { MDBView } from "mdbreact";
export default function Header() {
  const { token, activePlatform } = useSelector(({ auth }) => auth),
    {
      _id,
      dob,
      fullName: fullname,
    } = useSelector(({ deals }) => deals.patient),
    dispatch = useDispatch();

  useEffect(() => {
    if (_id && activePlatform?.branchId) {
      dispatch(
        TRACKER({
          token,
          key: {
            branchId: activePlatform?.branchId,
            customerId: _id,
          },
        })
      );
    }
  }, [_id, activePlatform, dispatch, token]);

  const selectPatient = (user) => dispatch(SetPatient(user));

  return (
    <MDBView
      cascade
      className="gradient-card-header blue-gradient narrower py-2 mx-4 mb-3 d-flex justify-content-between align-items-center"
    >
      <span className="mb-0">
        {_id ? fullName(fullname) : "Tracker"} | &nbsp; 
        {_id && getAge(dob)}
      </span>
      <SearchUser setPatient={selectPatient} />
    </MDBView>
  );
}
