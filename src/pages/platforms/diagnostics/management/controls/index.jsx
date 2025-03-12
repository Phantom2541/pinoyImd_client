import React from "react";
import { useSelector, useDispatch } from "react-redux";
import { MDBCard, MDBCardBody, MDBContainer } from "mdbreact";
import CardHeader from "./header";
import CardTables from "./body";
import Modal from "./modal";
import Pagination from "./../../../../../components/pagination";
import TableRowCount from "./../../../../../components/pagination/rows";
import { SetPAGE } from "./../../../../../services/redux/slices/liability/controls";
import Chart from "./chart";

const Controls = () => {
  const { totalPages, page, isLoading } = useSelector(
      ({ controls }) => controls
    ),
    dispatch = useDispatch();

  return (
    <MDBContainer className="d-flex" fluid>
      <div className=" py-1 rounded flex-1 ml-2 px-2">
        <Chart />
      </div>
      <div style={{ width: "300px", marginLeft: "10px" }}>
        <MDBCard narrow className="pb-3" style={{ minHeight: "600px" }}>
          <CardHeader />
          <MDBCardBody>
            <CardTables />
          </MDBCardBody>

          <div className="mb-auto d-flex justify-content-between align-items-center px-4">
            <TableRowCount disablePageSelect={false} />
            <Pagination
              isLoading={isLoading}
              total={totalPages}
              page={page}
              setPage={(page) => dispatch(SetPAGE(page))}
            />
          </div>
        </MDBCard>
      </div>
      <Modal />
    </MDBContainer>
  );
};

export default Controls;
