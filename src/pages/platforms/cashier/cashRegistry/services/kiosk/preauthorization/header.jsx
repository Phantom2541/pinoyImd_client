import { useEffect } from "react";
import { useDispatch, useSelector } from "react-redux";
import { MDBView } from "mdbreact";
import {
  BROWSE,
  SetFILTERED,
} from "../../../../../../../services/redux/slices/commerce/pos/services/onBoardings";
import { Search } from "../../../../../../../components/searchables";

const Header = ({ toggle = () => {} }) => {
  const { token, activePlatform } = useSelector(({ auth }) => auth),
    { filtered, collections } = useSelector(({ onBoardings }) => onBoardings),
    dispatch = useDispatch();

  useEffect(() => {
    dispatch(
      BROWSE({
        token,
        key: { branchId: activePlatform?.branchId, status: ["draft"] },
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
          {filtered.length} Onboarding KIOSK Request
        </span>
      </div>
      <div>
        <Search
          handleAdd={toggle}
          collections={collections}
          setFiltered={(results) => dispatch(SetFILTERED(results))}
          reset={() => dispatch(SetFILTERED(collections))}
        />
      </div>
    </MDBView>
  );
};

export default Header;
