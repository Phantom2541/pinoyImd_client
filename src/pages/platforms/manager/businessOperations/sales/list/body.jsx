import React, { useEffect, useState } from "react";
import { useDispatch, useSelector } from "react-redux";
import { capitalize } from "lodash";
import {
  currency,
  Deals,
  fullName,
  getGenderIcon,
  paymentMethod,
} from "./../../../../../../services/utilities";
import { Categories } from "./../../../../../../services/fakeDb";
import {
  MANAGERUPDATE,
  SetDISCOUNT,
  RESET,
  SetREVERT,
} from "../../../../../../services/redux/slices/commerce/pos/services/deals";
import { useToasts } from "react-toast-notifications";

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
import { Select } from "../../../../../../components/customizable";

export const Tables = () => {
  const { token } = useSelector(({ auth }) => auth),
    { collections, maxPage, activePage, formSubmitted, isSuccess } =
      useSelector(({ deals }) => deals),
    { collections: sources } = useSelector(({ providers }) => providers),
    [total, setTotal] = useState(0),
    [selected, setSelected] = useState({}),
    [patient, setPatient] = useState(0),
    [didHoverID, setDidHoverID] = useState(-1),
    [view, setView] = useState("all"),
    { addToast } = useToasts(),
    dispatch = useDispatch();

  useEffect(() => {
    if (!formSubmitted && isSuccess) {
      dispatch(RESET());
      setSelected({});
    }
  }, [dispatch, formSubmitted, isSuccess]);

  useEffect(() => {
    const validTransactions = collections.filter((item) => !item.deletedAt);
    setTotal(validTransactions.reduce((a, b) => a + b.amount, 0));
    setPatient(validTransactions.length);
  }, [collections]);

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

  const handleEdit = async (deal) => dispatch(SetDISCOUNT(deal));

  const handleRevert = (deal) => dispatch(SetREVERT(deal));

  const handleUpdate = async (updatedKey, newKey, deal = {}) => {
    Deals.specificUpdate({
      updatedKey,
      newKey,
      selected,
      deal,
      setSelected,
      token,
      sources,
      dispatch,
      addToast,
    });
  };
  /**
   * Pagination: Calculate the start and end index for the current page
   */

  const itemsPerPage = maxPage; // Number of items per page
  const startIndex = (activePage - 1) * itemsPerPage;
  const endIndex = startIndex + itemsPerPage;
  const paginatedData = collections?.slice(startIndex, endIndex); // Get only items for the active page

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
            <th>Source/Physician</th>
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
            const sourceName = deal.source?.displayname || deal.source?.name;
            const { img, style, text } = paymentMethod.getImage(deal?.payment);

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
                  {selected._id === deal._id &&
                  selected?.updatedKey === "category" ? (
                    <div
                      style={{ width: "17rem", marginBottom: "-0.7rem" }}
                      className="mt-2 d-flex align-items-center"
                    >
                      <Select
                        label={"Category"}
                        onChange={(value) =>
                          setSelected({ ...selected, newCategory: value })
                        }
                        whitelisted
                        className="m-0 p-0"
                        collections={Categories}
                        preValue={deal.category}
                        keys={"abbr"}
                        values={"name"}
                      />
                      {!formSubmitted ? (
                        <MDBIcon
                          icon="check"
                          className="mr-2 ml-2 cursor-pointer"
                          onClick={() =>
                            handleUpdate("category", "newCategory")
                          }
                          style={{ fontSize: "1rem", color: "blue" }}
                        />
                      ) : (
                        <MDBIcon
                          icon="spinner"
                          className="ml-2"
                          pulse
                          style={{
                            color: "black",
                            fontSize: "1rem",
                            marginRight: "10px",
                          }}
                        />
                      )}

                      <MDBIcon
                        icon="times"
                        className="cursor-pointer "
                        onClick={() => setSelected({})}
                        style={{ fontSize: "1rem", color: "red" }}
                      />
                    </div>
                  ) : (
                    <MDBBadge
                      color="info"
                      className="mr-2 cursor-pointer"
                      onClick={() =>
                        setSelected({ ...deal, updatedKey: "category" })
                      }
                    >
                      {capitalize(
                        deal.category === "walkin"
                          ? deal.category
                          : Categories.find(
                              ({ abbr }) => abbr === deal.category
                            ).name
                      )}
                    </MDBBadge>
                  )}
                  @ {new Date(deal.createdAt).toLocaleTimeString()}
                </td>
                <td>
                  {selected?._id === deal?._id &&
                  selected.updatedKey === "source" ? (
                    <div
                      style={{
                        width: "17rem",
                        marginBottom: "-0.7rem",
                      }}
                      className="mt-2 d-flex align-items-center"
                    >
                      <Select
                        label={"Source"}
                        onChange={(value) =>
                          setSelected({ ...selected, newSource: value })
                        }
                        whitelisted
                        className="m-0 p-0 mt-3"
                        collections={sources.map(({ clients }) => ({
                          _id: clients._id,
                          text: `${clients?.displayname?.toUpperCase()}`,
                        }))}
                        preValue={deal?.source?._id}
                        handleCheck={() =>
                          handleUpdate("source._id", "newSource", deal)
                        }
                        handleClose={() => setSelected({})}
                        soloUpdate
                        formSubmitted={formSubmitted}
                        keys={"_id"}
                        values={"text"}
                      />
                    </div>
                  ) : (
                    <div>
                      <small className="mr-1 grey-text">Source:</small>
                      <h6
                        className="cursor-pointer"
                        onClick={() =>
                          setSelected({ ...deal, updatedKey: "source" })
                        }
                      >
                        {sourceName || "N/A"}
                      </h6>
                    </div>
                  )}

                  {selected._id === deal._id &&
                  selected.updatedKey === "physician" ? (
                    <div style={{ width: "19rem" }}>
                      <Select
                        label={"Physician"}
                        onChange={(value) =>
                          setSelected({ ...selected, newPhysician: value })
                        }
                        whitelisted
                        className="m-0 p-0 mt-3"
                        // collections={getPhysicians(deal?.source?._id)}
                        collections={Deals.getPhysicians(
                          deal?.source._id,
                          sources
                        )}
                        preValue={deal.physicianId?._id}
                        formSubmitted={formSubmitted}
                        keys={"value"}
                        values={"text"}
                        soloUpdate
                        handleClose={() => setSelected({})}
                        handleCheck={() =>
                          handleUpdate("physicianId._id", "newPhysician")
                        }
                      />
                    </div>
                  ) : (
                    <div
                      className="cursor-pointer"
                      onClick={() => {
                        if (!deal?.source)
                          return addToast(
                            "Please add a source before adding a physician.",
                            {
                              appearance: "warning",
                            }
                          );
                        setSelected({ ...deal, updatedKey: "physician" });
                      }}
                    >
                      <small className="mr-1 grey-text">Physician:</small>
                      {deal?.physicianId?.fullName?.lname ? (
                        <h6>Dr. {deal?.physicianId?.fullName?.lname}</h6>
                      ) : (
                        <h6 className="cursor-pointer">N/A</h6>
                      )}
                    </div>
                  )}
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
                      />
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
                    />
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
