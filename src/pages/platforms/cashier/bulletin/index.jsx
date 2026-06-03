import { useEffect, useMemo, useState } from "react";
import { useDispatch, useSelector } from "react-redux";
import { axioKit } from "../../../../services/utilities";
import {
  BROWSE as BROWSE_REMITTANCES,
} from "../../../../services/redux/slices/finance/bookkeeping/remittances";
import {
  BROWSE as BROWSE_DEALS,
} from "../../../../services/redux/slices/commerce/pos/services/deals";
import {
  MDBContainer,
  MDBRow,
  MDBCol,
  MDBCard,
  MDBCardBody,
  MDBProgress,
  MDBBtn,
  MDBTable,
  MDBIcon,
} from "mdbreact";
import { Sales, OutSource, InSource, Utilities } from "./wigets";
import Transactions from "./transactions";
import { OutSources, InSources } from "./sources";
import { Expenses, Purchases } from "./calendars";
// import Vouchers from "../accrued/vouchers";

export default function Dashboard() {
  const [lastMonthSales, setLastMonthSales] = useState(0);
  const [currentVouchers, setCurrentVouchers] = useState(0);
  const [lastMonthVouchers, setLastMonthVouchers] = useState(0);
  const [currentMonthOutsources, setCurrentMonthOutsources] = useState(0);
  const [lastMonthOutsources, setLastMonthOutsources] = useState(0);

  const { activePlatform, auth, token } = useSelector(({ auth }) => auth),
    { collections: remittanceCollections = [] } = useSelector(
      ({ remittances }) => remittances
    ),
    { collections: dealCollections = [], lastBrowseKey: lastDealsBrowseKey } =
      useSelector(({ deals }) => deals),
    { lastBrowseKey: lastRemittancesBrowseKey } = useSelector(
      ({ remittances }) => remittances
    ),
    dispatch = useDispatch();

  const isSameLocalDay = (dateA, dateB) =>
    new Date(dateA).toDateString() === new Date(dateB).toDateString();

  const currentMonthSales = useMemo(() => {
    const today = new Date();

    const remittedMonthSales = remittanceCollections.reduce((total, item) => {
      const createdAt = item?.createdAt ? new Date(item.createdAt) : null;
      if (
        !createdAt ||
        item?.deletedAt ||
        createdAt.getFullYear() !== today.getFullYear() ||
        createdAt.getMonth() !== today.getMonth()
      ) {
        return total;
      }

      return total + Number(item?.sales || 0);
    }, 0);

    const todayLiveSales = dealCollections.reduce((total, item) => {
      if (item?.deletedAt || !item?.createdAt) return total;
      if (!isSameLocalDay(item.createdAt, today)) return total;

      return total + Number(item?.amount || 0);
    }, 0);

    const todayRemittedSales = remittanceCollections.reduce((total, item) => {
      if (item?.deletedAt || !item?.createdAt) return total;
      if (!isSameLocalDay(item.createdAt, today)) return total;

      return total + Number(item?.sales || 0);
    }, 0);

    return remittedMonthSales + Math.max(0, todayLiveSales - todayRemittedSales);
  }, [dealCollections, remittanceCollections]);

  useEffect(() => {
    if (!auth?._id || !activePlatform?.branchId || !token) return;

    const today = new Date();
    const month = today.getMonth();
    const year = today.getFullYear();
    const timezone = Intl.DateTimeFormat().resolvedOptions().timeZone;
    const monthStart = new Date(year, month, 1);
    const dayStart = new Date(year, month, today.getDate());
    const dayEnd = new Date(year, month, today.getDate(), 23, 59, 59, 999);
    const lastMonthStart = new Date(year, month - 1, 1);
    const lastMonthEnd = new Date(year, month, 0, 23, 59, 59, 999);

    const queryCurrentMonth = {
      cashier: auth._id,
      branch: activePlatform.branchId,
      month: month + 1,
      year,
    };

    const remittanceBrowseKey = {
      branch: activePlatform.branchId,
      cashier: auth._id,
      startDate: monthStart.toISOString(),
      endDate: dayEnd.toISOString(),
      timezone,
    };

    const dealsBrowseKey = {
      branchId: activePlatform.branchId,
      cashierId: auth._id,
      startDate: dayStart.toISOString(),
      endDate: dayEnd.toISOString(),
      timezone,
    };

    const queryLastMonth = {
      branch: activePlatform.branchId,
      cashier: auth._id,
      startDate: lastMonthStart.toISOString(),
      endDate: lastMonthEnd.toISOString(),
      timezone,
    };

    if (
      JSON.stringify(lastRemittancesBrowseKey) !==
      JSON.stringify(remittanceBrowseKey)
    ) {
      dispatch(
        BROWSE_REMITTANCES({
          token,
          key: remittanceBrowseKey,
        })
      );
    }

    if (JSON.stringify(lastDealsBrowseKey) !== JSON.stringify(dealsBrowseKey)) {
      dispatch(
        BROWSE_DEALS({
          token,
          key: dealsBrowseKey,
        })
      );
    }

    axioKit
      .universal(
        `finance/bookkeeping/remittances/widgets`,
        token,
        queryCurrentMonth
      )
      .then((res) => {
        setCurrentVouchers(res.current.totalVouchers || 0);
        setLastMonthVouchers(res.last.totalVouchers || 0);
      })
      .catch((err) => console.log(err.message));

    Promise.all([
      axioKit.universal(
        `finance/bookkeeping/remittances/browse`,
        token,
        queryLastMonth
      ),
      axioKit.universal(`commerce/pos/services/deals/browse`, token, {
        branchId: activePlatform.branchId,
        cashierId: auth._id,
        startDate: lastMonthStart.toISOString(),
        endDate: lastMonthEnd.toISOString(),
        timezone,
      }),
    ])
      .then(([lastMonthRemittances = [], lastMonthDeals = {}]) => {
        const remittedGross = lastMonthRemittances.reduce((total, item) => {
          if (item?.deletedAt) return total;
          return total + Number(item?.sales || 0);
        }, 0);

        const rawDeals = Array.isArray(lastMonthDeals?.payload)
          ? lastMonthDeals.payload
          : Array.isArray(lastMonthDeals)
          ? lastMonthDeals
          : [];

        const liveGross = rawDeals.reduce((total, item) => {
          if (item?.deletedAt) return total;
          return total + Number(item?.amount || 0);
        }, 0);

        setLastMonthSales(Math.max(remittedGross, liveGross));
      })
      .catch((err) => console.log(err.message));

    axioKit
      .universal(
        `commerce/pos/services/deals/widgets`,
        token,
        queryCurrentMonth
      )
      .then((res) => {
        setCurrentMonthOutsources(res.current.totalAmount || 0);
        setLastMonthOutsources(res.last.totalAmount || 0);
      })
      .catch((err) => console.log(err.message));
  }, [
    activePlatform,
    auth,
    dispatch,
    lastDealsBrowseKey,
    lastRemittancesBrowseKey,
    token,
  ]);

  return (
    <MDBContainer fluid id="v6" className="mb-5">
      <section className="mb-4">
        <MDBRow>
          <Sales
            currentMonthSales={currentMonthSales}
            lastMonthSales={lastMonthSales}
          />
          <InSource
            currentVouchers={currentVouchers}
            lastMonthVouchers={lastMonthVouchers}
          />
          <OutSource
            currentMonthOutsources={currentMonthOutsources}
            lastMonthOutsources={lastMonthOutsources}
          />
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
          {/* <Vouchers /> */}
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
