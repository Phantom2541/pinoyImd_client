import Xray from "./xray";
import Ecg from "./ecg";
import Ultrasound from "./ultrasound";
import TwoDEcho from "./twodecho";

const Blank = ({ task }) => <div>{task?.form} is not working</div>;

const componentMap = {
  xray: Xray,
  ecg: Ecg,
  ultrasound: Ultrasound,
  twodecho: TwoDEcho,
};

export default function BodySwitcher({ task }) {
  const Component = componentMap[task?.form?.toLowerCase()] || Blank;
  return (
    <div>
      <Component task={task} />
    </div>
  );
}
