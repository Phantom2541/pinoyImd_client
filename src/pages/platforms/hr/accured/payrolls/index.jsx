import React, { useState, useEffect } from "react";
import { useDispatch, useSelector } from "react-redux";
// import {
//   BROWSE as PAYROLL,
//   RESET as PAYROLLRESET,
// } from "../../../../services/redux/slices/liability/payroll";
import {
  PAYROLL,
  RESET,
} from "../../../../../services/redux/slices/assets/persons/personnels";
import { useToasts } from "react-toast-notifications";
import Modal from "./modal";
import {
  capitalize,
  fullName,
  getDate,
  currency,
} from "../../../../../services/utilities";

import { Roles } from "../../../../../services/fakeDb";
import {
  MDBBtn,
  MDBCard,
  MDBCardHeader,
  MDBCardBody,
  MDBTable,
  MDBBtnGroup,
} from "mdbreact";

export default function Payrolls() {
  const [personnels, setPersonnels] = useState([]),
    [selected, setSelected] = useState({}),
    [showModal, setShowModal] = useState(false),
    { token, activePlatform } = useSelector(({ auth }) => auth),
    { collections, message, isSuccess } = useSelector(
      ({ personnels }) => personnels
    ),
    PaySlip = useSelector(({ liabilities }) => liabilities.isSuccess),
    { addToast } = useToasts(),
    dispatch = useDispatch();
  //Initial Browse
  useEffect(() => {
    if (token && activePlatform?.branchId)
      dispatch(PAYROLL({ token, branchId: activePlatform?.branchId }));

    return () => dispatch(RESET());
  }, [token, dispatch, activePlatform, PaySlip]);
  //Set fetched data for mapping
  useEffect(() => {
    setPersonnels(collections);
  }, [collections]);

  //Modal toggle
  const toggleModal = () => setShowModal(!showModal);

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
  // const handleSearch = async (willSearch, key) => {
  //   if (willSearch) return setPersonnels(globalSearch(collections, key));

  //   setPersonnels(collections);
  // };

  const handleToggle = (model) => {
    setShowModal(true);
    setSelected(model);
  };

  const handlePayslip = (model) => {
    localStorage.setItem("payslip", JSON.stringify(model));

    window.open(
      "/printout/payslip",
      "Task Printout",
      "top=100px,left=100px,width=1050px,height=750px"
    );
  };

  return (
    <>
      <MDBCard>
        <MDBCardHeader>
          <h3>Payroll</h3>
        </MDBCardHeader>
        <MDBCardBody>
          <MDBTable>
            <thead>
              <tr>
                <th>#</th>
                <th>Name</th>
                <th>Rate</th>
                <th>COLA</th>
                {/* Cost of Living Allowance */}
                <th>Akinsenas</th>
                <th>Katapusan</th>
              </tr>
            </thead>
            <tbody>
              {personnels.map((personnel, index) => {
                const { user, contract, rate, payroll } = personnel;
                const designation = Roles.findById(
                  Number(contract?.designation)
                );
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
                console.log("akinsenas", akinsenas);
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
                              onClick={() => handleToggle(personnel)}
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
                            onClick={() => handleToggle(personnel)}
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
        </MDBCardBody>
      </MDBCard>
      <Modal selected={selected} show={showModal} toggle={toggleModal} />
    </>
  );
}
