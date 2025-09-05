import React, { useEffect } from "react";
import { useDispatch, useSelector } from "react-redux";
import { MDBView } from "mdbreact";
import {
  TIEUPS,
  SetFILTERED,
  SetCREATE,
  RESET,
} from "../../../../../services/redux/slices/assets/persons/physicians";
import { Search } from "../../../../../components/searchables";
import { CTBROWSE } from "../../../../../services/redux/slices/assets/branches";

const Header = () => {
  const { activePlatform, token } = useSelector(({ auth }) => auth),
    { collections, isSucscess } = useSelector(({ physicians }) => physicians),
    dispatch = useDispatch(); //
  const handleAdd = (item) => dispatch(SetCREATE(item));
  console.log("colhead", collections);

  //Initial Browse
  useEffect(() => {
    if (token && activePlatform?.branchId)
      dispatch(TIEUPS({ key: { branch: activePlatform?.branchId }, token }));
    dispatch(CTBROWSE({ token, data: { _id: activePlatform.branchId } }));

    return () => dispatch(RESET());
  }, [token, activePlatform, isSucscess, dispatch]);

  return (
    <MDBView
      cascade
      className="gradient-card-header custom-header blue-gradient narrower py-2 mx-4 mb-3 d-flex justify-content-between align-items-center"
    >
      <div className="d-flex justify-items-center" style={{ width: "20rem" }}>
        <span className="white-text mx-3 text-nowrap mt-0">
          {collections.length} Attending Physicians
        </span>
      </div>
      <div>
        <div>
          <Search
            collections={collections}
            setFiltered={(items) => dispatch(SetFILTERED(items))}
            placeholder="Search physicains"
            haveAction={true}
            reset={() => dispatch(SetFILTERED(collections))}
            hideButton={true}
            handleAdd={(item) => handleAdd(item)}
          />
        </div>
      </div>
    </MDBView>
  );
};

export default Header;
