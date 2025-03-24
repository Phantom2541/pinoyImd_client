import React, { useEffect, useState } from "react";
import { useDispatch, useSelector } from "react-redux";
import { capitalize } from "lodash";
import {
  currency,
  fullName,
  getGenderIcon,
  paymentMethod,
  // axioKit,
} from "./../../../../../../services/utilities";
import { Categories } from "./../../../../../../services/fakeDb";
import {
  MANAGERUPDATE,
  SetDISCOUNT,
  SetREVERT,
  // RESET,
} from "../../../../../../services/redux/slices/commerce/pos/services/deals";
import Swal from "sweetalert2";
import Months from "../../../../../../services/fakeDb/calendar/months";
import discount from "../../../../../../assets/discount.png";
import tendered from "../../../../../../assets/tendered.png";
import {
  MDBCardBody,
  MDBTable,
  MDBIcon,
  MDBBadge,
  MDBBtn,
  MDBBtnGroup,
} from "mdbreact";
import "./style.css";

export const Tables = () => {
  const { token, auth } = useSelector(({ auth }) => auth),
    { collections, filtered, maxPage, activePage } = useSelector(
      ({ deals }) => deals
    ),
    [total, setTotal] = useState(0),
    [patient, setPatient] = useState(0),
    [didHoverID, setDidHoverID] = useState(-1),
    [view, setView] = useState("all"),
    dispatch = useDispatch();

  // useEffect(() => {
  //   const today = new Date();
  //   axioKit
  //     .universal("finance/pre-calculated-daily-sale/find", token, {
  //       month: Months[today.getMonth()],
  //       day: today.getDate(),
  //       year: today.getFullYear(),
  //       cashier: auth._id,
  //       branch: activePlatform?.branchId,
  //     })
  //     .catch((error) => {
  //       console.error("Error fetching daily sale:", error);
  //     });

  //   return () => dispatch(RESET());
  // }, [token, dispatch, activePlatform, auth]);

  useEffect(() => {
    const validTransactions = filtered.filter((item) => !item.deletedAt);
    setTotal(validTransactions.reduce((a, b) => a + b.amount, 0));
    setPatient(validTransactions.length);
  }, [filtered]);

  useEffect(() => {
    if (!!collections.length) {
      setView("all");
    }
  }, [collections, view]);

  const handleDelete = async ({ _id }) => {
    const { value: remarks } = await Swal.fire({
      title: "Are you sure?",
      text: "Please, specify a reason.",
      input: "text",
      inputPlaceholder: "Remarks",
      icon: "warning",
      showCancelButton: true,
      confirmButtonColor: "#3085d6",
      cancelButtonColor: "#d33",
      confirmButtonText: "Proceed",
      inputValidator: (value) => {
        if (!value) {
          return "You need to write something!";
        }
      },
    });

    if (remarks) {
      const today = new Date();
      dispatch(
        MANAGERUPDATE({
          token,
          key: {
            _id,
            remarks,
            cash: 0,
            amount: 0,
            month: Months[today.getMonth()],
            day: today.getDate(),
            year: today.getFullYear(),
            deletedAt: today.toLocaleString(),
          },
        })
      );
    }
  };

  const handleEdit = async (deal) => {
    dispatch(SetDISCOUNT(deal));
    // const { discount, amount } = deal;

    // const originalAmount = discount ? discount + amount : amount;
    // const message =
    //   amount === originalAmount
    //     ? `Amount is ${amount}`
    //     : `discounted Amount: ${amount} : Original Amount: ${originalAmount}`;

    // const { value } = await Swal.fire({
    //   title: "Input New Amount",
    //   input: "number",
    //   inputLabel: message,
    //   inputAttributes: {
    //     min: "0",
    //     max: originalAmount.toString(),
    //   },
    // });

    // if (!value) return; // If user cancels or inputs nothing, do nothing

    // if (value > originalAmount) {
    //   return Swal.fire({
    //     icon: "error",
    //     title: "Invalid Amount",
    //     text: `The amount must not exceed ${originalAmount}`,
    //   });
    // }

    // if (value <= originalAmount) {
    //   Swal.fire({
    //     icon: "success",
    //     title: "Successfully Updated!",
    //   });

    //   dispatch(
    //     MANAGERUPDATE({
    //       token,
    //       key: {
    //         _id: deal._id,
    //         amount: value,
    //         discount: originalAmount - value,
    //         authorizedBy: auth._id,
    //       },
    //     })
    //   );
    // }
  };

  const handleRevert = (deal) => {
    dispatch(SetREVERT(deal));
  };

  /**
   * Pagination: Calculate the start and end index for the current page
   */
  const itemsPerPage = maxPage; // Number of items per page
  const startIndex = (activePage - 1) * itemsPerPage;
  const endIndex = startIndex + itemsPerPage;
  const paginatedData = filtered.slice(startIndex, endIndex); // Get only items for the active page

  return (
    <MDBCardBody>
      <div
        style={{
          display: "flex",
          alignItems: "center",
          width: "100%",
          marginTop: "-1.4rem",
        }}
      >
        <p style={{ fontSize: "1.5rem", margin: "0 10px" }}>
          {currency(total)}
        </p>
        <div style={{ flex: 1, borderBottom: "1px dashed black" }}></div>
        <p style={{ fontSize: "1.5rem", margin: "0 10px" }}>
          @ {patient} Patient/s
        </p>
      </div>

      <MDBTable style={{ marginTop: "-5px" }} hover>
        <thead>
          <tr style={{ marginTop: "-5rem" }}>
            <th>Patient</th>
            <th>Physician</th>
            <th>Amount</th>
            <th>Services</th>
            <th>Remarks</th>
          </tr>
        </thead>
        <tbody>
          {paginatedData?.map((deal, index) => {
            const isDeleted = !!deal.deletedAt;
            const isDiscounted = deal.discount > 0;
            const isHover = index === didHoverID;
            const { img, style, text } = paymentMethod.getImage(deal.payment);

            return (
              <tr
                onMouseEnter={() => setDidHoverID(index)}
                onMouseLeave={() => setDidHoverID(-1)}
                key={`sales-${index + 1}`}
                style={{
                  backgroundColor: isDeleted
                    ? "#ffcccc"
                    : isDiscounted
                    ? "#ccffcc"
                    : "",
                }}
              >
                <td>
                  <div className="d-flex align-items-center">
                    <h6>{getGenderIcon(deal?.customerId?.isMale)} </h6>
                    <h6>{fullName(deal?.customerId?.fullName)}</h6>
                  </div>
                  <MDBBadge color="info" className="mr-2">
                    {capitalize(
                      deal.category === "walkin"
                        ? deal.category
                        : Categories.find(({ abbr }) => abbr === deal.category)
                            .name
                    )}
                  </MDBBadge>
                  @ {new Date(deal.createdAt).toLocaleTimeString()}
                </td>
                <td>
                  {deal.physicianId?.fullName.lname && (
                    <h6>Dr. {deal.physicianId.fullName.lname}</h6>
                  )}
                  <p>{deal.source?.companyName || deal.source?.name}</p>
                </td>
                <td style={{ fontWeight: 400 }}>
                  <div className="d-flex align-items-center">
                    <h6
                      className="mt-2"
                      style={{ fontWeight: 600 }}
                      title="Amount"
                    >
                      {currency(deal.amount)}
                    </h6>
                    <img
                      src={img}
                      alt={text}
                      className="ml-1"
                      title={text}
                      style={{
                        ...style,
                      }}
                    />
                  </div>
                  {/* <p style={{ fontWeight: 500 }}>{currency(deal.amount)}</p> */}
                  {isDiscounted && (
                    <p
                      style={{ color: "red", marginTop: "-0.2rem" }}
                      title="Discount"
                      className="d-flex align-items-center"
                    >
                      {currency(deal.discount)}
                      <img
                        alt="Discount"
                        className="ml-3"
                        src={discount}
                        title="Discount"
                        style={{ height: "1.4rem" }}
                      />{" "}
                    </p>
                  )}
                  <p
                    style={{ marginTop: "-0.5rem" }}
                    title="Tendered"
                    className="d-flex align-items-center"
                  >
                    {currency(deal.cash)}
                    <img
                      alt="tendered"
                      className="ml-2"
                      src={tendered}
                      title="Tendered"
                      style={{ height: "2rem" }}
                    />{" "}
                  </p>
                </td>
                <td>
                  {deal.cart?.map((menu) => (
                    <MDBBadge key={menu.referenceId} className="mx-1">
                      {menu?.abbreviation}
                    </MDBBadge>
                  ))}
                </td>
                <td>
                  {!isHover ? (
                    deal.remarks
                  ) : (
                    <>
                      <MDBBtnGroup>
                        {!isDeleted ? (
                          <>
                            <MDBBtn
                              size="sm"
                              color="danger"
                              rounded
                              onClick={() => handleDelete(deal)}
                              title="Delete Sale"
                            >
                              <MDBIcon icon="trash" />
                            </MDBBtn>
                            <MDBBtn
                              size="sm"
                              color="primary"
                              rounded
                              onClick={() => handleEdit(deal)}
                              title="Edit Sales Amount"
                            >
                              <MDBIcon icon="pencil-alt" />
                            </MDBBtn>
                          </>
                        ) : (
                          <div style={{ width: "8.4rem" }}>
                            <MDBBtn
                              size="sm"
                              color="warning"
                              rounded
                              onClick={() => handleRevert(deal)}
                              title="Revert Sale"
                            >
                              <MDBIcon fas icon="sync-alt" />
                            </MDBBtn>
                          </div>
                        )}
                      </MDBBtnGroup>
                    </>
                  )}
                </td>
              </tr>
            );
          })}
        </tbody>
      </MDBTable>
    </MDBCardBody>
  );
};

export default Tables;
