import React, { useEffect, useState } from "react";
import { useDispatch, useSelector } from "react-redux";
import { MDBView } from "mdbreact";
import { BROWSE, SetCREATE, SetFILTER  } from "../../../../../services/redux/slices/market/attendances"
import { Search } from "../../../../../components/searchables";

const Header = () => {
  const { collections } = useSelector(({ attendances }) => attendances);
  const { token, activePlatform } = useSelector(({ auth }) => auth),
  dispatch = useDispatch();

  useEffect(() => { dispatch(BROWSE({ token, params: { branchId: activePlatform.branchId } })); }
    , [token, dispatch, activePlatform]);
  
  
  return (
    <MDBView
      cascade
      className="gradient-card-header custom-header blue-gradient narrower py-2 mx-4 mb-3 d-flex justify-content-between align-items-center"
    >
      <div className="d-flex justify-items-center" style={{ width: "20rem" }}>
        <span className="white-text mx-3 text-nowrap mt-0">
          {collections.length} Attendances
        </span>
      </div>
      <div>
        <div className="text-right d-flex items-center">
          <Search
          collections={collections}
            setFiltered={(huh) => dispatch(SetFILTER(huh))}
            reset={()=>dispatch(SetFILTER(collections))}
          
          
          
          />
        </div>
      </div>
    </MDBView>
  );
};

export default Header;
