import React from "react";
import {
  MDBContainer,
  MDBRow,
  MDBCol,
  MDBCard,
  MDBCardBody,
  MDBCardHeader,
  MDBIcon,
  MDBProgress,
  MDBBtn,
  MDBTable,
} from "mdbreact";
import { Sales, OutSource, InSource, Utilities } from "./wigets";
import Transactions from "./transactions";
import { OutSources, InSources } from "./sources";
import { Expenses, Purchases } from "./calendars";
import Vouchers from "../accrued/vouchers";

export default function Dashboard() {
  return (
    <MDBContainer fluid id="v6" className="mb-5">
      <section className="mb-4">
        <MDBRow>
          <Sales />
          <OutSource />
          <InSource />
          <Utilities />
        </MDBRow>
      </section>
      <section className="mb-5">
        <Transactions />
      </section>
      <section>
        <MDBRow>
          <OutSources />
          <InSources />
        </MDBRow>
      </section>
      <section className="mt-2">
        <MDBRow>
          <Expenses />
          <Sales />
          <Purchases />
          <Vouchers />
        </MDBRow>
      </section>
      <section>
        <MDBRow>
          <MDBCol xl="5" md="12">
            <MDBCard className="mb-4">
              <MDBRow>
                <MDBCol md="12" className="text-center">
                  <h5 className="mt-4 mb-4 font-weight-bold">Monthly Sales</h5>
                </MDBCol>
              </MDBRow>
              <MDBCardBody>
                <MDBProgress
                  className="mb-2 mt-1"
                  value={25}
                  barClassName="warning-color"
                />
                <p className="font-small grey-text mb-4">January</p>
                <MDBProgress
                  className="mb-2"
                  value={35}
                  barClassName="red accent-2"
                />
                <p className="font-small grey-text mb-4">Febuary</p>
                <MDBProgress
                  className="mb-2"
                  value={85}
                  barClassName="primary-color"
                />
                <p className="font-small grey-text mb-4">Febuary</p>
                <MDBProgress
                  className="mb-2"
                  value={70}
                  barClassName="light-blue lighten-1"
                />
                <p className="font-small grey-text mb-4">Febuary</p>
              </MDBCardBody>
            </MDBCard>
          </MDBCol>
          <MDBCol xl="3" md="6" className="mb-2">
            <MDBCard>
              <MDBRow className="mt-4 mb-3">
                <MDBCol md="3" col="3" className="text-left pl-4">
                  <a className="p-2 m-2 fa-lg fb-ic" href="!#">
                    <MDBIcon
                      fab
                      icon="facebook"
                      size="2x"
                      className="blue-text"
                    />
                  </a>
                </MDBCol>
                <MDBCol md="9" col="9" className="text-right pr-5">
                  <p className="font-small grey-text mb-1">Facebook Users</p>
                  <h5 className="ml-4 mb-2 font-weight-bold">4,567 </h5>
                </MDBCol>
              </MDBRow>
            </MDBCard>

            <MDBCard className="mt-4">
              <MDBRow className="mt-4 mb-3">
                <MDBCol md="3" col="3" className="text-left pl-4">
                  <a className="p-2 m-2 fa-lg fb-ic" href="!#">
                    <MDBIcon
                      fab
                      icon="google-plus"
                      size="2x"
                      className="red-text"
                    />
                  </a>
                </MDBCol>
                <MDBCol md="9" col="9" className="text-right pr-5">
                  <p className="font-small grey-text mb-1">Google+ Users</p>
                  <h5 className="ml-4 mb-2 font-weight-bold">2,669 </h5>
                </MDBCol>
              </MDBRow>
            </MDBCard>

            <MDBCard className="mt-4 mb-4">
              <MDBRow className="mt-4 mb-3">
                <MDBCol md="3" col="3" className="text-left pl-4">
                  <a className="p-2 m-2 fa-lg fb-ic" href="!#">
                    <MDBIcon
                      fab
                      icon="facebook"
                      size="2x"
                      className="cyan-text"
                    />
                  </a>
                </MDBCol>
                <MDBCol md="9" col="9" className="text-right pr-5">
                  <p className="font-small grey-text mb-1">Twitter Users</p>
                  <h5 className="ml-4 mb-2 font-weight-bold">3,562 </h5>
                </MDBCol>
              </MDBRow>
            </MDBCard>
          </MDBCol>

          <MDBCol xl="4" md="6" className="mb-2">
            <MDBCard className="mb-4">
              <MDBCardBody>
                <MDBTable responsive>
                  <thead>
                    <tr>
                      <th className="font-weight-bold dark-grey-text">
                        <strong>Month</strong>
                      </th>
                      <th className="font-weight-bold dark-grey-text">
                        <strong>Visits</strong>
                      </th>
                      <th className="font-weight-bold dark-grey-text">
                        <strong>Sales</strong>
                      </th>
                    </tr>
                  </thead>
                  <tbody>
                    <tr>
                      <td>January</td>
                      <td>15</td>
                      <td>307</td>
                    </tr>
                    <tr>
                      <td>Febuary</td>
                      <td>32</td>
                      <td>504</td>
                    </tr>
                    <tr>
                      <td>March</td>
                      <td>41</td>
                      <td>613</td>
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
        </MDBRow>
      </section>
    </MDBContainer>
  );
}
