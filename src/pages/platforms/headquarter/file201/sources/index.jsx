import React, { useState, useEffect } from "react";
import { useDispatch, useSelector } from "react-redux";

import {
  BROWSE,
  RESET,
} from "../../../../../services/redux/slices/assets/persons/source";

import { MDBCard, MDBCardBody } from "mdbreact";
import CardTables from "./tables";

export default function Sources() {
  const [vendors, setVendors] = useState([]),
    { token, activePlatform } = useSelector(({ auth }) => auth),
    { collections } = useSelector(({ sources }) => sources),
    dispatch = useDispatch();

  //Initial Browse
  useEffect(() => {
    if ((token, activePlatform.branchId))
      dispatch(BROWSE({ token, vendors: activePlatform.branchId }));
    console.log(activePlatform.branchId);
    return () => dispatch(RESET());
  }, [token, dispatch, activePlatform.branchId]);

  //Set fetched data for mapping
  useEffect(() => {
    //console.log(collections);
    setVendors(collections);
  }, [collections]);

  return (
    <>
      <MDBCard narrow className="pb-3">
        <MDBCardBody>
          <CardTables vendors={vendors} />
        </MDBCardBody>
      </MDBCard>
    </>
  );
}
