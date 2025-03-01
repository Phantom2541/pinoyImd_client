import React from "react";
import TableRowCount from "../../../components/pagination/rows";
import Pagination from "../../../components/pagination";
const Footer = ({ totalPages, page, setPage }) => {
  const isLoading = false;

  return (
    <div className="mb-auto d-flex justify-content-between align-items-center px-4">
      <TableRowCount disablePageSelect={false} />
      <Pagination
        isLoading={isLoading}
        total={totalPages}
        page={page}
        setPage={setPage}
      />
    </div>
  );
};

export default Footer;
