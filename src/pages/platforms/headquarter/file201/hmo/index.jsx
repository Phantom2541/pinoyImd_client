import { useSelector, useDispatch } from "react-redux";
import { MDBCard, MDBCardBody } from "mdbreact";
import {
  SetActivePAGE,
  SetMaxPage,
} from "../../../../../services/redux/slices/assets/companies";
import TopHeader from "./header";
import Pagination from "../../../../../components/pagination";
import TableRowCount from "../../../../../components/pagination/rows";
import TableLoading from "../../../../../components/tableLoading";
import Body from "./body";
import Modal from "./modal";
import { useEffect } from "react";
const Index = () => {
  const { maxPage } = useSelector(({ auth }) => auth),
    { totalPages, activePage, isLoading } = useSelector(
      ({ companies }) => companies
    ),
    dispatch = useDispatch();

  useEffect(() => {
    dispatch(SetMaxPage(maxPage));
  }, [dispatch, maxPage]);

  const handlePageChange = (action) => {
    const newPage =
      typeof action === "number" ? action : activePage + (action ? 1 : -1);
    if (newPage >= 1 && newPage <= totalPages) {
      dispatch(SetActivePAGE(newPage));
    }
  };

  return (
    <>
      <MDBCard narrow className="pb-3 mt-3" style={{ minHeight: "600px" }}>
        <TopHeader />
        <MDBCardBody>{!isLoading ? <Body /> : <TableLoading />}</MDBCardBody>
        <div className="mb-auto d-flex justify-content-between align-items-center px-4">
          <TableRowCount disablePageSelect={false} />
          <Pagination
            isLoading={isLoading}
            total={totalPages}
            page={activePage}
            setPage={handlePageChange}
          />
          <Modal />
        </div>
      </MDBCard>
    </>
  );
};

export default Index;
