import React, { useEffect } from "react";
import { useDispatch, useSelector } from "react-redux";

import {
  TRACKER,
  SetPatient,
} from "../../../../../services/redux/slices/commerce/pos/services/deals";
import { fullName, getAge } from "../../../../../services/utilities";
import { MDBView } from "mdbreact";
export default function Header() {
  const { token, auth } = useSelector(({ auth }) => auth),
    {
      _id,
      dob,
      fullName: fullname,
    } = useSelector(({ deals }) => deals.patient),
    dispatch = useDispatch();

  useEffect(() => {
    if (auth._id) {
      dispatch(SetPatient(auth));
      dispatch(
        TRACKER({
          token,
          key: {
            customerId: auth._id,
            department: "LAB",
          },
        })
      );
    }
  }, [auth, dispatch, token]);

  return (
    <MDBView
      cascade
      className="gradient-card-header blue-gradient narrower py-2 mx-4 mb-3 d-flex justify-content-between align-items-center"
    >
      <span className="mb-0">
        {_id ? fullName(fullname) : "Tracker"} | &nbsp;
        {_id && getAge(dob)}
      </span>
    </MDBView>
  );
}
