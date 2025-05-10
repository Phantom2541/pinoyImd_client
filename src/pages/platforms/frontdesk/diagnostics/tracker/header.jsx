import React, { useEffect } from "react";
import { useDispatch, useSelector } from "react-redux";
import { useLocation } from "react-router-dom";
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
    dispatch = useDispatch(),
    location = useLocation();
  const params = new URLSearchParams(location.search);
  const patientId = params.get("patient");
  /**
   * Initial Fetch
   * Return all diagnostics
   * only same branch can de edited if meet conditions.
   *  1. same branch
   *  2. same department
   *  3. same performer
   *  4. with in 7 days
   */
  useEffect(() => {
    if (patientId) {
      dispatch(
        TRACKER({
          token,
          key: {
            customerId: patientId,
          },
        })
      );
      dispatch(SetPatient(JSON.parse(localStorage.getItem("customerId"))));
    } else if (_id && activePlatform?.branchId) {
      dispatch(
        TRACKER({
          token,
           key: {
            customerId: _id,
            department: activePlatform?.department,
          },
        })
      );
    }
  }, [_id, activePlatform, dispatch, token, patientId]);

  const selectPatient = (user) => {
    dispatch(SetPatient(user));
    localStorage.removeItem("customerId");
  };

  return (
    <MDBView
      cascade
      className="gradient-card-header blue-gradient narrower py-2 mx-4 mb-3 d-flex justify-content-between align-items-center"
    >
      <span className="mb-0">
        {_id ? fullName(fullname) : "Tracker"} | &nbsp;
        {_id && getAge(dob)}
      </span>
      {!patientId && <SearchUser setPatient={selectPatient} />}
    </MDBView>
  );
}
