import { useEffect } from "react";
import { useDispatch, useSelector } from "react-redux";
import { MDBView } from "mdbreact";
import {
  BROWSE,
  SetFILTERED,
  SetSELECTED,
} from "../../../../../services/redux/slices/assets/branches";
import Search from "../../../../../components/searchables/search";

const Header = () => {
  const { activePlatform, token } = useSelector(({ auth }) => auth),
    { filtered, collections } = useSelector(({ branches }) => branches),
    dispatch = useDispatch();

  //initial values
  useEffect(() => {
    if (token && activePlatform?.branchId)
      dispatch(
        BROWSE({
          token,
          key: { companyId: activePlatform?.branch?.companyId._id },
        })
      );
  }, [dispatch, activePlatform, token]);

  return (
    <MDBView
      cascade
      className="gradient-card-header blue-gradient narrower py-2 mx-4 mb-3 d-flex justify-content-between align-items-center"
    >
      <div className="d-flex justify-items-center" style={{ width: "20rem" }}>
        <span className="white-text mx-3 text-nowrap mt-0">
          {filtered.length} Branches
        </span>
      </div>
      <div>
        <Search
          handleAdd={(value) => dispatch(SetSELECTED({ name: value }))}
          haveAction
          collections={collections}
          setFiltered={(results) =>
            dispatch(SetFILTERED(results.length > 0 ? results : collections))
          }
          reset={() => dispatch(SetFILTERED(collections))}
        />
      </div>
    </MDBView>
  );
};

export default Header;
