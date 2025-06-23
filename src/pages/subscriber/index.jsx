import { useEffect } from "react";
import { useDispatch } from "react-redux";
import { GET_DETAILS } from "../../services/redux/slices/assets/companies";

const Subscriber = ({ match }) => {
  const companyId = match.params.companyId;
  const dispatch = useDispatch();

  useEffect(() => {
    dispatch(GET_DETAILS({ key: { companyId } }));
  }, [dispatch, companyId]);
  return <div>{companyId}</div>;
};

export default Subscriber;
