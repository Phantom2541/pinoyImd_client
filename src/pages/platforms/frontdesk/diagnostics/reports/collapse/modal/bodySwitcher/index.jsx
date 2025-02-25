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
import Pbs from "./laboratory/pbs";
import Electrolyte from "./laboratory/electrolyte";

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
  pbs: Pbs,
  electrolyte: Electrolyte,
};

export default function BodySwitcher({ task, setTask }) {
  const Component = componentMap[task.form?.toLowerCase()] || Blank;
  return <Component task={task} setTask={setTask} />;
}
