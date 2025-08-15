import { useSelector } from "react-redux";
import { Tasks as Laboratory } from "../../../laboratory/diagnostics";
import { Tasks as Radiology } from "../../../radiology/diagnostics";

const Tasks = () => {
  const { activePlatform } = useSelector(({ auth }) => auth);
  const { department = "" } = activePlatform;
  const isRadiology = ["radiology", "rad"].includes(department?.toLowerCase());
  return <>{isRadiology ? <Radiology /> : <Laboratory />}</>;
};

export default Tasks;
