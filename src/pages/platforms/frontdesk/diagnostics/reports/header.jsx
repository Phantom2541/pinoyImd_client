import React from "react";
import { fullName, getAge } from "../../../../../services/utilities";
import Search from "../../../../../components/header/picker/users/search";

export default function Header({
  patient,
  selectPatient,
}) {

  const { _id, dob, fullName: fullname } = patient;
  const onRegister = (key) => console.log('key',key);
  
  return (
    <div className="d-flex align-items-center justify-content-between">
      <h3 className="mb-0">
        {_id ? fullName(fullname) : "Tracker"}
        {_id && getAge(dob)}
      </h3>
      <Search onSelect={selectPatient} onRegister={onRegister} />
    </div>
  );
}
