import { useState, useEffect, useCallback, useMemo } from "react";
import { useDispatch, useSelector } from "react-redux";
import { useToasts } from "react-toast-notifications";
import {
  BROWSE,
  SetActivePAGE,
  RESET,
} from "./../../../../../services/redux/slices/assets/persons/personnels";
import { MDBCard, MDBCardBody, MDBView } from "mdbreact";
import MenuCollapse from "./collapse";
import TableLoading from "../../../../../components/tableLoading";
import Pagination from "./../../../../../components/pagination";
import TableRowCount from "./../../../../../components/pagination/rows";
import Search from "./../../../../../components/searchables/search";
import { employment } from "./../../../../../services/utilities";

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
    } =
      useSelector(({ personnels }) => personnels),
    [searchKey, setSearchKey] = useState(""),
    [willCreate, setWillCreate] = useState(true),
    { addToast } = useToasts(),
    dispatch = useDispatch();
  const branchId = activePlatform?.branchId;

  //Initial Browse
  useEffect(() => {
    if (token && branchId) dispatch(BROWSE({ token, branchId }));
    return () => dispatch(RESET());
  }, [token, dispatch, branchId]);

  const arrangedStaffs = useMemo(
    () =>
      [...collections].filter(({ status: stats }) => {
        return employment.isEmployed(stats);
      }),
    [collections]
  );

  useEffect(() => {
    setStaffs(arrangedStaffs);
    const searchInput = document.getElementById("item-search");
    if (searchInput) searchInput.value = "";
  }, [arrangedStaffs]);

  //Trigger for update
  const handleUpdate = (_) => {
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
  const handleFilteredStaffs = useCallback((results) => setStaffs(results), []);
  const handleResetStaffs = useCallback(
    () => setStaffs(arrangedStaffs),
    [arrangedStaffs]
  );

  const handlePageChange = (action) => {
    const newPage = activePage + (action ? 1 : -1);
    if (newPage >= 1 && newPage <= totalPages) {
      dispatch(SetActivePAGE(newPage));
    }
  };

  const itemsPerPage = maxPage;
  const startIndex = (activePage - 1) * itemsPerPage;
  const endIndex = startIndex + itemsPerPage;
  const paginatedData = staffs.slice(startIndex, endIndex);

  return (
    <>
      <MDBCard narrow>
        <MDBView
          cascade
          className="gradient-card-header blue-gradient narrower py-2 mx-4 mb-3 d-flex justify-content-between align-items-center"
        >
          <span className="white-text mx-3">{staffs?.length} Staff List</span>
          <div className="d-flex align-items-center">
            <Search
              haveAction={false}
              collections={arrangedStaffs}
              setFiltered={handleFilteredStaffs}
              reset={handleResetStaffs}
            />
          </div>
        </MDBView>
        <MDBCardBody className="pb-0">
          {isLoading ? (
            <TableLoading />
          ) : (
            <>
              <MenuCollapse
                startIndex={startIndex}
                staffs={paginatedData}
                page={activePage}
                resetSearch={resetSearch}
                searchKey={searchKey}
                handleUpdate={handleUpdate}
              />
              <div className="d-flex justify-content-between align-items-center px-4">
                <TableRowCount disablePageSelect={false} />

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
