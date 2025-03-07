import React, { useState, useEffect } from "react";
import { useDispatch, useSelector } from "react-redux";
import { useToasts } from "react-toast-notifications";
import { RESET } from "../../../../../services/redux/slices/commerce/pos/services/deals";
import { MDBCard, MDBCardBody } from "mdbreact";
import TasksCollapse from "./collapse";
import Header from "./headers";
import Footer from "./footer";
import TableLoading from "../../../../../components/tableLoading";

export default function Tasks() {
  const [searchKey, setSearchKey] = useState(""),
    [page, setPage] = useState(1),
    { message, isSuccess, isLoading } = useSelector(({ sales }) => sales),
    { addToast } = useToasts(),
    dispatch = useDispatch();

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
      <Header searchKey={searchKey} setSearchKey={setSearchKey} />
      <MDBCardBody className="pb-0">
        {isLoading ? (
          <TableLoading />
        ) : (
          <>
            <TasksCollapse
              page={page}
              resetSearch={resetSearch}
              searchKey={searchKey}
            />
            <Footer page={page} setPage={setPage} />
          </>
        )}
      </MDBCardBody>
    </MDBCard>
  );
}
