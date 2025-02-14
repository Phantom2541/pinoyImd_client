import React, { useState, useEffect } from "react";
import { useDispatch, useSelector } from "react-redux";
import { useToasts } from "react-toast-notifications";
import { Search, globalSearch } from "../../../../../services/utilities";
import { Services as Service } from "../../../../../services/fakeDb";
import { MDBCard, MDBCardBody, MDBView } from "mdbreact";
import TableRowCount from "../../../../../components/pagination/rows";
import Pagination from "../../../../../components/pagination";
import ServiceCollapse from "./collapse";

export default function Services() {
  const [services, setServices] = useState([]),
    [page, setPage] = useState(1),
    [totalPages, setTotalPages] = useState(1),
    // [searchKey, setSearchKey] = useState(""),
    { token } = useSelector(({ auth }) => auth),
    { message, isSuccess, isLoading } = useSelector(
      ({ preferences }) => preferences
    ),
    { onDuty, maxPage } = useSelector(({ auth }) => auth),
    { addToast } = useToasts(),
    dispatch = useDispatch();

  //custom pager
  useEffect(() => {
    if (services.length > 0) {
      let totalPages = Math.floor(services.length / maxPage);
      if (services.length % maxPage > 0) totalPages += 1;
      setTotalPages(totalPages);

      if (page > totalPages) {
        setPage(totalPages);
      }
    }
  }, [services, page, maxPage]);

  //Initial Browse
  useEffect(() => {
    if (token && onDuty?._id) {
      setServices(Service.collections);
    }
  }, [token, onDuty]);

  //Toast for errors or success
  useEffect(() => {
    if (message) {
      addToast(message, {
        appearance: isSuccess ? "success" : "error",
      });
    }
  }, [isSuccess, message, addToast, dispatch]);

  //Search function
  const handleSearch = async (willSearch, key) => {
    if (willSearch) {
      setServices(globalSearch(Service.collections, key));
    } else {
      setServices(Service.collections);
    }
  };

  return (
    <MDBCard narrow>
      <MDBView
        cascade
        className="gradient-card-header blue-gradient narrower py-2 mx-4 mb-3 d-flex justify-content-between align-items-center"
      >
        <span className="white-text mx-3">
          {services.length}&nbsp;
          {/* {searchKey ? `Matches with ${searchKey}` : "Services"} */}
        </span>
        <div className="text-right">
          <Search handleSearch={handleSearch} isLocal={true} />
        </div>
      </MDBView>
      <MDBCardBody className="pb-0">
        <ServiceCollapse services={services} page={page} />
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
