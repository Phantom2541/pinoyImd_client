import { useSelector } from "react-redux";
import Ultrasound from "./ultrasound";
import Ecg from "./ecg";
import Xray from "./xray";
import TwoDEcho from "./2decho";
import CTscan from "./ctscan";
import Fibroscan from "./fibroscan";

const Blank = () => {
  const { form } = useSelector(({ validator }) => validator.task);
  return <div>{form} is not working</div>;
};

const componentMap = {
  Xray,
  Ecg,
  Ultrasound,
  TwoDEcho,
  CTscan,
  Fibroscan,
};

export default function BodySwitcher() {
  const { task } = useSelector(({ validator }) => validator);
  const Component = componentMap[task.form] || Blank;
  return <Component />;
}
