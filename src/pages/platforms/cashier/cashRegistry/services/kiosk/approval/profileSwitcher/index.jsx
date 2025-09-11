import { useSelector } from "react-redux";
import Patient from "./patient";
import Request from "./request";
const ProfileSwitcher = () => {
  const NotFound = () => "";

  const {
    isAuthorization = false,
    selected,
    isSendOut = false,
  } = useSelector(({ kiosk }) => kiosk);
  const { isWalkin = false } = selected;

  const Component = !isWalkin ? (!isSendOut ? Request : Patient) : NotFound;

  return <Component />;
};

export default ProfileSwitcher;
