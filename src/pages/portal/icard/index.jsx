import { useEffect } from "react";
import { useDispatch, useSelector } from "react-redux";
import { BROWSE } from "../../../services/redux/slices/portal/icard";

const ICard = ({ match = {} }) => {
  const { personnelId = "", companyId = "" } = match?.params || {},
    { info, branch } = useSelector(({ icard }) => icard),
    dispatch = useDispatch();
  console.log("info", info);
  console.log("branch", branch);
  useEffect(() => {
    localStorage.setItem("companyId", companyId);
    dispatch(BROWSE({ key: { _id: personnelId } }));
  }, [dispatch, personnelId]);

  return <div>Icard viewing yehey</div>;
};

export default ICard;
