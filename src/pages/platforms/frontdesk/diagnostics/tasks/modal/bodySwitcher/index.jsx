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
import { Xray, ECG, Ultrasound } from "./radiology";
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
  ECG,
  Ultrasound,
  // Clinic
  PE,
  MC,
};

export default function BodySwitcher() {
  const { task } = useSelector(({ validator }) => validator);
  console.log("task", task);

  const Component = componentMap[task.form] || Blank;
  return <Component />;
}
