import React from "react";

import { MDBTable, MDBCard, MDBCardBody, MDBCol, MDBBtn } from "mdbreact";

const OutSources = () => {
  return (
    <MDBCol lg="4" md="12">
      <MDBCard className="mb-4">
        <MDBCardBody>
          <MDBTable responsive>
            <thead>
              <tr>
                <th className="font-weight-bold dark-grey-text">
                  <strong>Keywords</strong>
                </th>
                <th className="font-weight-bold dark-grey-text">
                  <strong>Visits</strong>
                </th>
                <th className="font-weight-bold dark-grey-text">
                  <strong>Pages</strong>
                </th>
              </tr>
            </thead>
            <tbody>
              <tr>
                <td>Design</td>
                <td>15</td>
                <td>307</td>
              </tr>
              <tr>
                <td>Bootstrap</td>
                <td>32</td>
                <td>504</td>
              </tr>
              <tr>
                <td>MDBootstrap</td>
                <td>41</td>
                <td>613</td>
              </tr>
              <tr>
                <td>Frontend</td>
                <td>14</td>
                <td>208</td>
              </tr>
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
