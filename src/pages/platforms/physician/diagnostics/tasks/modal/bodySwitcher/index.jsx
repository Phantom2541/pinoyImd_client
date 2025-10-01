import React from "react";
import { useSelector } from "react-redux";
import {
  Hematology,
  Electrolyte,
  Urinalysis,
  Compatibility,
  Chemistry,
  Bacteriology,
  Drugtest,
  Analysis,
  Parasitology,
  Serology,
  Coagulation,
  Miscellaneous,
  Pbs,
} from "./laboratory";
import { Xray, Ecg, Ultrasound, Echo } from "./radiology";
import { PE, MC } from "./clinic";

const Blank = () => {
  const { form } = useSelector(({ validator }) => validator.task);
  return <div>{form} is not working</div>;
};

const componentMap = {
  Hematology,
  Urinalysis,
  Chemistry,
  Drugtest,
  Parasitology,
  Coagulation,
  Serology,
  Miscellaneous,
  Analysis,
  Bacteriology,
  Compatibility,
  Electrolyte,
  Pbs,
  //Radiology
  Xray,
  Ecg,
  Ultrasound,
  "2DEcho": Echo,
  // Clinic
  PE,
  MC,
};

export default function BodySwitcher() {
  const { task } = useSelector(({ validator }) => validator);
  const Component = componentMap[task.form] || Blank;
  return <Component />;
}
