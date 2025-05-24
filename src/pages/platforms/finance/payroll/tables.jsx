import { useState, useEffect } from "react";
import { useSelector, useDispatch } from "react-redux";
import { MDBTable, MDBBtnGroup, MDBBtn } from "mdbreact";
import { useToasts } from "react-toast-notifications";

import {
  capitalize,
  fullName,
  getDate as getMonth,
  currency,
} from "../../../../services/utilities";
import {
  SetSELECTED,
  SetActivePAGE,
} from "../../../../services/redux/slices/assets/persons/personnels";

import { Policy } from "../../../../services/fakeDb";
import TableRowCount from "../../../../components/pagination/rows";
import Pagination from "../../../../components/pagination";
const Body = () => {
  const {
      collections,
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
    const salariedEmployees = [...collections]?.filter(
      ({ contract }) => ![4, 5, 6].includes(contract?.designation) // not salaried Stock holder , CEO , Proprietor
    );
    setPersonnels(salariedEmployees);
  }, [collections]);

  console.log("collections", collections);

  //Toast for errors or success
  useEffect(() => {
    if (message) {
      addToast(message, {
        appearance: isSuccess ? "success" : "error",
      });
    }
  }, [isSuccess, message, addToast, dispatch]);

  const handlePAYROLL = (selected) => {
    dispatch(SetSELECTED(selected));
  };

  const handlePayslip = (selected) => {
    // console.log("selected", selected);
    localStorage.setItem("payslip", JSON.stringify(selected));

    window.open(
      "/printout/payslip",
      "Task Printout",
      "top=100px,left=100px,width=1300px,height=750px"
    );
  };
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

  const getDay = (createdAt) => {
    const date = new Date(createdAt);
    return date.getDate();
  };
  const canBePaidThisQuarter = (createdAt) => {
    const date = new Date(createdAt);
    const now = new Date();

    const createdMonth = date.getMonth(); // 0–11
    const nowMonth = now.getMonth();

    const createdQuarter = Math.floor(createdMonth / 3) + 1;
    const currentQuarter = Math.floor(nowMonth / 3) + 1;

    const sameYear = date.getFullYear() === now.getFullYear();

    return createdQuarter === currentQuarter && sameYear;
  };

  return (
    <>
      <MDBTable responsive hover bordered>
        <thead>
          <tr>
            <th rowSpan="2">#</th>
            <th rowSpan="2">Name</th>
            <th rowSpan="2">Rate</th>
            <th rowSpan="2" title="Cost of Living Allowance">
              COLA
            </th>
            <th className="payroll-header text-center" colSpan="2">
              Payroll
            </th>
          </tr>
          <tr className="payroll-subheaders">
            <th>Quincena</th>
            <th>Katapusan</th>
          </tr>
        </thead>
        <tbody>
          {paginatedData.map((personnel, index) => {
            const { user, contract, rate, payroll } = personnel;
            const designation = Policy.getPosition(
              Number(contract?.designation)
            );

            const akinsenas = payroll?.find(
              ({ createdAt, breakdown }) =>
                getMonth(createdAt) === getMonth(new Date()) &&
                breakdown?.isAquincena
            );
            const katapusan = payroll?.find(({ createdAt, breakdown }) => {
              const day = getDay(createdAt);
              const pc = Number(contract?.pc);
              const isSameMonth = getMonth(createdAt) === getMonth(new Date());

              return pc === 1
                ? day > 15 && !breakdown?.isAquincena && isSameMonth
                : pc === 2
                ? day <= 31 && isSameMonth
                : canBePaidThisQuarter(createdAt);
            });
            // console.log("Quincena", akinsenas);
            // console.log("katapusan", katapusan);

            return (
              <tr key={`payroll-${index + 1}`}>
                <td>{index + 1}.</td>
                <td>
                  <p className="fw-bold mb-1 text-capitalize">
                    {capitalize(fullName(user.fullName))}
                  </p>
                  <p className="text-muted mb-0">
                    {designation?.toUpperCase()} |{" "}
                    {contract?.soe?.toUpperCase()}
                  </p>
                </td>
                <td>
                  <p className="fw-bold mb-1 text-capitalize">
                    monthly:{currency(rate?.monthly)}
                  </p>
                  {Number(contract?.pc) === 1 && (
                    <p className="text-muted mb-0">
                      Daily: {currency(rate?.daily)}
                    </p>
                  )}
                </td>
                <td>
                  <p className="fw-bold mb-1 text-capitalize">
                    {currency(rate?.cola)}
                  </p>
                </td>
                {Number(contract?.pc) === 1 && (
                  <td className="text-center">
                    {akinsenas ? (
                      <MDBBtnGroup className="shadow-0">
                        <MDBBtn
                          onClick={() =>
                            handlePayslip({
                              ...personnel,
                              breakdown: akinsenas?.breakdown,
                              datePaid: akinsenas?.createdAt,
                            })
                          }
                          color="warning"
                          size="sm"
                          title="View Payslip."
                        >
                          Payslip
                        </MDBBtn>
                      </MDBBtnGroup>
                    ) : (
                      <MDBBtnGroup className="shadow-0">
                        <MDBBtn
                          onClick={() =>
                            handlePAYROLL({ ...personnel, isAquincena: true })
                          }
                          color="success"
                          size="sm"
                          title="Create Payroll"
                        >
                          Payroll
                        </MDBBtn>
                      </MDBBtnGroup>
                    )}
                  </td>
                )}
                <td
                  className="text-center"
                  colSpan={Number(contract?.pc) === 1 ? 1 : 2}
                >
                  {katapusan ? (
                    <MDBBtnGroup className="shadow-0">
                      <MDBBtn
                        onClick={() =>
                          handlePayslip({
                            ...personnel,
                            breakdown: katapusan?.breakdown,
                            datePaid: katapusan?.createdAt,
                          })
                        }
                        color="warning"
                        size="sm"
                        title="Untag this branch."
                      >
                        Payslip
                      </MDBBtn>
                    </MDBBtnGroup>
                  ) : (
                    <MDBBtnGroup className="shadow-0">
                      <MDBBtn
                        onClick={() => handlePAYROLL(personnel)}
                        color="success"
                        size="sm"
                        title="Untag this branch."
                      >
                        Payroll
                      </MDBBtn>
                    </MDBBtnGroup>
                  )}
                </td>
              </tr>
            );
          })}
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
