import React, { useEffect } from "react";
import { useSelector, useDispatch } from "react-redux";
import TableRowCount from "../../../../../../components/pagination/rows";
import Pagination from "../../../../../../components/pagination";
import {
  SetMaxPage,
  SetActivePAGE,
} from "../../../../../../services/redux/slices/diagnostics/laboratory/validator";

const Footer = () => {
  const { isLoading, activePage, totalPages } = useSelector(
      ({ validator }) => validator
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
    <div className="d-flex justify-content-between align-items-center px-4">
      <TableRowCount />
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
