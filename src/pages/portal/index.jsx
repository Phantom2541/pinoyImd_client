import { useEffect } from "react";
import Header from "./header";
import Body from "./body";
import { useDispatch } from "react-redux";
import { BROWSE } from "../../services/redux/slices/portal/results";
const Portal = ({ match }) => {
  const dealId = match.params.dealId,
    dispatch = useDispatch();

  useEffect(() => {
    dispatch(BROWSE({ key: { dealId } }));
  }, [dispatch]);
  return (
    <div className="bg-white vh-100">
      <Header />
      <Body />
    </div>
  );
};

export default Portal;
