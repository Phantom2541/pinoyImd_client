import React, { useState, useEffect } from "react";
import { useDispatch, useSelector } from "react-redux";
import { MDBCard, MDBCardBody, MDBView } from "mdbreact";
import { SearchTemplates as Templates } from "../../../../../components/searchables";
import CustomSelect from "../../../../../components/searchables/customSelect";
import {
  BROWSE,
  RESET,
  SetTEMPLATE,
} from "../../../../../services/redux/slices/diagnostics/laboratory/preferences";
import { useToasts } from "react-toast-notifications";
import TableRowCount from "../../../../../components/pagination/rows";
import Pagination from "../../../../../components/pagination";
import ServiceCollapse from "./collapse";

export default function ServicesComponent() {
  const { activePlatform, maxPage, token } = useSelector(({ auth }) => auth),
    { message, isSuccess, isLoading, filtered } = useSelector(
      ({ preferences }) => preferences
    ),
    [page, setPage] = useState(1),
    [totalPages, setTotalPages] = useState(1),
    [template, setTemplate] = useState(null), // Added missing state
    [service, setService] = useState(null), // Added missing state
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

  // Initial Browse
  useEffect(() => {
    if (token && activePlatform?.branchId) {
      dispatch(BROWSE({ token, branchId: activePlatform?.branchId }));
    }

    return () => dispatch(RESET());
  }, [token, activePlatform, dispatch]);

  // Toast for errors or success
  useEffect(() => {
    if (message) {
      addToast(message, {
        appearance: isSuccess ? "success" : "error",
      });
    }

    return () => dispatch(RESET());
  }, [isSuccess, message, addToast, dispatch]);

  const handleTemplate = (template) => dispatch(SetTEMPLATE(template));

  return (
    <MDBCard narrow>
      <MDBView
        cascade
        className="gradient-card-header blue-gradient narrower py-2 mx-4 mb-3 d-flex justify-content-between align-items-center"
      >
        <div className="d-flex justify-content-end align-items-center">
          <span className="white-text font-weight-bold mr-2">Services:</span>
          <span className="font-weight-bold">{filtered.length}</span>
        </div>
        <div className="d-flex align-items-center">
          <Templates setTemplate={handleTemplate} />
          <CustomSelect
            className="m-0 p-0 ml-4 text-white"
            inputClassName="text-white m-0 p-0"
            preValue="Select a service"
            choices={[
              "All",
              "Inhouse",
              "Insource",
              "Outsource",
              "Fixed",
              "Fixed Naming",
              "Fixed Naming 2",
              "Fixed Naming 3",
              "Fixed Naming 4",
              "Fixed Naming 5",
              "Fixed Naming 6",
              "Fixed Naming 7",
              "Fixed Naming 8",
              "Fixed Naming 9",
              "Fixed Naming 10",
            ]}
            onChange={setService}
          />
          {/* Fixed naming */}
        </div>
      </MDBView>
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
