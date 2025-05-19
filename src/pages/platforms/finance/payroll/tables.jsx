import React, { useState, useEffect } from "react";
import { useSelector, useDispatch } from "react-redux";
import { MDBTable, MDBBtnGroup, MDBBtn } from "mdbreact";
import { useToasts } from "react-toast-notifications";

import {
  capitalize,
  fullName,
  getDate,
  currency,
} from "../../../../services/utilities";

import { Roles } from "../../../../services/fakeDb";
const Body = () => {
  const { collections, message, isSuccess, maxPage, activePage } = useSelector(
      ({ personnels }) => personnels
    ),
    [personnels, setPersonnels] = useState([]),
    { addToast } = useToasts(),
    dispatch = useDispatch();
  //Set fetched data for mapping
  useEffect(() => {
    setPersonnels(collections);
  }, [collections]);

  //Toast for errors or success
  useEffect(() => {
    if (message) {
      addToast(message, {
        appearance: isSuccess ? "success" : "error",
      });
    }
  }, [isSuccess, message, addToast, dispatch]);

  const handlePayslip = (model) => {
    console.log("model", model);
    localStorage.setItem("payslip", JSON.stringify(model));

    window.open(
      "/printout/payslip",
      "Task Printout",
      "top=100px,left=100px,width=1050px,height=750px"
    );
  };
  /**
   * Pagination: Calculate the start and end index for the current page
   */
  const itemsPerPage = maxPage; // Number of items per page
  const startIndex = (activePage - 1) * itemsPerPage;
  const endIndex = startIndex + itemsPerPage;
  const paginatedData = personnels.slice(startIndex, endIndex); // Get only items for the active page

  return (
    <MDBTable responsive hover bordered>
      <thead>
        <tr>
          <th rowSpan="2">#</th>
          <th rowSpan="2">Name</th>
          <th rowSpan="2">Rate</th>
          <th rowSpan="2" title="Cost of Living Allowance">
            COLA
          </th>
          <th className="payroll-header" colSpan="2">
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
          const designation = Roles.findById(Number(contract?.designation));
          // //console.log("payrollss", payroll);

          let akinsenas = payroll?.find(
            ({ createdAt }) => getDate(createdAt) <= 15
          );

          let katapusan = payroll?.find((payslip) => {
            if (Number(contract?.pc) === 1) {
              if (getDate(payslip.createdAt) > 15) {
                return payslip;
              }
            } else if (Number(contract?.pc) === 2) {
              if (getDate(payslip.createdAt) <= 31) {
                return payslip;
              }
            } else {
              if (getDate(payslip.createdAt) <= 90) {
                return payslip;
              }
            }
            return null;
          });
          console.log("Quincena", akinsenas);
          console.log("katapusan", katapusan);

          return (
            <tr key={`payroll-${index + 1}`}>
              <td>{index + 1}.</td>
              <td>
                <p className="fw-bold mb-1 text-capitalize">
                  {capitalize(fullName(user.fullName))}
                </p>
                <p className="text-muted mb-0">
                  <p className="text-muted mb-0">
                    {designation?.name?.toUpperCase()} |
                    {contract?.soe?.toUpperCase()}
                  </p>
                </p>
              </td>
              <td>
                <p className="fw-bold mb-1 text-capitalize">
                  monthly:{currency(rate?.monthly)}
                </p>
                {Number(contract?.pc) === 1 && (
                  <p className="text-muted mb-0">
                    <p className="text-muted mb-0">
                      Daily: {currency(rate?.daily)}
                    </p>
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
                        onClick={() => handlePayslip(personnel)}
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
                        // onClick={() => handleToggle(personnel)}
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
                      onClick={() => handlePayslip(personnel)}
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
                      //   onClick={() => handleToggle(personnel)}
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
  );
};

export default Body;
