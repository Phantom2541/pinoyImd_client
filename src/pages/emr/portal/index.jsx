import { useEffect } from "react";
import Topbar from "./topbar";
import Body from "./body";
import { useDispatch } from "react-redux";
import { BROWSE } from "../../../services/redux/slices/emr/portal";
import Footer from "./footer";
import "./style.css";

const Portal = ({ match }) => {
  const { dealId, companyId } = match.params,
    dispatch = useDispatch();

  useEffect(() => {
    dispatch(BROWSE({ key: { dealId } }));
  }, [dispatch, dealId]);
  return (
    <div className="portal-container bg-white">
      <Topbar companyId={companyId} />
      <div className="body-content">
        <Body />
      </div>
      <Footer />
    </div>
  );
};

export default Portal;
