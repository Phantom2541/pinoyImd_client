import React from "react";
import { MDBCard, MDBCardBody } from "mdbreact";
import Pagination from "../../../../../components/pagination";
import TableRowCount from "../../../../../components/pagination/rows";

const Outsources = () => {
  return (
    <MDBCard>
      <TopHeader />
      <MDBCardBody>
        {/* isLoading ? (
        <TableLoading />) : (
        <>
          <Collapsable data={data} />
          <Pagination onPageChange={handlePageChange} />
          <TableRowCount />
        </>
        ) */}
      </MDBCardBody>
    </MDBCard>
  );
};

export default Outsources;
