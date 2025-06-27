import React, { useEffect, useState } from "react";
import { useDispatch, useSelector } from "react-redux";
import { MDBView, MDBBtn, MDBIcon } from "mdbreact";
import { BROWSE } from "../../../../services/redux/slices/market/machines";


const Header = () => {
    const { token, activePlatform } = useSelector(({ auth }) => auth);
    const { collections } = useSelector(({ machines }) => machines), 
        dispatch = useDispatch();

  const handlePrint = () => {
    window.open(
      "/printout/machines",
      "RequestForm",
      "top=100px,left=100px,width=1050px,height=750px"
    );
  }  

  
    console.log("SHOWING COLLECTIONS: ", collections);

    useEffect(() => {
        dispatch(BROWSE({ token, params: { branchId: activePlatform?.branchId } }));
        
    }, [dispatch, token, activePlatform]);
    
  return (
    <MDBView
      cascade
      className="gradient-card-header custom-header blue-gradient narrower py-2 mx-4 mb-3 d-flex justify-content-between align-items-center"
    >
      <div className="d-flex justify-items-center" style={{ width: "20rem" }}>
        <span className="white-text mx-3 text-nowrap mt-0">
          {collections.length} Machines 
        </span>
      </div>
      <div>
        <div className="text-right d-flex items-center">
          <MDBBtn color="success" size="sm" onClick={handlePrint} style={{ borderRadius: "20px" }}>
          <MDBIcon icon="print" className="mr-1" />
            PRINT</MDBBtn>
        </div>
      </div>
    </MDBView>
  );
};

export default Header;
