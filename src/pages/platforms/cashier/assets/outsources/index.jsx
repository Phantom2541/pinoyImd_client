import React from "react";
import { MDBCard, MDBCardBody } from "mdbreact";
<<<<<<< Updated upstream
<<<<<<< Updated upstream
<<<<<<< Updated upstream
import { useSelector, useDispatch } from "react-redux";
import { SetPAGE } from "../../../../../services/redux/slices/assets/providers";
import TableLoading from "../../../../../components/tableLoading";
// import Collapsable from "./collapsables";
=======
// import TableLoading from "../../../../../components/tableLoading";
>>>>>>> Stashed changes
=======
// import TableLoading from "../../../../../components/tableLoading";
>>>>>>> Stashed changes
=======
// import TableLoading from "../../../../../components/tableLoading";
>>>>>>> Stashed changes
// import TopHeader from "./header";
import Pagination from "../../../../../components/pagination";
import TableRowCount from "../../../../../components/pagination/rows";

const Outsources = () => {
  return (
    <MDBCard>
      {/* <TopHeader /> */}
      <MDBCardBody>
        {/* isLoading ? (
          <TableLoading />
        ) : (
          <>
            {/* <Collapsable data={data} /> */}
            <Pagination onPageChange={handlePageChange} />
            <TableRowCount />
          </>
        ) */}
      </MDBCardBody>
    </MDBCard>
  );
};

export default Outsources;
