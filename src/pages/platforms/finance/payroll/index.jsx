import React, { useState, useEffect } from "react";
import { useDispatch, useSelector } from "react-redux";
import {
  BROWSE,
  RESET,
} from "../../../../services/redux/slices/responsibilities/payroll";
import { useToasts } from "react-toast-notifications";
import Modal from "./modal";
import {
  capitalize,
  fullName,
  getDate,
  currency,
} from "../../../../services/utilities";

import { MDBCard, MDBCardBody, MDBTable, MDBBtn, MDBBtnGroup } from "mdbreact";
import CardTables from "./tables";
import TopHeader from "../../../../components/topHeader";
import TableRowCount from "../../../../components/pagination/rows";

export default function Payroll() {
  const dispatch = useDispatch();
  const { addToast } = useToasts();

  const [payrolls, setPayrolls] = useState([]);
  const [page, setPage] = useState(1);
  const [showModal, setShowModal] = useState(false);
  const [selected, setSelected] = useState({});
  const [willCreate, setWillCreate] = useState(true);

  const { token, auth } = useSelector(({ auth }) => auth);
  const { activePlatform } = auth;
  const { collections, isLoading, message, isSuccess } = useSelector(
    ({ payrolls }) => payrolls
  );

  // Initial data fetch
  useEffect(() => {
    if (token) {
      dispatch(BROWSE({ token, branchId: activePlatform.branchId }));
    }
    return () => dispatch(RESET());
  }, [token, dispatch, activePlatform]);

  // Update payroll data when collections change
  useEffect(() => {
    setPayrolls(collections);
  }, [collections]);

  // Show toast notifications
  useEffect(() => {
    if (message) {
      addToast(message, {
        appearance: isSuccess ? "success" : "error",
      });
    }
    return () => dispatch(RESET());
  }, [isSuccess, message, addToast, dispatch]);

  // Toggle modal
  const toggleModal = () => setShowModal(!showModal);

  // Handle payslip print
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
      <MDBCard narrow className="pb-3">
        <TopHeader title="Company Payroll" />
        <MDBCardBody>
          <CardTables
            payrolls={payrolls}
            page={page}
            setSelected={setSelected}
            setWillCreate={setWillCreate}
            setShowModal={setShowModal}
          />

          <div className="d-flex justify-content-between align-items-center px-4">
            <TableRowCount />
          </div>

          <MDBTable>
            <tbody>
              {payrolls?.map((payroll, index) => {
                const { personnel, employment, rate, user, designation } =
                  payroll;

                const katapusan = payroll?.payslips?.find((payslip) => {
                  if (employment?.bimonthly) {
                    return getDate(payslip.createdAt) > 15;
                  } else {
                    return getDate(payslip.createdAt) <= 31;
                  }
                });

                return (
                  <tr key={`payroll-${index + 1}`}>
                    <td>{index + 1}.</td>
                    <td>
                      <p className="fw-bold mb-1 text-capitalize">
                        {capitalize(fullName(user?.fullName))}
                      </p>
                      <p className="text-muted mb-0">
                        {designation?.name?.toUpperCase()} |
                        {employment?.soe?.toUpperCase()}
                      </p>
                    </td>
                    <td>
                      <p className="fw-bold mb-1 text-capitalize">
                        Monthly: {currency(rate?.monthly)}
                      </p>
                      {employment?.bimonthly && (
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

                    {employment?.bimonthly && (
                      <td className="text-center">
                        {katapusan ? (
                          <MDBBtnGroup className="shadow-0">
                            <MDBBtn
                              onClick={() => handlePayslip(personnel)}
                              color="warning"
                              size="sm"
                              title="View Payslip"
                            >
                              Payslip
                            </MDBBtn>
                          </MDBBtnGroup>
                        ) : (
                          <MDBBtnGroup className="shadow-0">
                            <MDBBtn
                              onClick={() => setShowModal(true)}
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
                      colSpan={employment?.bimonthly ? 1 : 2}
                    >
                      {katapusan ? (
                        <MDBBtnGroup className="shadow-0">
                          <MDBBtn
                            onClick={() => handlePayslip(personnel)}
                            color="warning"
                            size="sm"
                            title="View Payslip"
                          >
                            Payslip
                          </MDBBtn>
                        </MDBBtnGroup>
                      ) : (
                        <MDBBtnGroup className="shadow-0">
                          <MDBBtn
                            onClick={() => setShowModal(true)}
                            color="success"
                            size="sm"
                            title="Create Payroll"
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

      <Modal
        selected={selected}
        show={showModal}
        toggle={toggleModal}
        willCreate={willCreate}
      />
    </>
  );
}
