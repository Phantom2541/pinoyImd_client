import React, { useEffect, useState } from "react";
import { useDispatch, useSelector } from "react-redux";
import { capitalize } from "lodash";
import {
  currency,
  fullName,
  axioKit,
} from "./../../../../../../services/utilities";
import { Categories } from "./../../../../../../services/fakeDb";
import {
  MANAGERUPDATE,
  RESET,
} from "../../../../../../services/redux/slices/commerce/pos/services/deals";
import Swal from "sweetalert2";
import Months from "../../../../../../services/fakeDb/calendar/months";
import { MDBCardBody, MDBTable, MDBIcon, MDBBadge } from "mdbreact";

export const Tables = () => {
  const { token, activePlatform, auth } = useSelector(({ auth }) => auth),
    { collections, filtered, maxPage, activePage } = useSelector(
      ({ deals }) => deals
    ),
    [view, setView] = useState("all"),
    dispatch = useDispatch();

  useEffect(() => {
    const today = new Date();
    axioKit
      .universal("finance/pre-calculated-daily-sale/find", token, {
        month: Months[today.getMonth()],
        day: today.getDate(),
        year: today.getFullYear(),
        cashier: auth._id,
        branch: activePlatform?.branchId,
      })
      .catch((error) => {
        console.error("Error fetching daily sale:", error);
      });

    return () => dispatch(RESET());
  }, [token, dispatch, activePlatform, auth]);

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
    console.log("deal", deal);
    const { discount, amount } = deal;

    const originalAmount = discount ? discount + amount : amount;
    const message =
      amount === originalAmount
        ? `Amount is ${amount}`
        : `discounted Amount: ${amount} : Original Amount: ${originalAmount}`;

    const { value } = await Swal.fire({
      title: "Input New Amount",
      input: "number",
      inputLabel: message,
      inputAttributes: {
        min: "0",
        max: originalAmount.toString(),
      },
    });

    if (!value) return; // If user cancels or inputs nothing, do nothing

    if (value > originalAmount) {
      return Swal.fire({
        icon: "error",
        title: "Invalid Amount",
        text: `The amount must not exceed ${originalAmount}`,
      });
    }

    if (value <= originalAmount) {
      Swal.fire({
        icon: "success",
        title: "Successfully Updated!",
      });

      dispatch(
        MANAGERUPDATE({
          token,
          key: {
            _id: deal._id,
            amount: value,
            discount: originalAmount - value,
            authorizedBy: auth._id,
          },
        })
      );
    }
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
      <MDBTable>
        <thead>
          <tr>
            <th>#</th>
            <th>Patient</th>
            <th>Physician</th>
            <th>Amount</th>
            <th>Services</th>
            <th>Remarks</th>
            <th>Action</th>
          </tr>
        </thead>
        <tbody>
          {paginatedData?.map((deal, index) => {
            const isDeleted = !!deal.deletedAt;
            const isDiscounted = deal.discount > 0;
            return (
              <tr
                key={`sales-${index + 1}`}
                style={{
                  backgroundColor: isDeleted
                    ? "#ffcccc"
                    : isDiscounted
                    ? "#ccffcc"
                    : "transparent",
                }}
              >
                <td>{index + 1}.</td>
                <td>
                  <h6>{fullName(deal.customerId.fullName)}</h6>
                  <small>
                    {capitalize(
                      deal.category === "walkin"
                        ? deal.category
                        : Categories.find(({ abbr }) => abbr === deal.category)
                            .name
                    )}
                    @ {new Date(deal.createdAt).toLocaleTimeString()}
                  </small>
                </td>
                <td>
                  {deal.physicianId?.fullName.lname && (
                    <h6>Dr. {deal.physicianId.fullName.lname}</h6>
                  )}
                  <p>{deal.source?.companyName || deal.source?.name}</p>
                </td>
                <td>
                  <p>
                    {currency(deal.amount)}
                    <MDBIcon
                      title="Edit Sales Amount"
                      onClick={() => handleEdit(deal)}
                      icon="pencil-alt"
                      className="ml-1"
                    />
                  </p>
                  <p style={{ color: "red" }}>{currency(deal.discount)}</p>
                </td>
                <td>
                  {deal.cart?.map((menu) => (
                    <MDBBadge key={menu.referenceId} className="mx-1">
                      {menu?.abbreviation}
                    </MDBBadge>
                  ))}
                </td>
                <td>{deal.remarks}</td>
                <td>
                  {!isDeleted && (
                    <MDBIcon
                      icon="trash"
                      className="mr-2"
                      title="Delete Sales"
                      onClick={() => handleDelete(deal)}
                    />
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
