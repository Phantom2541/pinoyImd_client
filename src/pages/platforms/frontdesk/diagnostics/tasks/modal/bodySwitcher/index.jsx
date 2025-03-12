import React from "react";
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
import PE from "./clinic/pe";
import MC from "./clinic/mc";

const Blank = ({ task }) => {
  return <div>{task.form} is not working</div>;
};

const componentMap = {
  hematology: Hematology,
  urinalysis: Urinalysis,
  chemistry: Chemistry,
  drugtest: Drugtest,
  parasitology: Parasitology,
  coagulation: Coagulation,
  serology: Serology,
  miscellaneous: Miscellaneous,
  analysis: Analysis,
  bacteriology: Bacteriology,
  compatibility: Compatibility,
  electrolyte: Electrolyte,
  pbs: Pbs,
  pe: PE,
  mc: MC,
};

export default function BodySwitcher({ task, setTask }) {
  const Component = componentMap[task.form?.toLowerCase()] || Blank;
  return <Component task={task} setTask={setTask} />;
}
