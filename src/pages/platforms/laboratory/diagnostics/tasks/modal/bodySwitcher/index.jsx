import { useSelector } from "react-redux";
import {
  Hematology,
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
import { PE, MC } from "./clinic";
import {
  Xray,
  Ecg,
  Ultrasound,
  TwoDEcho,
  CTscan,
  Fibroscan,
} from "./radiology";

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
  Pbs,
  PE,
  MC,
  Xray,
  Ecg,
  Ultrasound,
  TwoDEcho,
  CTscan,
  Fibroscan,
};

export default function BodySwitcher() {
  const { task } = useSelector(({ validator }) => validator);
  console.log("task", task);

  let Component = "";
  if (task.form === "2DEcho" || task.form === "2decho") {
    return <TwoDEcho />;
  }
  Component =
    componentMap[task?.form?.charAt(0).toUpperCase() + task?.form?.slice(1)] ||
    Blank;
  return <Component />;
}
