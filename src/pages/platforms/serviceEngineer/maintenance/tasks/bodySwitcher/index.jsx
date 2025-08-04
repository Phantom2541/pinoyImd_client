import LIS from "./LIS";
import PMS from "./PMS";

const BodySwitcher = ({ active = "LIS" }) => {
  const componentMap = {
    LIS,
    PMS,
  };
  const Component = componentMap[active];
  return <Component />;
};

export default BodySwitcher;
