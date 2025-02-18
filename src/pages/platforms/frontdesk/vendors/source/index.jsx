import React, { useEffect, useState } from "react";
import { useDispatch, useSelector } from "react-redux";
import {
  BROWSE,
  RESET,
} from "../../../../../services/redux/slices/assets/providers";
import {
  MDBContainer,
  MDBCard,
  MDBCardHeader,
  MDBCardBody,
  MDBTable,
  MDBTableBody,
  MDBTableHead,
} from "mdbreact";
import { fullAddress } from "../../../../../services/utilities";

export default function Source() {
  const [sources, setSources] = useState([]),
    { token, activePlatform } = useSelector(({ auth }) => auth),
    { collections } = useSelector(({ providers }) => providers),
    dispatch = useDispatch();

  useEffect(() => {
    if (token && activePlatform?.branchId) {
      dispatch(BROWSE({ token, vendors: activePlatform.branch }));
    }

    return () => {
      dispatch(RESET());
    };
  }, [token, dispatch, activePlatform]);

  useEffect(() => {
    setSources(collections);
  }, [collections]);
  console.log(collections);
  return (
    <MDBContainer>
      <MDBCard>
        <MDBCardHeader>Source</MDBCardHeader>
        <MDBCardBody>
          <MDBTable>
            <MDBTableHead>
              <tr>
                <th>#</th>
                <th>Name</th>
                <th>Address</th>
              </tr>
            </MDBTableHead>
            <MDBTableBody>
              {sources.map((source, index) => {
                return (
                  <tr>
                    <td>{index + 1}</td>
                    <td>
                      {source?.clients?.companyName}\{source?.clients?.name}
                    </td>
                    <td>{fullAddress(source?.clients?.address)}</td>
                  </tr>
                );
              })}
            </MDBTableBody>
          </MDBTable>
        </MDBCardBody>
      </MDBCard>
    </MDBContainer>
  );
}
