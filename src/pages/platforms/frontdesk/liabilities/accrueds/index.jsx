// Import necessary packages if needed
import React, { useState, useEffect } from "react";
import { useDispatch, useSelector } from "react-redux";
import {
  BROWSE,
  RESET,
} from "../../../../../services/redux/slices/responsibilities/liabilities";
import { useToasts } from "react-toast-notifications";
import Modal from "./modal";
import { currency, fullName } from "../../../../../services/utilities";

import { Liabilities } from "../../../../../services/fakeDb";
import {
  MDBBtn,
  MDBCard,
  MDBCardHeader,
  MDBCardBody,
  MDBTable,
  MDBBtnGroup,
  MDBIcon,
} from "mdbreact";

export default function Accrued() {
  const [accrued, setAccrued] = useState([]),
    [showModal, setShowModal] = useState(false),
    [willCreate, setWillCreate] = useState(true),
    { token, activePlatform } = useSelector(({ auth }) => auth),
    { collections, message, isSuccess } = useSelector(
      ({ liabilities }) => liabilities
    ),
    { addToast } = useToasts(),
    dispatch = useDispatch();

  // Initial Browse
  useEffect(() => {
    if (token && activePlatform?.branchId)
      dispatch(BROWSE({ token, branchId: activePlatform?.branchId }));

    return () => dispatch(RESET());
  }, [token, dispatch, activePlatform]);

  // Set fetched data for mapping
  useEffect(() => {
    setAccrued(collections);
  }, [collections]);

  // Toast for errors or success
  useEffect(() => {
    if (message) {
      addToast(message, {
        appearance: isSuccess ? "success" : "error",
      });
    }

    return () => dispatch(RESET());
  }, [isSuccess, message, addToast, dispatch]);

  // Modal toggle
  const toggleModal = () => setShowModal(!showModal);
  //Trigger for update
  // const handleUpdate = (selected) => {
  //   setSelected(selected);
  //   if (willCreate) {
  //     setWillCreate(false);
  //   }
  //   setShowModal(true);
  // };

  const handleCreate = () => {
    if (!willCreate) {
      setWillCreate(true);
    }
    setShowModal(true);
  };

  const formatDate = (dateString) => {
    console.log("Received dateString:", dateString);
    if (!dateString) return "Invalid date";
    const date = new Date(dateString);
    if (isNaN(date.getTime())) return "Invalid date";

    return new Intl.DateTimeFormat("en-US", {
      month: "long",
      day: "2-digit",
      year: "numeric",
    }).format(date);
  };

  // const handlePayslip = (model) => {
  //   localStorage.setItem("payslip", JSON.stringify(model));

  //   window.open(
  //     "/printout/payslip",
  //     "Task Printout",
  //     "top=100px,left=100px,width=1050px,height=750px"
  //   );
  // };

  const handlePayment = (model) => {
    console.log(model);

    // localStorage.setItem("payslip", JSON.stringify(model));
    // window.open(
    //   "/printout/payslip",
    //   "Task Printout",
    //   "top=100px,left=100px,width=1050px,height=750px"
    // );
  };

  return (
    <>
      <MDBCard>
        <MDBCardHeader className="d-flex justify-content-between">
          <h3>Accrued</h3>
          <MDBBtn className="btn btn-success" onClick={() => handleCreate()}>
            <MDBIcon icon="plus" />
          </MDBBtn>
        </MDBCardHeader>
        <MDBCardBody>
          <MDBTable>
            <thead>
              <tr>
                <th>#</th>
                <th>Name / Company</th>
                <th>Statement</th>
                <th>Due</th>
                <th>Amount</th>
                <th>Action</th>
              </tr>
            </thead>
            <tbody>
              {accrued?.map((liability, index) => {
                const statement = Liabilities.find(liability?.fsId);
                console.log(liability);

                return (
                  <tr key={`payroll-${index + 1}`}>
                    <td>{index + 1}.</td>
                    {liability?.supplier && (
                      <td>
                        <p className="fw-bold mb-1 text-capitalize">
                          {liability?.supplier?.vendors?.companyId?.name}
                        </p>
                        <p className="text-muted mb-0">
                          {liability?.supplier?.name} Branch
                        </p>
                      </td>
                    )}
                    {liability?.particular && (
                      <td>
                        <p className="fw-bold mb-1 text-capitalize">
                          {fullName(liability?.particular?.fullName)}
                        </p>
                      </td>
                    )}
                    <td>{statement ? statement.title : "N/A"}</td>
                    <td>{formatDate(liability?.due)}</td>
                    <td>{currency(liability?.amount)}</td>
                    <td>
                      <MDBBtnGroup className="shadow-0">
                        <MDBBtn
                          onClick={() => handlePayment(liability)}
                          color="warning"
                          size="sm"
                          title="Pay the liability"
                        >
                          Payment
                        </MDBBtn>
                      </MDBBtnGroup>
                    </td>
                  </tr>
                );
              })}
            </tbody>
          </MDBTable>
        </MDBCardBody>
      </MDBCard>
      <Modal show={showModal} toggle={toggleModal} willCreate={willCreate} />
      {/* <Payment show={showModal} toggle={toggleModal} willCreate={willCreate} /> */}
    </>
  );
}
