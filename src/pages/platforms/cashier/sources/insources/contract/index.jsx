import { useSelector, useDispatch } from "react-redux";
import { MDBCard, MDBCardBody } from "mdbreact";

import Collapsable from "./collapsables";
import TopHeader from "./header";
import Pagination from "../../../../../../components/pagination";
import TableRowCount from "../../../../../../components/pagination/rows";
import { SetActivePAGE } from "../../../../../../services/redux/slices/assets/providers";
import TableLoading from "../../../../../../components/tableLoading";
import Modal from "./modal";
import RegisterBranch from "./registerBranch";
const Contract = () => {
  const { totalPages, activePage, isLoading } = useSelector(
      ({ providers }) => providers
    ),
    dispatch = useDispatch();

  const handlePageChange = (action) => {
    const newPage = activePage + (action ? 1 : -1);
    if (newPage >= 1 && newPage <= totalPages) {
      dispatch(SetActivePAGE(newPage));
    }
  };

  return (
    <>
      <MDBCard narrow className="pb-3 mt-3" style={{ minHeight: "600px" }}>
        <TopHeader />
        <MDBCardBody>
          {!isLoading ? <Collapsable /> : <TableLoading />}
        </MDBCardBody>
        <RegisterBranch />
        <div className="mb-auto d-flex justify-content-between align-items-center px-4">
          <TableRowCount disablePageSelect={false} />
          <Pagination
            isLoading={isLoading}
            total={totalPages}
            page={activePage}
            setPage={handlePageChange}
          />
        </div>
      </MDBCard>
      <Modal />
    </>
  );
};

export default Contract;
