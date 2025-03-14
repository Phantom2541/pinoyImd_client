import React from "react";
import { useSelector } from "react-redux";
import {
  getAge,
  getDevelopment,
  getGenderIcon,
  fullName as nameFormatter,
} from "./../../../../../../services/utilities";

export default function Patient() {
  const { deal } = useSelector(({ validator }) => validator);

  const { fullName = {}, isMale, dob } = deal.customerId;

  return (
    <>
      {getGenderIcon(isMale)}
      {nameFormatter(fullName, true)} - {getAge(dob)} | {getDevelopment(dob)}
    </>
  );
}
