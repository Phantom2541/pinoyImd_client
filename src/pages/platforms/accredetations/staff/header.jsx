import React, { useEffect } from "react";
import { useDispatch, useSelector } from "react-redux";
import { MDBView } from "mdbreact";
import { MDBBtn, MDBIcon } from "mdbreact";
import { EMPLOYEES } from "../../../../services/redux/slices/assets/persons/personnels";
import { employment } from "../../../../services/utilities";

const Header = () => {
  const { token, activePlatform} = useSelector(({ auth }) => auth);
  const { collections    } = useSelector(    ({ personnels }) => personnels  );
  const dispatch = useDispatch();
  const handlePrintOut = () =>{
    window.open(
      "/printout/staffs",
      "RequestForm",
      "top=100px,left=100px,width=1050px,height=750px"
    );
      localStorage.setItem("staffs", JSON.stringify(collections));
  }
// Or if it's from Redux or context
useEffect(() => {
  const abbr =[...employment.employed].map(({ abbr }) => abbr);  
    dispatch(EMPLOYEES({token, params: {branch: activePlatform?.branchId,abbr}}));
},[token, dispatch, activePlatform]);
  //initial values
return (
  <>
    <MDBView
      cascade
      className="gradient-card-header blue-gradient py-2 d-flex justify-content-between align-items-center"
    >
      <span className="ml-3 ">Personnels List</span>
      <MDBBtn
        size="sm"
        rounded
        color="info"
        onClick={() => handlePrintOut()}
        className="no-print"
      >
        <MDBIcon icon="print" />
      </MDBBtn>
    </MDBView>
  </>
);

};
export default Header;
