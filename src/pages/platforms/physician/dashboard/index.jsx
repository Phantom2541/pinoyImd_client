import { useDispatch, useSelector } from "react-redux";
import NotRegister from "./notRegister";
import { useEffect } from "react";
import { GET_CLINIC } from "../../../../services/redux/slices/diagnostics/clinic/clinicInfo";
import Schedules from "./schedules";

const Dashboard = () => {
  const { token, auth, activePlatform } = useSelector(({ auth }) => auth);
  const { clinic } = useSelector(({ clinicInfo }) => clinicInfo);
  const dispatch = useDispatch();

  useEffect(() => {
    dispatch(
      GET_CLINIC({
        token,
        params: { _id: auth?._id, branchId: activePlatform?.branchId },
      })
    );
  }, [token, auth, activePlatform, dispatch]);

  if (!clinic?._id) {
    return <NotRegister />;
  }
  return <Schedules />;
};

export default Dashboard;
