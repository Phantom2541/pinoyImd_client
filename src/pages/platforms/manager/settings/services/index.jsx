import React, { useState, useEffect } from "react";
import { useDispatch, useSelector } from "react-redux";
import { MDBCard, MDBCardBody } from "mdbreact";
import { useToasts } from "react-toast-notifications";
import { RESET } from "../../../../../services/redux/slices/diagnostics/laboratory/preferences";
import TableRowCount from "../../../../../components/pagination/rows";
import Pagination from "../../../../../components/pagination";
import ServiceCollapse from "./collapse";
import Header from "./header";

export default function ServicesComponent() {
  const { maxPage } = useSelector(({ auth }) => auth),
    { message, isSuccess, isLoading, filtered } = useSelector(
      ({ preferences }) => preferences
    ),
    [page, setPage] = useState(1),
    [totalPages, setTotalPages] = useState(1),
    // [template, setTemplate] = useState(null), // Added missing state
    // [service, setService] = useState(null), // Added missing state
    { addToast } = useToasts(),
    dispatch = useDispatch();

  // Custom pager
  useEffect(() => {
    if (Array.isArray(filtered) && filtered.length > 0) {
      let totalPages = Math.floor(filtered.length / maxPage);
      if (filtered.length % maxPage > 0) totalPages += 1;
      setTotalPages(totalPages);
      if (page > totalPages) {
        setPage(totalPages);
      }
    }
  }, [page, maxPage, filtered]);

  // Toast for errors or success update or delete
  useEffect(() => {
    if (message) {
      addToast(message, {
        appearance: isSuccess ? "success" : "error",
      });
    }

    return () => dispatch(RESET());
  }, [isSuccess, message, addToast, dispatch]);

  return (
    <MDBCard narrow>
      <Header />
      <MDBCardBody className="pb-0">
        <ServiceCollapse />
        <div className="d-flex justify-content-between align-items-center px-4">
          <TableRowCount />
          <Pagination
            isLoading={isLoading}
            total={totalPages}
            page={page}
            setPage={setPage}
          />
        </div>
      </MDBCardBody>
    </MDBCard>
  );
}
