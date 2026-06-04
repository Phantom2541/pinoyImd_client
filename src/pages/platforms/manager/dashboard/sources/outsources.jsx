import React, { useEffect, useState } from "react";
import { MDBTable, MDBCard, MDBCardBody, MDBCol, MDBBtn } from "mdbreact";
import { useSelector } from "react-redux";
import { axioKit, currency } from "../../../../../services/utilities";

const OutSources = () => {
  const [data, setData] = useState([]);
  const { activePlatform, token } = useSelector(({ auth }) => auth);

  useEffect(() => {
    if (!activePlatform?.branchId || !token) return;

    const today = new Date();
    const month = today.getMonth();
    const year = today.getFullYear();

    axioKit
      .universal(`/commerce/pos/services/deals/groupOutsource`, token, {
        branchId: activePlatform.branchId,
        month: month + 1,
        year,
      })
      .then((res = []) => setData(res))
      .catch((err) => console.log(err.message));
  }, [activePlatform, token]);

  return (
    <MDBCol lg="4" md="12">
      <MDBCard className="mb-4">
        <MDBCardBody>
          <MDBTable responsive>
            <thead>
              <tr>
                <th className="font-weight-bold dark-grey-text">
                  <strong>Outsource</strong>
                </th>
                <th className="font-weight-bold dark-grey-text">
                  <strong>Patients</strong>
                </th>
                <th className="font-weight-bold dark-grey-text">
                  <strong>Amounts</strong>
                </th>
              </tr>
            </thead>
            <tbody>
              {data?.map((item, index) => (
                <tr key={`${item?.source || "outsource"}-${index}`}>
                  <td>{item?.source}</td>
                  <td>{item?.totalPatients}</td>
                  <td>{currency.format(Number(item?.totalAmount || 0))}</td>
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

export default OutSources;
