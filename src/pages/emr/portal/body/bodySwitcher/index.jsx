import Laboratory from "./laboratory";
import Radiology from "./radiology";

const departments = {
  LAB: Laboratory,
  RAD: Radiology,
};
const Blank = ({ task }) => <div>{task?.form} is not working</div>;

const BodySwitcher = ({ task, department }) => {
  const Component = departments[department] || Blank;
  return <Component task={task} />;
};

export default BodySwitcher;
