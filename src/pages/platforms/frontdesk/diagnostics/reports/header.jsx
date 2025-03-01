import React from "react";
import { fullName, getAge } from "../../../../../services/utilities";
import { SearchUser } from "../../../../../components/searchables";

export default function Header({ patient, selectPatient }) {
  const { _id, dob, fullName: fullname } = patient;
  const onRegister = (key) => console.log("key", key);

  return (
    <div className="d-flex align-items-center justify-content-between">
      <h3 className="mb-0">
        {_id ? fullName(fullname) : "Tracker"}
        {_id && getAge(dob)}
      </h3>
      <SearchUser setPatient={selectPatient} onRegister={onRegister} />
    </div>
  );
}
