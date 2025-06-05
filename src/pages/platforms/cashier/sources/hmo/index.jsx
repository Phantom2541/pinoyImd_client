import React from "react";
import { useSelector, useDispatch } from "react-redux";
import { MDBCard, MDBCardBody } from "mdbreact";

import Collapsable from "./collapsables";
import TopHeader from "./header";
import Pagination from "../../../../../components/pagination";
import TableRowCount from "../../../../../components/pagination/rows";
import { SetPAGE } from "../../../../../services/redux/slices/assets/providers";
import TableLoading from "../../../../../components/tableLoading";
import Modal from "./modal";
import RegisterBranch from "./registerBranch";
import Table from "./table";
const HMO = () => {
  const { totalPages, page, isLoading } = useSelector(
      ({ providers }) => providers
    ),
    dispatch = useDispatch();

  const setPage = (page) => dispatch(SetPAGE(page));
  return (
    <>
      <MDBCard narrow className="pb-3 mt-3" style={{ minHeight: "600px" }}>
        <TopHeader />
        <MDBCardBody>{!isLoading ? <Table /> : <TableLoading />}</MDBCardBody>
        <RegisterBranch />
        <div className="mb-auto d-flex justify-content-between align-items-center px-4">
          <TableRowCount disablePageSelect={false} />
          <Pagination
            isLoading={isLoading}
            total={totalPages}
            page={page}
            setPage={setPage}
          />
        </div>
      </MDBCard>
      <Modal />
    </>
  );
};

export default HMO;
