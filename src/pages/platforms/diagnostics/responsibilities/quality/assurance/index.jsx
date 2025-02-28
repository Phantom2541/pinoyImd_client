import React from "react";
import { useSelector, useDispatch } from "react-redux";
import { MDBCard, MDBCardBody } from "mdbreact";
import TopHeader from "./header";
import CardTables from "./tables";
import Modal from "./modal";
import Pagination from "../../../../../../components/pagination";
import TableRowCount from "./../../../../../../components/pagination/rows";
import { SetPAGE } from "./../../../../../../services/redux/slices/responsibilities/assurances";

const Assurances = () => {
  const { totalPages, page, isLoading } = useSelector(
      ({ assurances }) => assurances
    ),
    dispatch = useDispatch();
  // { maxPage } = useSelector(({ auth }) => auth),

  const setPage = (page) => dispatch(SetPAGE(page));

  return (
    <>
      <MDBCard narrow className="pb-3" style={{ minHeight: "600px" }}>
        <TopHeader />
        <MDBCardBody>
          <CardTables />
        </MDBCardBody>

        <div className="mb-auto d-flex justify-content-between align-items-center px-4">
          <TableRowCount />
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

export default Assurances;
