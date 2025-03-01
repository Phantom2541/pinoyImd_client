import React from "react";
import { MDBCard, MDBCardBody } from "mdbreact";

import Body from "./body";
import TopHeader from "./header";
// import Pagination from "../../../../../components/pagination";
import TableRowCount from "../../../components/pagination/rows";
import TableLoading from "../../../components/tableLoading";
const Tablestemplate = () => {
  // const { totalPages, page, isLoading } = useSelector(
  //     ({ controls }) => controls
  //   ),
  //   dispatch = useDispatch();

  //   const setPage = (page) => dispatch(SetPAGE(page));

  const isLoading = false;

  return (
    <>
      <MDBCard narrow className="pb-3" style={{ minHeight: "600px" }}>
        <TopHeader />
        <MDBCardBody>{isLoading ? <TableLoading /> : <Body />}</MDBCardBody>

        <div className="mb-auto d-flex justify-content-between align-items-center px-4">
          <TableRowCount disablePageSelect={false} />
          {/* <Pagination
            isLoading={isLoading}
            total={totalPages}
            page={page}
            setPage={setPage}
          /> */}
        </div>
      </MDBCard>
    </>
  );
};

export default Tablestemplate;
