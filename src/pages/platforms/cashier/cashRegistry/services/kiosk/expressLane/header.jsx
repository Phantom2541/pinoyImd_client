import { useEffect } from "react";
import { useDispatch, useSelector } from "react-redux";
import { MDBView } from "mdbreact";
import { BROWSE } from "../../../../../../../services/redux/slices/commerce/pos/services/onBoardings";
import { Search } from "../../../../../../../components/searchables";

const Header = () => {
  const { token, activePlatform } = useSelector(({ auth }) => auth),
    { filtered } = useSelector(({ onBoardings }) => onBoardings),
    dispatch = useDispatch();

  useEffect(() => {
    dispatch(
      BROWSE({
        token,
        key: { branchId: activePlatform?.branchId, status: ["approved"] },
      })
    );
  }, [dispatch, token, activePlatform]);

  return (
    <MDBView
      cascade
      className="gradient-card-header blue-gradient narrower py-2 mx-4  d-flex justify-content-between align-items-center"
    >
      <div className="d-flex justify-items-center" style={{ width: "20rem" }}>
        <span className="white-text mx-3 text-nowrap mt-0">
          {filtered.length} Express Charged
        </span>
      </div>
      <Search haveAction={false} />
    </MDBView>
  );
};

export default Header;
