import { useSelector, useDispatch } from "react-redux";
import { MDBCard, MDBCardBody } from "mdbreact";

import TopHeader from "./header";
import Pagination from "../../../../../components/pagination";
import TableRowCount from "../../../../../components/pagination/rows";
import { SetActivePAGE } from "../../../../../services/redux/slices/assets/providers";
import TableLoading from "../../../../../components/tableLoading";
import Body from "./body";
const Insources = () => {
  const { activePlatform } = useSelector(({ auth }) => auth),
    { totalPages, activePage, isLoading } = useSelector(
      ({ providers }) => providers
    ),
    dispatch = useDispatch();

  console.log("activePlatform", activePlatform);
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
        <MDBCardBody>{!isLoading ? <Body /> : <TableLoading />}</MDBCardBody>
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
    </>
  );
};

export default Insources;
