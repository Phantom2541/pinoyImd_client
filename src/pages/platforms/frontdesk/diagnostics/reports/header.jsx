import React, { useEffect } from "react";
import { useDispatch, useSelector } from "react-redux";

import { TRACKER } from "../../../../../services/redux/slices/commerce/sales";
import { fullName, getAge } from "../../../../../services/utilities";
import { SearchUser } from "../../../../../components/header";

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
    <div className="d-flex align-items-center justify-content-between">
      <h3 className="mb-0">
        {_id ? fullName(fullname) : "Tracker"}
        {_id && getAge(dob)}
      </h3>
      <SearchUser onSelect={selectPatient} onRegister={onRegister} />
    </div>
  );
}
