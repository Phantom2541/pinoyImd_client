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
import PE from "./clinic/pe";
import MC from "./clinic/mc";

const Blank = () => {
  const {form} = useSelector(({validator}) => validator.task);
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
   PE,
   MC,
};

export default function BodySwitcher() {
  const { task } = useSelector(({ validator }) => validator);
  
  const Component = componentMap[task.form] || Blank;
  return <Component  />;
}
