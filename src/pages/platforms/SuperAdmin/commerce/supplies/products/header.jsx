import { useEffect } from "react";
import { useDispatch, useSelector } from "react-redux";
import { MDBView } from "mdbreact";
import { Search } from "../../../../../../components/searchables";
import {
  BROWSE,
  SetCREATE,
  SetFILTERED,
} from "../../../../../../services/redux/slices/commerce/pos/services/cases";

const Header = () => {
  const { token, activePlatform } = useSelector(({ auth }) => auth);
  const { collections } = useSelector(({ cases }) => cases);
  const dispatch = useDispatch();

  useEffect(() => {
    if (token) {
      dispatch(
        BROWSE({ token, params: { branchId: activePlatform.branchId } })
      );
    }
  }, [token, dispatch, activePlatform]);

  return (
    <MDBView
      cascade
      className="gradient-card-header custom-header blue-gradient narrower py-2 mb-3 d-flex justify-content-between align-items-center w-100 rounded-0"
    >
      {/* LEFT: Title */}
      <div className="d-flex align-items-center">
        <h5 className="white-text font-weight-bold mb-0 ml-3">
          {collections.length} Patient Cases
        </h5>
      </div>

      {/* RIGHT: Search + Add */}
      <div
        className="d-flex align-items-center mr-3"
        style={{ maxWidth: "500px", width: "100%" }}
      >
        <Search
          collections={collections}
          placeholder="Search patient, title, reason..."
          haveAction={true}
          hideButton={false}
          reset={() => dispatch(SetFILTERED(collections))}
          setFiltered={(items) => dispatch(SetFILTERED(items))}
          handleAdd={(item) => dispatch(SetCREATE({ displayname: item }))}
        />
      </div>
    </MDBView>
  );
};

export default Header;
