import React from "react";
import { useSelector } from "react-redux";
import {
  getAge,
  getDevelopment,
  getGenderIcon,
  fullName as nameFormatter,
} from "./../../../../../../services/utilities";

export default function Patient() {
  const { customerId } =
    useSelector(({ validator }) => validator.selected) || {};
  const { fullName = {}, isMale, dob } = customerId || {};
  return (
    <>
      {getGenderIcon(isMale)}
      {nameFormatter(fullName, true)} - {getAge(dob)} | {getDevelopment(dob)}
    </>
  );
}
