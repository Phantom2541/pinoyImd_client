import React, { useEffect } from "react";
import { useDispatch, useSelector } from "react-redux";
import { MDBView } from "mdbreact";
import { Search } from "../../../../../components/searchables";
import {
  SetFILTERED,
  SetCREATE,
  BROWSE,
} from "../../../../../services/redux/slices/assets/persons/cardHolder";

const Header = () => {
  const dispatch = useDispatch();
  const { activePlatform, token } = useSelector(({ auth }) => auth);
  const { filtered, collections } = useSelector(({ cardHolder }) => cardHolder);

  useEffect(() => {
    if (token)
      dispatch(BROWSE({ token, key: { branchId: activePlatform?.branchId } }));
  }, [dispatch, activePlatform, token]);
  console.log("branchId", activePlatform);

  return (
    <>
      <MDBView
        cascade
        className="gradient-card-header custom-header blue-gradient narrower py-2 px-4 mb-3 d-flex justify-content-between align-items-center"
      >
        {/* TABS + LABEL */}
        <div className="d-flex align-items-center gap-4">
          {/* Label */}
          <div className="text-white ml-4">
            {filtered.length} Request Card Holder
          </div>
        </div>

        <div>
          {/* Search */}
          {/* <Search
            collections={collections}
            setFiltered={(items) => dispatch(SetFILTERED(items))}
            placeholder="Search..."
            haveAction={true}
            reset={() => dispatch(SetFILTERED(collections))}
            hideButton={true}
            handleAdd={(item) => dispatch(SetCREATE(item))}
          /> */}
        </div>
      </MDBView>
    </>
  );
};

export default Header;
