import React, { useState, useEffect } from "react";
import { useDispatch, useSelector } from "react-redux";
import { MDBView } from "mdbreact";
import {
  SetCREATE,
  SetFILTERED,
  BROWSE,
} from "../../../../../services/redux/slices/commerce/pos/services/admission";
import { Search } from "../../../../../components/searchables";

const Header = () => {
  const { token, activePlatform } = useSelector(({ auth }) => auth),
    { collections } = useSelector(({ admission }) => admission),
    dispatch = useDispatch();
  const handleAdd = (item) => dispatch(SetCREATE(item));
  //initial values
  useEffect(() => {
    if (token) {
      dispatch(BROWSE({ token, key: { branchId: activePlatform.branchId } }));
    }
  }, [dispatch, token, activePlatform]);

  return (
    <MDBView
      cascade
      className="gradient-card-header blue-gradient narrower py-2 mx-4 mb-3 d-flex justify-content-between align-items-center"
    >
      <div className="d-flex justify-items-center" style={{ width: "20rem" }}>
        <span className="white-text mx-3 text-nowrap mt-0">
          {collections.length} Admission Form
        </span>
      </div>
      <div>
        <div className="text-right d-flex items-center">
          <Search
            collections={collections}
            setFiltered={(items) => dispatch(SetFILTERED(items))}
            placeholder="Search collections "
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
