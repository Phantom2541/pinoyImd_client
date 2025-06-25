import { useState, useEffect, useCallback } from "react";
import { useDispatch, useSelector } from "react-redux";
import { useToasts } from "react-toast-notifications";
import {
  BROWSE,
  SetActivePAGE,
  RESET,
} from "../../../../../services/redux/slices/assets/persons/personnels";
import { MDBCard, MDBCardBody, MDBView } from "mdbreact";
import MenuCollapse from "./collapse";
import TableLoading from "../../../../../components/tableLoading";
import Pagination from "../../../../../components/pagination";
import TableRowCount from "../../../../../components/pagination/rows";
import Search from "../../../../../components/searchables/search";
import { employment } from "../../../../../services/utilities";

export default function Staffs() {
  const [staffs, setStaffs] = useState([]),
    { token, activePlatform } = useSelector(({ auth }) => auth),
    {
      collections,
      message,
      isSuccess,
      isLoading,
      activePage,
      totalPages,
      maxPage,
    } = useSelector(({ personnels }) => personnels),
    [status, setStatus] = useState(""),
    [searchKey, setSearchKey] = useState(""),
    [willCreate, setWillCreate] = useState(true),
    { addToast } = useToasts(),
    dispatch = useDispatch();

  //Initial Browse
  useEffect(() => {
    if (token && activePlatform?.branchId)
      dispatch(BROWSE({ token, branchId: activePlatform?.branchId }));
    return () => dispatch(RESET());
  }, [token, dispatch, activePlatform]);

  const arrangeStaffs = useCallback(
    (status) => {
      var _staffs = collections;
      if (status) {
        _staffs = [...collections].filter(({ status: stats }) => {
          if (status === "active") {
            return employment.isEmployed(stats);
          } else {
            return !employment.isEmployed(stats);
          }
        });
      }
      return _staffs;
    },
    [collections]
  );

  useEffect(() => {
    setStaffs(arrangeStaffs(status));
    document.getElementById("item-search").value = "";
  }, [status, arrangeStaffs]);

  //Trigger for update
  const handleUpdate = (_) => {
    // setSelected(selected);
    if (willCreate) {
      setWillCreate(false);
    }
  };

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

  const handlePageChange = (action) => {
    const newPage = activePage + (action ? 1 : -1);
    if (newPage >= 1 && newPage <= totalPages) {
      dispatch(SetActivePAGE(newPage));
    }
  };

  const itemsPerPage = maxPage; // Number of items per page
  const startIndex = (activePage - 1) * itemsPerPage;
  const endIndex = startIndex + itemsPerPage;
  const paginatedData = staffs.slice(startIndex, endIndex); // Get only items for the active page

  return (
    <>
      <MDBCard narrow>
        <MDBView
          cascade
          className="gradient-card-header blue-gradient narrower py-2 mx-4 mb-3 d-flex justify-content-between align-items-center"
        >
          <span className="white-text mx-3">Staff List</span>
          <div className="d-flex align-items-center">
            <div className="d-flex align-items-center">
              <span className="mr-2">Status: </span>
              <select
                className="form-control mr-3 bg-light"
                value={status}
                onChange={({ target }) => setStatus(target.value)}
              >
                <option value={""}>All</option>
                <option value={"active"}>Active</option>
                <option value={"inactive"}>Inactive</option>
              </select>
            </div>
            <Search
              haveAction={false}
              collections={arrangeStaffs(status)}
              setFiltered={(results) => setStaffs(results)}
              reset={() => setStaffs(arrangeStaffs(status))}
            />
          </div>
        </MDBView>
        <MDBCardBody className="pb-0">
          {isLoading ? (
            <TableLoading />
          ) : (
            <>
              <MenuCollapse
                staffs={paginatedData}
                page={activePage}
                resetSearch={resetSearch}
                searchKey={searchKey}
                handleUpdate={handleUpdate}
              />
              <div className="d-flex justify-content-between align-items-center px-4">
                <TableRowCount />

                <Pagination
                  isLoading={isLoading}
                  total={totalPages}
                  page={activePage}
                  setPage={handlePageChange}
                />
              </div>
            </>
          )}
        </MDBCardBody>
      </MDBCard>
    </>
  );
}
