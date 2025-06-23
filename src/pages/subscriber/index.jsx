import { useEffect } from "react";
import { useDispatch, useSelector } from "react-redux";
import { GET_DETAILS } from "../../services/redux/slices/assets/companies";

const Subscriber = ({ match }) => {
  const { details } = useSelector(({ companies }) => companies);
  const companyId = match.params.companyId;
  const dispatch = useDispatch();

  console.log("details", details);

  useEffect(() => {
    dispatch(GET_DETAILS({ key: { companyId } }));
  }, [dispatch, companyId]);
  return <div>{companyId}</div>;
};

export default Subscriber;
