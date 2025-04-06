import React from "react";
import {
  getAge,
  getDevelopment,
  getGenderIcon,
  fullName as nameFormatter,
} from "../../../../../../../services/utilities";

export default function Patient({ patient }) {
  const { fullName, isMale, dob } = patient;

  return (
    <>
      {getGenderIcon(isMale)}
      {nameFormatter(fullName, true)} - {getAge(dob)} | {getDevelopment(dob)}
    </>
  );
}
