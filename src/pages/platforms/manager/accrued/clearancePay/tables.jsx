import { useState, useEffect } from "react";
import { useSelector, useDispatch } from "react-redux";
import { MDBTable } from "mdbreact";
import { useToasts } from "react-toast-notifications";

import {
  capitalize,
  fullName,
  currency,
} from "../../../../../services/utilities";
import { SetActivePAGE } from "../../../../../services/redux/slices/assets/persons/personnels";

import TableRowCount from "../../../../../components/pagination/rows";
import Pagination from "../../../../../components/pagination";
const Body = () => {
  const {
      filtered,
      message,
      isSuccess,
      maxPage,
      activePage,
      isLoading,
      totalPages,
    } = useSelector(({ personnels }) => personnels),
    [personnels, setPersonnels] = useState([]),
    { addToast } = useToasts(),
    dispatch = useDispatch();
  //Set fetched data for mapping
  useEffect(() => {
    const salariedEmployees = [...filtered]?.filter(
      ({ contract }) => ![4, 5, 6].includes(contract?.designation) // not salaried Stock holder , CEO , Proprietor
    );
    setPersonnels(salariedEmployees);
  }, [filtered]);

  //Toast for errors or success
  useEffect(() => {
    if (message) {
      addToast(message, {
        appearance: isSuccess ? "success" : "error",
      });
    }
  }, [isSuccess, message, addToast, dispatch]);

  /**
   * Pagination: Calculate the start and end index for the current page
   */
  const itemsPerPage = maxPage; // Number of items per page
  const startIndex = (activePage - 1) * itemsPerPage;
  const endIndex = startIndex + itemsPerPage;
  const paginatedData = personnels.slice(startIndex, endIndex); // Get only items for the active page

  const handlePageChange = (action) => {
    const newPage = activePage + (action ? 1 : -1);
    if (newPage >= 1 && newPage <= totalPages) {
      dispatch(SetActivePAGE(newPage));
    }
  };

  return (
    <>
      <MDBTable responsive hover bordered>
        <thead>
          <tr>
            <th rowSpan="2">#</th>
            <th rowSpan="2">Name</th>
            <th rowSpan="2">Deduction</th>
            <th rowSpan="2">Back Pay</th>
            <th rowSpan="2">Net</th>
          </tr>
        </thead>
        <tbody>
          {paginatedData?.length > 0 ? (
            paginatedData.map((personnel, index) => {
              const { particular, breakdown = {} } = personnel;
              const { backPay = 0, deduction = 0, net = 0 } = breakdown;

              return (
                <tr key={`payroll-${index + 1}`}>
                  <td>{index + 1}.</td>
                  <td>
                    <p className="fw-bold mb-1 text-capitalize">
                      {capitalize(fullName(particular?.fullName))}
                    </p>
                  </td>
                  <td>{currency(deduction)}</td>
                  <td>{currency(backPay)}</td>
                  <td>{currency(net)}</td>
                </tr>
              );
            })
          ) : (
            <tr>
              <td colSpan={5} className="text-center fw-bold">
                No Record Found
              </td>
            </tr>
          )}
        </tbody>
      </MDBTable>
      <div className="d-flex align-items-center justify-content-between">
        <TableRowCount disablePageSelect={false} />
        <Pagination
          isLoading={isLoading}
          total={totalPages}
          page={activePage}
          setPage={handlePageChange}
        />
      </div>
    </>
  );
};

export default Body;
