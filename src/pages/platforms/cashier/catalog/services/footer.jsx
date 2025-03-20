import React, { useEffect } from "react";
import { useSelector, useDispatch } from "react-redux";
import TableRowCount from "../../../../../components/pagination/rows";
import Pagination from "../../../../../components/pagination";
import {
  SetMaxPage,
  SetActivePAGE,
} from "../../../../../services/redux/slices/commerce/catalog/services";
const Footer = () => {
  const { isLoading, totalPages, activePage } = useSelector(
      ({ services }) => services
    ),
    { maxPage } = useSelector(({ auth }) => auth),
    dispatch = useDispatch();

  useEffect(() => {
    dispatch(SetMaxPage(maxPage));
  }, [dispatch, maxPage]);

  const handlePageChange = (action) => {
    const newPage = activePage + (action ? 1 : -1);
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
