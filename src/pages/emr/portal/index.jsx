import { useEffect, useState } from "react";
import Topbar from "./topbar";
import Body from "./body";
import { useDispatch, useSelector } from "react-redux";
import { BROWSE } from "../../../services/redux/slices/emr/portal";
import Footer from "./footer";
import "./style.css";
import Login from "../../home/login";
import { SetAUTH } from "../../../services/redux/slices/assets/persons/auth";

const Portal = ({ match }) => {
  const { dealId, companyId } = match.params,
    { result } = useSelector(({ portal }) => portal),
    [show, setShow] = useState(false),
    dispatch = useDispatch();
  useEffect(() => {
    localStorage.setItem("companyId", companyId);
    dispatch(BROWSE({ key: { dealId } }));
  }, [dispatch, dealId, companyId]);

  useEffect(() => {
    if (result._id) {
      dispatch(SetAUTH(result.customerId));
      setShow(true);
    }
  }, [dispatch, result]);
  return (
    <div className="portal-container bg-white">
      <Topbar companyId={companyId} />
      <div className="body-content">
        <Body />
      </div>
      <Footer />
      <Login show={show} toggle={() => setShow(!show)} isEMR />
    </div>
  );
};

export default Portal;
