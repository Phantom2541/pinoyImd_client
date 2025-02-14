import React, { useState, useEffect } from "react";
import { useDispatch, useSelector } from "react-redux";
import {
  BROWSE,
  RESET,
} from "../../../../../services/redux/slices/results/preferences";
import { useToasts } from "react-toast-notifications";
import { globalSearch } from "../../../../../services/utilities";
import { Services as Service } from "../../../../../services/fakeDb/index";
import { MDBBtn, MDBCard, MDBCardBody, MDBIcon, MDBView } from "mdbreact";
import TableRowCount from "../../../../../components/pagination/rows";
import Pagination from "../../../../../components/pagination";
import ServiceCollapse from "./collapse";
import Swal from "sweetalert2";

export default function Services() {
  const [services, setServices] = useState([]),
    [page, setPage] = useState(1),
    [totalPages, setTotalPages] = useState(1),
    [searchKey, setSearchKey] = useState(""),
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
      dispatch(BROWSE({ token, branchId: onDuty._id }));
    }

    return () => dispatch(RESET());
  }, [token, dispatch, onDuty]);

  //Toast for errors or success
  useEffect(() => {
    if (message) {
      addToast(message, {
        appearance: isSuccess ? "success" : "error",
      });
    }

    return () => dispatch(RESET());
  }, [isSuccess, message, addToast, dispatch]);

  //Search function
  const handleSearch = async () => {
    if (searchKey) {
      setSearchKey("");
      setServices(Service.collections);
    } else {
      const { value: search } = await Swal.fire({
        title: "What are you looking for?",
        text: "Provide a keyword and we will find it for you.",
        icon: "question",
        input: "text",
        confirmButtonText: "Search",
        inputValidator: (value) => {
          if (!value) {
            return "You need to write something!";
          }
        },
      });

      if (search) {
        const value = search.toUpperCase();

        setSearchKey(value);
        setServices(globalSearch(Service.collections, value));
      }
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
          {searchKey ? `Matches with ${searchKey}` : "Services"}
        </span>
        <div className="text-right">
          <MDBBtn
            onClick={handleSearch}
            disabled={isLoading}
            outline
            color="white"
            rounded
            size="sm"
            className="px-2"
          >
            <MDBIcon icon={searchKey ? "times" : "search"} className="mt-0" />
          </MDBBtn>
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
