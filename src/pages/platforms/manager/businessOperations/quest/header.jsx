import React, { useState, useEffect } from "react";
import { useDispatch, useSelector } from "react-redux";
import { MDBView } from "mdbreact";
import { BROWSE, SetFILTER, SetCREATE } from "../../../../../services/redux/slices/diagnostics/clinician/quest";
import { Search } from "../../../../../components/searchables";
  const Header = () => {
  const { token, activePlatform } = useSelector(({ auth }) => auth);
  const { collections } = useSelector(({ quest }) => quest),
    dispatch = useDispatch();

  //initial values

  useEffect(() => {
    if (token){
      dispatch(
        BROWSE({ token, params: { branchId: activePlatform?.branchId } })
      );
    }
  }, [dispatch, token]);
  



    const handleAdd = () => 
  {
  dispatch(SetCREATE());
  }
    
  
  
    return (
    <MDBView
      cascade
      className="gradient-card-header custom-header blue-gradient narrower py-2 mx-4 mb-3 d-flex justify-content-between align-items-center"
    >
      <div className="d-flex justify-items-center" style={{ width: "20rem" }}>
        <span className="white-text mx-3 text-nowrap mt-0">
          {collections?.length} Services
        </span>
      </div>
      <div>
        <div className="text-right d-flex items-center">
          <Search
            collections={collections}
            hideButton={false}
            setFiltered={(items) => dispatch(SetFILTER(items))}
            placeholder="Search quest"
            haveAction={true}
            handleAdd={(item) => handleAdd(item)}
            reset={() => dispatch(SetFILTER( collections))}
          />
        </div>
      </div>
    </MDBView>
  );
};

export default Header;