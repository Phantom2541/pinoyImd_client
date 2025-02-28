import React, { useState, useEffect } from "react";
import { useSelector } from "react-redux";
import TableRowCount from "../../../../../../components/pagination/rows";
import Pagination from "../../../../../../components/pagination";

const Footer = ({ page, setPage }) => {
  const { collections, isLoading } = useSelector(({ sales }) => sales),
    { maxPage } = useSelector(({ auth }) => auth),
    [totalPages, setTotalPages] = useState(1);

  useEffect(() => {
    if (collections.length > 0) {
      let totalPages = Math.floor(collections.length / maxPage);
      if (collections.length % maxPage > 0) totalPages += 1;
      setTotalPages(totalPages);

      if (page > totalPages) {
        setPage(totalPages);
      }
    }
  }, [collections, page, setPage, maxPage]);

  return (
    <div className="d-flex justify-content-between align-items-center px-4">
      <TableRowCount />
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
