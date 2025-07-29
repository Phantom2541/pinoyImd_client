import { useSelector } from "react-redux";
import { Xray, Ecg, Ultrasound } from "./radiology";

const Blank = () => {
  const { form } = useSelector(({ validator }) => validator.task);
  return <div>{form} is not working</div>;
};

const componentMap = {
  Xray,
  Ecg,
  Ultrasound,
};

export default function BodySwitcher() {
  const { task } = useSelector(({ validator }) => validator);
  const Component = componentMap[task.form] || Blank;
  return <Component />;
}
