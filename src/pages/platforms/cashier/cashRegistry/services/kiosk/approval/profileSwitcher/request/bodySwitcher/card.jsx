import { useSelector } from "react-redux";
import ID from "../../../../ID";

const Card = () => {
  const { selected } = useSelector(({ kiosk }) => kiosk);
  const { pid } = selected;
  return <ID cardType={"healthCard"} pid={pid} viewOnly />;
};

export default Card;
