import { useSelector } from "react-redux";
import ID from "../../../../ID";

const ValidID = () => {
  const { selected } = useSelector(({ kiosk }) => kiosk);
  const { pid } = selected;
  return <ID cardType={"validID"} pid={pid} viewOnly />;
};

export default ValidID;
