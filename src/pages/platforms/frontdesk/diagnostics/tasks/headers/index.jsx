import React, {  useEffect } from "react";
import { useDispatch, useSelector } from "react-redux";
import { fullName, getAge, getGenderIcon } from "../../../../../../services/utilities";
import {
    MDBView,MDBBtnGroup
  } from "mdbreact";
  import {
    TASKS,
    RESET,
  } from "../../../../../../services/redux/slices/commerce/sales";
  import {
    BROWSE,
    RESET as PREFRESET,
  } from "../../../../../../services/redux/slices/results/preferences";
  import {
    BROWSE as HEADS,
    RESET as HEADSRESET,
  } from "../../../../../../services/redux/slices/assets/persons/heads";

const Headers = ({    searchKey}) => {
    const { token, activePlatform } = useSelector(({ auth }) => auth),
     {  isLoading, collections } = useSelector(
          ({ sales }) => sales
        ),
        dispatch = useDispatch();

     //Initial Browse
      useEffect(() => {
        if (token && activePlatform?.branchId) {
          dispatch(
            TASKS({
              token,
              key: {
                branchId: activePlatform?.branchId,
                createdAt: new Date().setHours(0, 0, 0, 0),
              },
            })
          );
          dispatch(BROWSE({ token, branchId: activePlatform?.branchId }));
          dispatch(HEADS({ token, branchId: activePlatform?.branchId }));
        }
    
        return () => {
          dispatch(RESET());
          dispatch(PREFRESET());
          dispatch(HEADSRESET());
        };
      }, [token, dispatch, activePlatform]);  
      
  return (
    <MDBView
        cascade
        className="gradient-card-header blue-gradient narrower py-2 mx-4 mb-3 d-flex justify-content-between align-items-center"
      >

        <span className="white-text mx-3">
          {collections.length}&nbsp;
          {searchKey ? `Matches with ${searchKey}` : "Onboarding Tasks"}
        </span>
        <div className="text-right">
        <MDBBtnGroup className="mr-2">
  <select
    className="browser-default custom-select"
    onChange={(e) => {
      // const selectedClient = e.target.value;
      // Handle client selection logic here
    }}
    disabled={isLoading}
  >
    <option value="" disabled selected>
      Select Client
    </option>
    {collections.map(({customerId}, index) => (
      <option key={index} value={customerId.id}>
      {/* {getGenderIcon(customerId?.isMale)} Ensure this returns a valid icon */}
      {fullName(customerId.fullName)} |  
      {getAge(customerId?.dob)}
    </option>
    ))}
  </select>
</MDBBtnGroup>
        </div>
      </MDBView>
  );
};

export default Headers;
