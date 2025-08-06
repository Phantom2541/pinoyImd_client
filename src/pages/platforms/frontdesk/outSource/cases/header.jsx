import { useEffect } from "react";
import { useDispatch, useSelector } from "react-redux";
import { MDBView, MDBBtn } from "mdbreact";
import { Search } from "../../../../../components/searchables";
import {
  BROWSE,
  SetFILTERED,
  SetCREATE,
} from "../../../../../services/redux/slices/commerce/pos/services/cases";

export default function Header() {
  const dispatch = useDispatch();
  const { token, activePlatform } = useSelector(({ auth }) => auth);
  const { collections } = useSelector(({ cases }) => cases);

  useEffect(() => {
    if (token && activePlatform?.branchId) {
      dispatch(BROWSE({ token, params: { branchId: activePlatform.branchId } }));
    }
  }, [token, dispatch, activePlatform]);

  return (
    <MDBView
      cascade
      className="gradient-card-header blue-gradient py-3 px-4 mb-3"
      style={{ borderRadius: "0.3rem" }}
    >
      <div className="d-flex justify-content-between align-items-center flex-wrap">
        <h5 className="white-text m-0">{collections.length} Patient Cases</h5>
        <div className="d-flex align-items-center gap-2 mt-2 mt-md-0" style={{ minWidth: "300px" }}>
          <Search
            collections={collections}
            placeholder="Search patient cases..."
            setFiltered={(items) => dispatch(SetFILTERED(items))}
            reset={() => dispatch(SetFILTERED(collections))}
            hideButton={true}
          />

        </div>
      </div>
    </MDBView>
  );
}
