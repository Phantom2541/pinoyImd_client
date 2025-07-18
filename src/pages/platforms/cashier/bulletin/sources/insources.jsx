import React, { useState, useEffect } from "react";

import { MDBTable, MDBCard, MDBCardBody, MDBCol, MDBBtn } from "mdbreact";
import { useSelector } from "react-redux";
import { axioKit } from "../../../../../services/utilities";

const Insources = () => {
  const [data, setData] = useState([]);

  const { activePlatform, auth, token } = useSelector(({ auth }) => auth);

  useEffect(() => {
    const today = new Date();
    const month = today.getMonth();
    const year = today.getFullYear();

    const queryCurrentMonth = {
      cashier: auth._id,
      branch: activePlatform.branchId,
      month: month + 1,
      year,
    };

    // const queryLastMonth = {
    //   cashier: auth._id,
    //   branch: activePlatform.branchId,
    //   month: month === 0 ? 11 : month,
    //   year: month === 0 ? year - 1 : year,
    // };

    // Fetch Current Month Sales
    axioKit
      .universal(
        `/commerce/pos/services/deals/groupSource`,
        token,
        queryCurrentMonth
      )
      .then((res) => {
        setData(res);
      })
      .catch((err) => console.log(err.message));
  }, [activePlatform, auth, token]);

  return (
    <MDBCol lg="8" md="12">
      <MDBCard className="mb-4">
        <MDBCardBody>
          <MDBTable>
            <thead>
              <tr>
                <th className="font-weight-bold dark-grey-text">
                  <strong>Insources</strong>
                </th>
                <th className="font-weight-bold dark-grey-text">
                  <strong>Clients</strong>
                </th>
                <th className="font-weight-bold dark-grey-text">
                  <strong>Amounts</strong>
                </th>
              </tr>
            </thead>
            <tbody>
              {data?.map((data, index) => (
                <tr key={index}>
                  <td>{data?.source}</td>
                  <td>{data?.totalPatients}</td>
                </tr>
              ))}
            </tbody>
          </MDBTable>
          <MDBBtn
            flat
            rounded
            className="grey lighten-3 float-right font-weight-bold dark-grey-text"
          >
            View full report
          </MDBBtn>
        </MDBCardBody>
      </MDBCard>
    </MDBCol>
  );
};

export default Insources;
