import React from "react";
import { MDBCard, MDBCardBody } from "mdbreact";
import { useSelector, useDispatch } from "react-redux";
import { SetPAGE } from "../../../../../services/redux/slices/assets/providers";
import TableLoading from "../../../../../components/tableLoading";
// import Collapsable from "./collapsables";
// import TopHeader from "./header";
import Pagination from "../../../../../components/pagination";
import TableRowCount from "../../../../../components/pagination/rows";

const Outsources = () => {
  const dispatch = useDispatch();
  const isLoading = useSelector((state) => state.assets.isLoading);
  const data = useSelector((state) => state.assets.outsources);

  const handlePageChange = (page) => {
    dispatch(SetPAGE(page));
  };

  return (
    <MDBCard>
      {/* <TopHeader /> */}
      <MDBCardBody>
        {isLoading ? (
          <TableLoading />
        ) : (
          <>
            {/* <Collapsable data={data} /> */}
            <Pagination onPageChange={handlePageChange} />
            <TableRowCount />
          </>
        )}
      </MDBCardBody>
    </MDBCard>
  );
};

export default Outsources;
