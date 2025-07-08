import React, { useEffect, useState } from "react";
import { useDispatch, useSelector } from "react-redux";
import {
  currency,
  Deals,
  fullName,
  getGenderIcon,
  paymentMethod,
} from "./../../../../../../services/utilities";
import { Categories, HMO } from "./../../../../../../services/fakeDb";
import {
  MANAGERUPDATE,
  SetDISCOUNT,
  RESET,
  SetREVERT,
  SetSORTING,
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
import { Input, Select } from "../../../../../../components/customizable";
import EditableField from "../../../../../../components/customizable/editableField";

export const Tables = () => {
  const { token, auth } = useSelector(({ auth }) => auth),
    { refined, maxPage, activePage, formSubmitted, isSuccess } = useSelector(
      ({ deals }) => deals
    ),
    { collections: sources } = useSelector(({ providers }) => providers),
    [deals, setDeals] = useState([]),
    [sorts, setSorts] = useState(["time"]),
    [total, setTotal] = useState(0),
    [selected, setSelected] = useState({}),
    [patient, setPatient] = useState(0),
    [didHoverID, setDidHoverID] = useState(-1),
    { addToast } = useToasts(),
    dispatch = useDispatch();

  useEffect(() => {
    if (!formSubmitted && isSuccess) {
      dispatch(RESET());
      setSelected({});
    }
  }, [dispatch, formSubmitted, isSuccess]);

  useEffect(() => {
    if (refined?.length > 0) {
      setDeals(refined);
    }
  }, [refined]);

  useEffect(() => {
    const validTransactions = [...deals].filter((item) => !item.deletedAt);
    setTotal(validTransactions.reduce((a, b) => a + b.amount, 0));
    setPatient(validTransactions.length);
  }, [deals]);

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
      selected: selected?._id ? selected : deal,
      deal,
      setSelected,
      token,
      sources,
      dispatch,
      addToast,
    });
  };

  const itemsPerPage = maxPage; // Number of items per page
  const startIndex = (activePage - 1) * itemsPerPage;
  const endIndex = startIndex + itemsPerPage;
  const paginatedData = deals?.slice(startIndex, endIndex); // Get only items for the active page

  const sorting = (sortBy) => dispatch(SetSORTING(sortBy));
  const handleSort = (sortBy) => {
    const _sorts = [...sorts];
    const index = _sorts.findIndex((exist) => exist === sortBy);
    if (index > -1) {
      _sorts.splice(index, 1);
      if (_sorts.length > 0) sorting(_sorts[0]);
    } else {
      if (_sorts.length === 2) {
        _sorts.splice(0, 1);
        _sorts.push(sortBy);
        sorting(sortBy);
      } else {
        _sorts.push(sortBy);
        sorting(sortBy);
      }
    }
    setSorts(_sorts);
  };

  const handleColor = (sortBy) => {
    if (sorts.length === 1 && sortBy === sorts[0]) return "#007bff";
    if (sorts[0] === sortBy) return "#17a2b8"; //secondary sort
    if (sorts[1] === sortBy) return "#007bff"; //primary sort
    return "";
  };

  const handleUpdatePrice = (data) => {
    const { amount, newAmount } = data;
    const discount = amount - newAmount;
    Swal.fire({
      title: "<strong>Confirm Discount</strong>",
      html: `
      <div style="font-size: 1.1rem; text-align: left; padding: 0.5rem 0.2rem;">
        <table style="width: 100%; border-collapse: collapse;">
          <tr>
            <td><strong>Old Amount:</strong></td>
            <td style="text-align: right;">${currency(amount)}</td>
          </tr>
          <tr>
            <td><strong>Discount:</strong></td>
            <td style="text-align: right; color: red;">-${currency(
              discount
            )}</td>
          </tr>
          <tr><td colspan="2"><hr /></td></tr>
          <tr>
            <td><strong>New Amount:</strong></td>
            <td style="text-align: right; color: green;"><strong>₱${currency(
              newAmount
            )}</strong></td>
          </tr>
        </table>
        <p style="margin-top: 1.5rem; font-size: 1rem; color: #444;">
          Are you sure you want to apply this discount?
        </p>
      </div>
    `,
      icon: "warning",
      showCancelButton: true,
      confirmButtonColor: "#007bff",
      cancelButtonColor: "#6c757d",
      confirmButtonText: "Yes, apply discount",
      cancelButtonText: "Cancel",
    }).then((result) => {
      if (result.isConfirmed) {
        dispatch(
          MANAGERUPDATE({
            token,
            key: {
              _id: data._id,
              amount: newAmount,
              discount: amount - newAmount,
              authorizedBy: auth._id,
            },
          })
        ).then(() => {
          Swal.fire({
            title: "Discount Applied!",
            html: `
          <p style="font-size: 1.1rem;">
            A discount of <strong style="color: red;">${currency(
              discount
            )}</strong> has been successfully applied.
          </p>
          <p style="font-size: 1rem;">New total: <strong style="color: green;">${currency(
            newAmount
          )}</strong></p>
        `,
            icon: "success",
            confirmButtonColor: "#28a745",
          });
        });
      }
    });
  };

  console.log("filtered", deals);

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

      <MDBTable style={{ marginTop: "-5px" }} small hover>
        <thead>
          <tr style={{ marginTop: "-5rem" }}>
            <th>
              <div className="d-flex align-items-center">
                Patient
                <MDBIcon
                  onClick={() => handleSort("patient")}
                  style={{ color: handleColor("patient") }}
                  icon="sort"
                  title="Sort by Patient"
                  className="ml-1 mr-2 cursor-pointer"
                />
                / Time{" "}
                <MDBIcon
                  icon="sort"
                  title="Sort by Time"
                  className="ml-1 cursor-pointer"
                  style={{ color: handleColor("time") }}
                  onClick={() => handleSort("time")}
                />
              </div>
            </th>
            <th>SSX</th>
            <th>
              <div className="d-flex">
                <div className="d-flex mr-2 align-items-center">
                  Source{" "}
                  <MDBIcon
                    icon="sort"
                    title="Sort by Source"
                    className="ml-1 cursor-pointer"
                    style={{ color: handleColor("source") }}
                    onClick={() => handleSort("source")}
                  />
                </div>
                /
                <div className="d-flex align-items-center ml-1">
                  Physician
                  <MDBIcon
                    icon="sort"
                    title="Sort by Physician"
                    className="ml-1 cursor-pointer"
                    style={{ color: handleColor("physician") }}
                    onClick={() => handleSort("physician")}
                  />
                </div>
              </div>
            </th>
            <th>Amount</th>
            <th>Services</th>
            <th>
              <div className="d-flex align-items-center ml-1">
                Card
                <MDBIcon
                  icon="sort"
                  title="Sort by Physician"
                  className="ml-1 cursor-pointer"
                  style={{ color: handleColor("card") }}
                  onClick={() => handleSort("card")}
                />
              </div>
            </th>
          </tr>
        </thead>
        <tbody>
          {paginatedData?.map((deal, index) => {
            const isDeleted = !!deal.deletedAt;
            const isDiscounted = deal.discount > 0;
            const isHover = index === didHoverID;
            const sourceName = deal.source?.displayname || deal.source?.name;
            const {
              img = "",
              style = {},
              text = "",
            } = paymentMethod.getImage(deal?.payment);

            return (
              <React.Fragment key={`sales-${index + 1}`}>
                <tr
                  onMouseEnter={() => setDidHoverID(index)}
                  onMouseLeave={() => setDidHoverID(-1)}
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
                        {deal.category === "walkin"
                          ? deal?.category
                          : Categories?.find(
                              (c) => c?.abbr === deal?.category
                            ).abbr?.toUpperCase()}
                      </MDBBadge>
                    )}
                    @ {new Date(deal.createdAt).toLocaleTimeString()}
                  </td>
                  <td>
                    {selected._id === deal._id &&
                    selected?.updatedKey === "ssx" ? (
                      <div
                        style={{ width: "17rem" }}
                        className="mt-3 d-flex align-items-center"
                      >
                        <Input
                          label={"SSX"}
                          selected={selected}
                          onChange={(_key, value) =>
                            setSelected({ ...selected, [_key]: value })
                          }
                          _key="newSSX"
                          handleCheck={() => handleUpdate("ssx", "newSSX")}
                          handleClose={() => setSelected({})}
                          formSubmitted={formSubmitted}
                          isSuccess={isSuccess}
                          className="form-control form-control-sm"
                        />
                      </div>
                    ) : (
                      <span
                        className="cursor-pointer"
                        style={{ fontWeight: 400 }}
                        onClick={() =>
                          setSelected({
                            ...deal,
                            updatedKey: "ssx",
                            newSSX: deal.ssx,
                          })
                        }
                      >
                        {deal.ssx || "--"}
                      </span>
                    )}
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
                          allowObjectValue
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
                      <EditableField
                        displayStyle={{
                          marginTop: "0.5rem",
                          fontWeight: "bold",
                          marginRight: "0.2rem",
                        }}
                        className="form-control form-control-sm mb-1"
                        keyForValue="newAmount"
                        fieldData={{ _id: deal._id, newAmount: deal.amount }}
                        onSave={(data) => {
                          handleUpdatePrice({ ...data, ...deal });
                        }}
                        formSubmitted={formSubmitted}
                        isSuccess={isSuccess}
                        isMoney
                      />

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
                    {deal.payment !== "voucher" && (
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
                    )}
                  </td>
                  <td>
                    {deal.cart?.map((menu) => (
                      <MDBBadge
                        key={menu.referenceId}
                        className="mx-1"
                        title={menu?.packages}
                      >
                        {menu?.abbreviation}
                      </MDBBadge>
                    ))}
                  </td>
                  <td>
                    {!isHover ? (
                      HMO.getName(deal.hmo)
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
                {deal.remarks && (
                  <tr>
                    <td colSpan={6}>Remarks: asdfasdf</td>
                  </tr>
                )}
              </React.Fragment>
            );
          })}
        </tbody>
      </MDBTable>
    </MDBCardBody>
  );
};

export default Tables;
