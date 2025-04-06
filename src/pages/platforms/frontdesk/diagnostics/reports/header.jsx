import React, { useEffect } from "react";
import { useDispatch, useSelector } from "react-redux";

import { TRACKER } from "../../../../../services/redux/slices/commerce/pos/services/deals";
import { fullName, getAge } from "../../../../../services/utilities";
import { SearchUser } from "../../../../../components/searchables";
import { MDBView } from "mdbreact";
export default function Header({ patient, setPatient }) {
  const { _id, dob, fullName: fullname } = patient,
    { token, activePlatform } = useSelector(({ auth }) => auth),
    dispatch = useDispatch();

  useEffect(() => {
    if (patient?._id && activePlatform?.branchId) {
      dispatch(
        TRACKER({
          token,
          key: {
            branchId: activePlatform?.branchId,
            customerId: patient._id,
          },
        })
      );
    }
  }, [patient, activePlatform, dispatch, token]);

  const selectPatient = (user) => {
    setPatient(user);
  };
  const onRegister = (key) => console.log("key", key);

  return (
    <MDBView
      cascade
      className="gradient-card-header blue-gradient narrower py-2 mx-4 mb-3 d-flex justify-content-between align-items-center"
    >
      <span className="mb-0">
        {_id ? fullName(fullname) : "Tracker"}
        {_id && getAge(dob)}
      </span>
      <SearchUser setPatient={selectPatient} onRegister={onRegister} />
    </MDBView>
  );
}
