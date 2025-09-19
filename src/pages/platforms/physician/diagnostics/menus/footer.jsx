import React, { useEffect } from "react";
import { useSelector, useDispatch } from "react-redux";
import TableRowCount from "../../../../../components/pagination/rows";
import Pagination from "../../../../../components/pagination";
import {
  SetMaxPage,
  setActivePage,
} from "../../../../../services/redux/slices/diagnostics/clinic/clinicMenus";
const Footer = () => {
  const { maxPage } = useSelector(({ auth }) => auth),
    { isLoading, totalPages, activePage } = useSelector(
      ({ clinicMenus }) => clinicMenus
    ),
    dispatch = useDispatch();

  useEffect(() => {
    dispatch(SetMaxPage(maxPage));
  }, [dispatch, maxPage]);

  const handlePageChange = (action) => {
    const newPage =
      typeof action === "number" ? action : activePage + (action ? 1 : -1);
    if (newPage >= 1 && newPage <= totalPages) {
      dispatch(setActivePage(newPage));
    }
  };

  console.log("totalpages", totalPages);
  console.log("activepage", activePage);

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
