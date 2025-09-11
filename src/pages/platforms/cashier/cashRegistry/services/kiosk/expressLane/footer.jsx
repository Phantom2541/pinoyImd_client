import React, { useEffect } from "react";
import { useSelector, useDispatch } from "react-redux";
import Pagination from "../../../../../../../components/pagination";
import {
  SetMaxPage,
  SetActivePAGE,
} from "../../../../../../../services/redux/slices/commerce/pos/services/deals";
import TableRowCount from "../../../../../../../components/pagination/rows";
const Footer = () => {
  const { maxPage } = useSelector(({ auth }) => auth),
    { isLoading, totalPages, activePage } = useSelector(({ deals }) => deals),
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
    <div className="mb-auto d-flex justify-content-between align-items-center px-4">
      <TableRowCount disablePageSelect={false} />
      <Pagination
        isLoading={isLoading}
        total={totalPages}
        page={activePage}
        setPage={handlePageChange}
      />
    </div>
  );
};

export default Footer;
