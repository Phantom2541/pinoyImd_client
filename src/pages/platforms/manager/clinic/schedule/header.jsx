import React, { useEffect } from "react";
import { useDispatch, useSelector } from "react-redux";
import { MDBView } from "mdbreact";
// import { Select } from "../../../../../components/customizable";
import Search from "../../../../../components/searchables/users";
import {
  BROWSE,
  SetFILTER,
} from "../../../../../services/redux/slices/clinical/clinic";

const Header = () => {
  const { tokens, activePlatform } = useSelector(({ auth }) => auth);
  const { collections } = useSelector(({ clinic }) => clinic),
    dispatch = useDispatch();

  useEffect(() => {
    if (tokens)
      dispatch(BROWSE({ tokens, key: { branchId: activePlatform?.branchId } }));
  }, [dispatch, tokens, activePlatform]);

  return (
    <MDBView
      cascade
      className="gradient-card-header custom-header blue-gradient narrower py-2 mx-4 mb-3 d-flex justify-content-between align-items-center"
    >
      <div className="d-flex justify-items-center" style={{ width: "20rem" }}>
        <span className="white-text mx-3 text-nowrap mt-0">
          {collections.length} clinic
        </span>
      </div>
      <div>
        <div className="text-right d-flex items-center">
          <Search
            collections={collections}
            setFiltered={(items) => dispatch(SetFILTER(items))}
            placeholder="Search"
            reset={() => dispatch(SetFILTER(collections))}
            hideButton={false}
          />
        </div>
      </div>
    </MDBView>
  );
};

export default Header;
