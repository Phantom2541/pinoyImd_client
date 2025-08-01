import { MDBView } from "mdbreact";
import { useEffect } from "react";
import { Policy } from "../../../../services/fakeDb";
import { useDispatch, useSelector } from "react-redux";
import { BOARD_MEMBERS } from "../../../../services/redux/slices/assets/persons/personnels";
import {
  BROWSE,
  TOGGLE,
} from "../../../../services/redux/slices/finance/bookkeeping/duties";

const Header = () => {
  const { activePlatform, token } = useSelector(({ auth }) => auth),
    { collections = [], showModal = false } = useSelector(
      ({ duties }) => duties
    ),
    dispatch = useDispatch();

  useEffect(() => {
    const designations = Policy.getDesignationIDS(activePlatform.department);
    dispatch(
      BOARD_MEMBERS({
        token,
        params: { branchId: activePlatform?.branchId, designations },
      })
    );
  }, [activePlatform, token]);

  useEffect(() => {
    dispatch(
      BROWSE({
        token,
        params: { branchId: activePlatform?.branchId },
      })
    );
  }, [activePlatform, token]);

  useEffect(() => {
    if (collections.length === 0 && !showModal) {
      dispatch(TOGGLE());
    }
  }, [collections, dispatch, showModal]);
  return (
    <MDBView
      cascade
      className="gradient-card-header custom-header blue-gradient narrower py-3 mx-4 d-flex justify-content-between align-items-center"
    >
      <i>Schedules</i>
    </MDBView>
  );
};

export default Header;
