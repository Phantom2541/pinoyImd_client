import { useState, useEffect } from "react";
import { useSelector, useDispatch } from "react-redux";
import { MDBTable, MDBBtnGroup, MDBBtn, MDBIcon } from "mdbreact";
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
import Swal from "sweetalert2";
const Body = () => {
  const { activePlatform } = useSelector(({ auth }) => auth),
    {
      filtered: collections,
      message,
      isSuccess,
      maxPage,
      activePage,
      isLoading,
      totalPages,
      month,
      year,
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

  //Toast for errors or success
  useEffect(() => {
    if (message) {
      addToast(message, {
        appearance: isSuccess ? "success" : "error",
      });
    }
  }, [isSuccess, message, addToast, dispatch]);

  const handlePAYROLL = (selected) => {
    const name = fullName(selected?.user?.fullName);
    const rate = selected?.rate || {};
    const hasMonthly = !!rate.monthly;
    const hasDaily = !!rate.daily;

    // If both monthly and daily are present, proceed directly
    if (hasMonthly && hasDaily) {
      dispatch(SetSELECTED(selected));
      return;
    }

    // Build HTML for alert
    const buildHtml = (title, messages) => {
      const items = messages
        .map(
          (m) => `
        <li style="margin-bottom:6px;">
          <strong>${m.title}</strong>
          <div style="font-size:0.92rem; color:#555">${m.detail}</div>
        </li>`
        )
        .join("");

      return `
      <div style="font-family: system-ui, Arial;">
        <div style="margin-bottom:10px;">
          <div style="font-weight:700; font-size:1rem;">${title}</div>
          <div style="font-size:0.9rem; color:#666;">${name}</div>
        </div>
        <ul style="padding-left:18px; margin:0;">
          ${items}
        </ul>
      </div>
    `;
    };

    // Missing both
    if (!hasMonthly && !hasDaily) {
      Swal.fire({
        title: "Missing salary data",
        html: buildHtml("Monthly and Daily salary are missing", [
          {
            title: "Monthly salary required",
            detail: "Please declare a monthly salary.",
          },
          {
            title: "Daily rate required",
            detail: "Please declare a daily rate.",
          },
        ]),
        icon: "warning",
        confirmButtonText: "OK",
      });
      return;
    }

    // Missing monthly
    if (!hasMonthly) {
      Swal.fire({
        title: "Monthly salary missing",
        html: buildHtml("Monthly salary not declared", [
          {
            title: "Monthly salary required",
            detail: "Please declare a monthly salary.",
          },
        ]),
        icon: "info",
        confirmButtonText: "OK",
      });
      return;
    }

    // Missing daily
    if (!hasDaily) {
      Swal.fire({
        title: "Daily rate missing",
        html: buildHtml("Daily rate not declared", [
          {
            title: "Daily rate required",
            detail: "Please declare a daily rate.",
          },
        ]),
        icon: "info",
        confirmButtonText: "OK",
      });
      return;
    }
  };

  const handlePayslip = (selected) => {
    // console.log("selected", selected);
    localStorage.setItem(
      "payslip",
      JSON.stringify({ ...selected, branch: activePlatform?.branch })
    );

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
  const canBePaidThisQuarter = (payrolls) => {
    return payrolls?.some(({ createdAt }) => {
      const date = new Date(createdAt);
      //this is paid quarter
      const createdQuarter = Math.floor(date.getMonth() / 3) + 1;
      //current quarter base on the current month in header
      const currentQuarter = Math.floor((month - 1) / 3) + 1;
      // Must be same quarter and same year
      if (createdQuarter !== currentQuarter || date.getFullYear() !== year) {
        return false;
      }
      return true;
    });
  };

  return (
    <>
      <MDBTable responsive bordered small>
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
          {paginatedData.length > 0 ? (
            paginatedData.map((personnel, index) => {
              const { user, contract, rate, payroll } = personnel;
              const designation = Policy.getPosition(
                Number(contract?.designation)
              );

              const akinsenas = payroll?.find(
                ({ createdAt, breakdown }) =>
                  getMonth(createdAt) === month - 1 && breakdown?.isAquincena
              );
              const katapusan = payroll?.find(({ createdAt, breakdown }) => {
                const day = getDay(createdAt);
                const pc = Number(contract?.pc);
                const isSameMonth = getMonth(createdAt) === month - 1;

                return pc === 1
                  ? day > 15 && !breakdown?.isAquincena && isSameMonth
                  : pc === 2
                  ? day <= 31 && isSameMonth
                  : canBePaidThisQuarter(payroll);
              });

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
                    <p className="mb-1 text-capitalize">
                      <span className="fw-bold mr-1">monthly:</span>
                      {currency.format(rate?.monthly)}
                    </p>
                    <p className="mb-0">
                      <span className="fw-bold mr-1">Daily:</span>{" "}
                      {currency.format(rate?.daily)}
                    </p>
                  </td>
                  <td>
                    <p className="fw-bold mb-1 text-capitalize">
                      {currency.format(rate?.cola)}
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
            })
          ) : (
            <tr>
              <td colSpan={6} className="text-center fw-bold">
                <MDBIcon icon="search-minus" /> No Personnel found. try another
                keywords
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
