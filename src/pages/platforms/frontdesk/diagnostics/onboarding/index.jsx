import { useSelector } from "react-redux";
import { Onboard as Laboratory } from "../../../laboratory/diagnostics";
import { Onboard as Radiology } from "../../../radiology/diagnostics";

const Onboarding = () => {
  const { activePlatform } = useSelector(({ auth }) => auth);
  const { department = "" } = activePlatform;
  const isRadiology = ["radiology", "rad"].includes(department?.toLowerCase());
  return <>{isRadiology ? <Radiology /> : <Laboratory />}</>;
};

export default Onboarding;
