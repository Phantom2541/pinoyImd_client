import { useEffect } from "react";
import { useDispatch, useSelector } from "react-redux";
import { MDBBtn, MDBIcon, MDBView } from "mdbreact";
import {
  BROWSE,
  SetFILTERED,
  SetSELECTED,
  TOGGLE_CLONE,
} from "../../../../../services/redux/slices/assets/branches";
import Search from "../../../../../components/searchables/search";
import { TOGGLE_IMPORT } from "../../../../../services/redux/slices/commerce/catalog/menus";

const Header = () => {
  const { activePlatform, token } = useSelector(({ auth }) => auth),
    { filtered, collections, isLoading } = useSelector(
      ({ branches }) => branches
    ),
    dispatch = useDispatch();

  //initial values
  useEffect(() => {
    if (token)
      dispatch(
        BROWSE({
          token,
          key: {
            companyId: activePlatform?.branch?.companyId._id,
            isHeadQuarter: true,
          },
        })
      );
  }, [dispatch, activePlatform?.branch?.companyId?._id, token]);

  return (
    <MDBView
      cascade
      className="gradient-card-header blue-gradient narrower py-2 mx-4 mb-3 d-flex justify-content-between align-items-center"
    >
      <div className="d-flex justify-items-center">
        <span className="white-text mx-3 text-nowrap mt-0">
          {filtered.length} Branches
        </span>
      </div>
      <div>
        <MDBBtn
          size="sm"
          color="light"
          className="fw-bold px-2"
          rounded
          disabled={isLoading}
          onClick={() => dispatch(TOGGLE_CLONE())}
        >
          <MDBIcon far icon="clone" className="mr-2" />
          Clone Menus & Services
        </MDBBtn>
        <MDBBtn
          size="sm"
          color="light"
          className="fw-bold px-2"
          rounded
          disabled={isLoading}
          onClick={() => dispatch(TOGGLE_IMPORT())}
        >
          <MDBIcon fas icon="file-import" className="mr-2" />
          Import Menus (Excel)
        </MDBBtn>
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
