import React, { useState, useEffect } from "react";
import { useDispatch, useSelector } from "react-redux";
import { useToasts } from "react-toast-notifications";
import {
  TASKS,
  RESET,
} from "../../../../../services/redux/slices/commerce/sales";
import { globalSearch } from "../../../../../services/utilities";
import {
  MDBBtn,
  MDBCard,
  MDBCardBody,
  MDBIcon,
  MDBSpinner,
  MDBView,
} from "mdbreact";
import TasksCollapse from "./collapse";
import TableRowCount from "../../../../../components/pagination/rows";
import Pagination from "../../../../../components/pagination";
import Swal from "sweetalert2";
import {
  BROWSE,
  RESET as PREFRESET,
} from "../../../../../services/redux/slices/results/preferences";
import {
  BROWSE as HEADS,
  RESET as HEADSRESET,
} from "../../../../../services/redux/slices/assets/persons/heads";

export default function Tasks() {
  const [tasks, setTasks] = useState([]),
    [searchKey, setSearchKey] = useState(""),
    [page, setPage] = useState(1),
    [totalPages, setTotalPages] = useState(1),
    { token, onDuty, maxPage } = useSelector(({ auth }) => auth),
    { collections, message, isSuccess, isLoading } = useSelector(
      ({ sales }) => sales
    ),
    { addToast } = useToasts(),
    dispatch = useDispatch();

  useEffect(() => {
    if (tasks.length > 0) {
      let totalPages = Math.floor(tasks.length / maxPage);
      if (tasks.length % maxPage > 0) totalPages += 1;
      setTotalPages(totalPages);

      if (page > totalPages) {
        setPage(totalPages);
      }
    }
  }, [tasks, page, maxPage]);

  //Initial Browse
  useEffect(() => {
    if (token && onDuty._id) {
      dispatch(
        TASKS({
          token,
          key: {
            branchId: onDuty._id,
            createdAt: new Date().setHours(0, 0, 0, 0),
          },
        })
      );
      dispatch(BROWSE({ token, branchId: onDuty._id }));
      dispatch(HEADS({ token, branchId: onDuty._id }));
    }

    return () => {
      dispatch(RESET());
      dispatch(PREFRESET());
      dispatch(HEADSRESET());
    };
  }, [token, dispatch, onDuty]);

  //Set fetched data for mapping
  useEffect(() => {
    setTasks(collections);
  }, [collections]);

  //Toast for errors or success
  useEffect(() => {
    if (message) {
      addToast(message, {
        appearance: isSuccess ? "success" : "error",
      });
    }

    return () => dispatch(RESET());
  }, [isSuccess, message, addToast, dispatch]);

  const resetSearch = () => setSearchKey("");

  //Search function
  const handleSearch = async () => {
    if (searchKey) {
      setSearchKey("");
      setTasks(collections);
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
        setTasks(globalSearch(collections, value));
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
          {tasks.length}&nbsp;
          {searchKey ? `Matches with ${searchKey}` : "Daily Tasks"}
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
        {isLoading ? (
          <div className="text-center my-5">
            <MDBSpinner />
          </div>
        ) : (
          <>
            <TasksCollapse
              tasks={tasks}
              page={page}
              resetSearch={resetSearch}
              searchKey={searchKey}
            />
            <div className="d-flex justify-content-between align-items-center px-4">
              <TableRowCount />

              <Pagination
                isLoading={isLoading}
                total={totalPages}
                page={page}
                setPage={setPage}
              />
            </div>
          </>
        )}
      </MDBCardBody>
    </MDBCard>
  );
}
