import { useEffect } from "react";
import { useDispatch, useSelector } from "react-redux";
import { MDBView } from "mdbreact";
import {
  BROWSE,
  RESET,
} from "../../../../../services/redux/slices/assets/persons/physicians";

const Header = () => {
  const { token, activePlatform } = useSelector(({ auth }) => auth),
    { collections, isSucscess } = useSelector(({ physicians }) => physicians),
    dispatch = useDispatch();

  useEffect(() => {
    if (token && activePlatform?.branchId)
      dispatch(BROWSE({ key: { branchId: activePlatform?.branchId }, token }));

    return () => dispatch(RESET());
  }, [token, activePlatform, isSucscess, dispatch]);

  //initial values

  return (
    <MDBView
      cascade
      className="gradient-card-header blue-gradient narrower py-2 mx-4 mb-3 d-flex justify-content-between align-items-center"
    >
      <div className="d-flex justify-items-center" style={{ width: "20rem" }}>
        <span className="white-text mx-3 text-nowrap mt-0">
          {collections.length} Staffs
        </span>
      </div>
      <div>
        <div className="text-right d-flex items-center"></div>
      </div>
    </MDBView>
  );
};

export default Header;
