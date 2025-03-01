import React, { useState, useEffect } from "react";
import { useDispatch, useSelector } from "react-redux";
import { useToasts } from "react-toast-notifications";
import {
  RESET,
} from "../../../../../services/redux/slices/commerce/sales";
import {
  MDBCard,
  MDBCardBody,
  MDBSpinner,
} from "mdbreact";
import TasksCollapse from "./collapse";

import Header from "./headers";
import Footer from "./footer";
import TableLoading from "../../../../../components/tableLoading";

export default function Tasks() {
  const [tasks, setTasks] = useState([]),
    [searchKey, setSearchKey] = useState(""),
    [page, setPage] = useState(1),
    { collections, message, isSuccess, isLoading } = useSelector(
      ({ sales }) => sales
    ),
    { addToast } = useToasts(),
    dispatch = useDispatch();

  

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
 
  return (
    <MDBCard narrow>
      <Header   tasks={tasks} searchKey={searchKey} setSearchKey={setSearchKey}/>
      <MDBCardBody className="pb-0">
        {isLoading ? (
          <TableLoading/>
        ) : (
          <>
            <TasksCollapse
              tasks={tasks}
              page={page}
              resetSearch={resetSearch}
              searchKey={searchKey}
            />
            <Footer  
              page={page}
              setPage={setPage} />
          </>
        )}
      </MDBCardBody>
    </MDBCard>
  );
}
