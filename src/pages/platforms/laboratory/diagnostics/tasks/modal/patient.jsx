import React from "react";
// import { useSelector } from "react-redux";
import {
  getAge,
  getDevelopment,
  getGenderIcon,
  fullName as nameFormatter,
} from "./../../../../../../services/utilities";

export default function Patient({ patient }) {
  // const { customerId } =
  //   useSelector(({ validator }) => validator.selected) || {};
  const { fullName = {}, isMale, dob } = patient || {};
  return (
    <>
      {getGenderIcon(isMale)}
      {nameFormatter(fullName, true)} - {getAge(dob)} | {getDevelopment(dob)}
    </>
  );
}
