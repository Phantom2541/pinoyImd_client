import React from "react";
import { MDBCard, MDBCardBody } from "mdbreact";

import Body from "./collapse";
import Header from "./header";
import TableLoading from "../../../components/tableLoading";
import Footer from "./footer";
const Collapsable = () => {
  // const { totalPages, page, isLoading } = useSelector(
  //     ({ controls }) => controls
  //   ),
  //   dispatch = useDispatch();

  //   const setPage = (page) => dispatch(SetPAGE(page));

  const isLoading = false;

  return (
    <>
      <MDBCard narrow className="pb-3" style={{ minHeight: "600px" }}>
        <Header />
        <MDBCardBody>{isLoading ? <TableLoading /> : <Body />}</MDBCardBody>
        <Footer />
      </MDBCard>
    </>
  );
};

export default Collapsable;
