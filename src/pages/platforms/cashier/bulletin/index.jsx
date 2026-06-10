import { useEffect, useMemo, useState } from "react";
import { useDispatch, useSelector } from "react-redux";
import { axioKit } from "../../../../services/utilities";
import { BROWSE as BROWSE_REMITTANCES } from "../../../../services/redux/slices/finance/bookkeeping/remittances";
import { BROWSE as BROWSE_DEALS } from "../../../../services/redux/slices/commerce/pos/services/deals";
import {
  MDBContainer,
  MDBRow,
  // MDBCol,
  // MDBCard,
  // MDBCardBody,
  // MDBProgress,
  // MDBBtn,
  // MDBTable,
  // MDBIcon,
} from "mdbreact";
import { Sales, OutSource, InSource, Utilities } from "./wigets";
import Transactions from "./transactions";
import { OutSources, InSources } from "./sources";
// import { Expenses, Purchases } from "./calendars";
// import Vouchers from "../accrued/vouchers";

export default function Dashboard() {
  const [lastMonthSales, setLastMonthSales] = useState(0);
  const [currentMonthInsources, setCurrentMonthInsources] = useState(0);
  const [lastMonthInsources, setLastMonthInsources] = useState(0);
  const [currentMonthOutsources, setCurrentMonthOutsources] = useState(0);
  const [lastMonthOutsources, setLastMonthOutsources] = useState(0);

  const { activePlatform, auth, token } = useSelector(({ auth }) => auth),
    { collections: remittanceCollections = [] } = useSelector(
      ({ remittances }) => remittances,
    ),
    { collections: dealCollections = [], lastBrowseKey: lastDealsBrowseKey } =
      useSelector(({ deals }) => deals),
    { lastBrowseKey: lastRemittancesBrowseKey } = useSelector(
      ({ remittances }) => remittances,
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

    return (
      remittedMonthSales + Math.max(0, todayLiveSales - todayRemittedSales)
    );
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

    // const queryCurrentMonth = {
    //   cashier: auth._id,
    //   branch: activePlatform.branchId,
    //   month: month + 1,
    //   year,
    // };

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
        }),
      );
    }

    if (JSON.stringify(lastDealsBrowseKey) !== JSON.stringify(dealsBrowseKey)) {
      dispatch(
        BROWSE_DEALS({
          token,
          key: dealsBrowseKey,
        }),
      );
    }

    axioKit
      .universal(`commerce/pos/services/deals/groupSource`, token, {
        branchId: activePlatform.branchId,
        cashierId: auth._id,
        month: month + 1,
        year,
      })
      .then((res = []) => {
        const currentTotal = res.reduce(
          (total, item) => total + Number(item?.totalAmount || 0),
          0,
        );
        setCurrentMonthInsources(currentTotal);
      })
      .catch((err) => console.log(err.message));

    axioKit
      .universal(`commerce/pos/services/deals/groupSource`, token, {
        branchId: activePlatform.branchId,
        cashierId: auth._id,
        month: month === 0 ? 12 : month,
        year: month === 0 ? year - 1 : year,
      })
      .then((res = []) => {
        const lastMonthTotal = res.reduce(
          (total, item) => total + Number(item?.totalAmount || 0),
          0,
        );
        setLastMonthInsources(lastMonthTotal);
      })
      .catch((err) => console.log(err.message));

    Promise.all([
      axioKit.universal(
        `finance/bookkeeping/remittances/browse`,
        token,
        queryLastMonth,
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
      .universal(`commerce/pos/services/deals/groupOutsource`, token, {
        branchId: activePlatform.branchId,
        cashierId: auth._id,
        month: month + 1,
        year,
      })
      .then((res = []) => {
        const currentTotal = res.reduce(
          (total, item) => total + Number(item?.totalAmount || 0),
          0,
        );
        setCurrentMonthOutsources(currentTotal);
      })
      .catch((err) => console.log(err.message));

    axioKit
      .universal(`commerce/pos/services/deals/groupOutsource`, token, {
        branchId: activePlatform.branchId,
        cashierId: auth._id,
        month: month === 0 ? 12 : month,
        year: month === 0 ? year - 1 : year,
      })
      .then((res = []) => {
        const lastMonthTotal = res.reduce(
          (total, item) => total + Number(item?.totalAmount || 0),
          0,
        );
        setLastMonthOutsources(lastMonthTotal);
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
            currentMonthInsources={currentMonthInsources}
            lastMonthInsources={lastMonthInsources}
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
    </MDBContainer>
  );
}
