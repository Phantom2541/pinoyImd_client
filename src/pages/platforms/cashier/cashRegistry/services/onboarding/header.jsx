import { useEffect } from "react";
import { useDispatch, useSelector } from "react-redux";
import { MDBView } from "mdbreact";
// import { Select } from "../../../../../../components/customizable";
import { BROWSE } from "../../../../../../services/redux/slices/commerce/pos/services/onBoardings";
import { SetSTATUS } from "../../../../../../services/redux/slices/commerce/pos/services/onBoardings";

const Header = () => {
  const { token, activePlatform } = useSelector(({ auth }) => auth),
    { filtered } = useSelector(({ deals }) => deals),
    dispatch = useDispatch();

  useEffect(() => {
    dispatch(BROWSE({ token, key: { branchId: activePlatform?.branchId } }));
  }, [dispatch, token, activePlatform]);

  return (
    <MDBView
      cascade
      className="gradient-card-header blue-gradient narrower py-2 mx-4  d-flex justify-content-between align-items-center"
    >
      <div className="d-flex justify-items-center" style={{ width: "20rem" }}>
        <span className="white-text mx-3 text-nowrap mt-0">
          {filtered.length} Onboarding KIOSK Request
        </span>
      </div>
      <div className="d-flex align-items-center">
        <span className="mr-2">Status:</span>
        <select
          className="form-control"
          onChange={({ target }) => dispatch(SetSTATUS(target.value))}
        >
          <option value={"all"}>All</option>
          <option value={"pending"}>Pending</option>
          <option value={"done"}>Processed</option>
        </select>
      </div>
    </MDBView>
  );
};

export default Header;
