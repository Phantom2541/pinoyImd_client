import React, { useEffect, useState } from "react";
import { useSelector, useDispatch } from "react-redux";
import { MDBAnimation, MDBCard, MDBCardBody } from "mdbreact";
import TableLoading from "../../../../../components/tableLoading";
import { BROWSE } from "../../../../../services/redux/slices/assets/branches";
import { BROWSE as BROWSE_COMPANIES } from "../../../../../services/redux/slices/assets/companies";
import Header from "./header";
import Body from "./body";
import Footer from "./footer";
import Modal from "./modal";
import PriceList from "./pricelist";

const Index = () => {
  const { token } = useSelector(({ auth }) => auth);
  const { isLoading, records } = useSelector(({ providers }) => providers); // ← assuming you have providers.records from Redux
  const dispatch = useDispatch();

  // ✅ ADD THIS: filtered state
  const [filtered, setFiltered] = useState([]);

  useEffect(() => {
    if (token) dispatch(BROWSE({ token }));
  }, [token, dispatch]);

  useEffect(() => {
    dispatch(BROWSE_COMPANIES({ token }));
  }, [token, dispatch]);

  // ✅ Set filtered when new records arrive
  useEffect(() => {
    if (records) setFiltered(records);
  }, [records]);

  return (
    <>
      <MDBAnimation type="bounceInDown">
        <MDBCard narrow className="pb-3" style={{ minHeight: "600px" }}>
          {/* ✅ pass setFiltered and records to Header */}
          <Header collections={records} setFiltered={setFiltered} />
          <MDBCardBody>
            {isLoading ? <TableLoading /> : <Body data={filtered} />}
          </MDBCardBody>
          <Footer />
        </MDBCard>
      </MDBAnimation>
      <Modal />
      <PriceList />
    </>
  );
};

export default Index;
