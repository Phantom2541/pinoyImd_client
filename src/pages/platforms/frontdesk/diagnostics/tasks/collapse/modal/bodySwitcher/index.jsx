import React from "react";
import Hematology from "./laboratory/hematology";
import Urinalysis from "./laboratory/urinalysis";
import Chemistry from "./laboratory/chemistry";
import Drugtest from "./laboratory/drugtest";
import Parasitology from "./laboratory/parasitology";
import Coagulation from "./laboratory/coagulation";
import Serology from "./laboratory/serology";
import Miscellaneous from "./laboratory/miscellaneous";
import Analysis from "./laboratory/analysis";
import Bacteriology from "./laboratory/bacteriology";
import Compatibility from "./laboratory/compatibility";
import Electrolyte from "./laboratory/electrolyte";
import Pbs from "./laboratory/pbs";
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
  console.log("task", task);
  const Component = componentMap[task.form?.toLowerCase()] || Blank;
  return <Component task={task} setTask={setTask} />;
}
