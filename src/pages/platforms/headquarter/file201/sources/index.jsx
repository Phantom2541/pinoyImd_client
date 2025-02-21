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
    { token, onDuty } = useSelector(({ auth }) => auth),
    { collections } = useSelector(({ sources }) => sources),
    dispatch = useDispatch();

  //Initial Browse
  useEffect(() => {
    if ((token, onDuty._id)) dispatch(BROWSE({ token, vendors: onDuty._id }));
    console.log(onDuty._id);
    return () => dispatch(RESET());
  }, [token, dispatch, onDuty._id]);

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
