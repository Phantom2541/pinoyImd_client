import React, { useEffect, useState } from "react";
import { useDispatch, useSelector } from "react-redux";
import {
  capitalize,
  currency,
  Deals,
  fullName,
  getGenderIcon,
  paymentMethod,
} from "./../../../../../../services/utilities";
import { Categories, HMO } from "./../../../../../../services/fakeDb";
import {
  MANAGERUPDATE,
  RESET,
  SetREVERT,
  SetSORTING,
  UPDATE_INFO,
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
import EditableField from "../../../../../../components/customizable/editableField";
import EditableSelect from "../../../../../../components/customizable/editableSelect";
import PickPhysician from "../../../../../../components/searchables/physicians/pickPhysician";

export const Tables = () => {
  const { token, auth, activePlatform } = useSelector(({ auth }) => auth),
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
            <td style="text-align: right;">${currency.format(amount)}</td>
          </tr>
          <tr>
            <td><strong>Discount:</strong></td>
            <td style="text-align: right; color: red;">-${currency.format(
              discount
            )}</td>
          </tr>
          <tr><td colspan="2"><hr /></td></tr>
          <tr>
            <td><strong>New Amount:</strong></td>
            <td style="text-align: right; color: green;"><strong>₱${currency.format(
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
            A discount of <strong style="color: red;">${currency.format(
              discount
            )}</strong> has been successfully applied.
          </p>
          <p style="font-size: 1rem;">New total: <strong style="color: green;">${currency.format(
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

  const onSave = (editedData) => {
    dispatch(
      UPDATE_INFO({
        data: { ...editedData, updatedKey: editedData.editingKey },
        token,
      })
    );
  };

  const getPhysicians = (fk) => {
    return (
      [...sources].find(({ clients }) => clients._id === fk)?.clients
        ?.affiliated || []
    );
  };

  const getSourceForPhysician = (sourceId) => {
    const source = [...sources].find(({ clients }) => clients._id === sourceId);

    if (!source?._id) return {};
    return { _id: source?._id, branch: source?.clients?._id };
  };

  const showingPhysician = (deal) => {
    const { physicianId = {}, physicianSTR = "" } = deal;
    const physician = () => {
      if (!physicianId?._id) return capitalize(physicianSTR);
      return physicianId?.fullName?.lname;
    };

    return physicianId ? (
      <h6>Dr. {physician()}</h6>
    ) : (
      <h6 className="cursor-pointer">N/A</h6>
    );
  };

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
          {currency.format(total)}
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

            const isMatch = (key) =>
              selected?._id === deal?._id && selected.updatedKey === key;
            const isPhysicianEdit = isMatch("physician");

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
                  <td className="position-relative">
                    <div className="d-flex align-items-center">
                      <h6>{getGenderIcon(deal?.customerId?.isMale)} </h6>
                      <h6>{fullName(deal?.customerId?.fullName)}</h6>
                    </div>
                    <div className="d-flex align-items-center">
                      <EditableSelect
                        isEditable={true}
                        collections={Categories.map(({ name, abbr }) => ({
                          category: abbr,
                          name,
                        }))}
                        preValue={deal.category}
                        displayTag="span"
                        classNameTxt="badge bg-info"
                        className="m-0 mb-n2 p-0"
                        keyForValue="category"
                        keyForText="name"
                        fieldData={{
                          _id: deal?._id,
                          category: deal?.category,
                          name: deal?.category,
                        }}
                        onSave={(data) => {
                          const { name, ...rest } = data;
                          onSave(rest);
                        }}
                        animationStyle={{ width: "17rem" }}
                        formSubmitted={formSubmitted}
                        isSuccess={isSuccess}
                        animation
                      />
                      <span className="ml-2">
                        @ {new Date(deal.createdAt).toLocaleTimeString()}
                      </span>
                    </div>
                  </td>
                  <td className="position-relative">
                    <div style={{ minWidth: "8rem" }}>
                      <EditableField
                        fieldData={{ _id: deal?._id, ssx: deal?.ssx }}
                        keyForValue="ssx"
                        placeholder="SSX"
                        displayTag="h6"
                        onSave={(data) => onSave(data)}
                        animationStyle={{ width: "17rem" }}
                        displayStyle={{ fontSize: "14px" }}
                        animation
                        formSubmitted={formSubmitted}
                        isSuccess={isSuccess}
                      />
                    </div>
                  </td>
                  <td className="position-relative">
                    <small className="mr-1 grey-text">Source:</small>
                    <div style={{ minHeight: "27px" }}>
                      <EditableSelect
                        isEditable={true}
                        collections={sources.map(({ clients }) => ({
                          source: clients._id,
                          text: `${clients?.displayname?.toUpperCase()}`,
                        }))}
                        preValue={deal.source._id}
                        displayTag="h6"
                        className="m-0 mb-n2 p-0"
                        keyForValue="source"
                        keyForText="text"
                        fieldData={{
                          _id: deal?._id,
                          source: deal?.source?._id,
                          text: sourceName,
                        }}
                        onSave={(data) => {
                          const { text, ...rest } = data;
                          onSave(rest);
                        }}
                        formSubmitted={formSubmitted}
                        animationStyle={{ width: "17rem" }}
                        animation
                        isSuccess={isSuccess}
                        selectStyle={{ width: "17rem" }}
                      />
                    </div>
                    <div
                      style={{
                        width: "19rem",
                        opacity: isPhysicianEdit ? 1 : 0,
                        zIndex: isPhysicianEdit ? 2 : -1,
                      }}
                      className={`position-absolute mt-3 py-1 ${
                        isPhysicianEdit && "deals-zoom-in"
                      }`}
                    >
                      {isPhysicianEdit && (
                        <PickPhysician
                          defaultValue={
                            !deal?.physicianId?._id
                              ? deal?.physicianSTR
                              : fullName(deal?.physicianId?.fullName)
                          }
                          classNameInput="deals-zoom-in-input-physician "
                          formSubmitted={formSubmitted}
                          isEditable
                          suggested={getPhysicians(deal.source._id)}
                          source={getSourceForPhysician(deal?.source?._id)}
                          onChange={(value) =>
                            setSelected({
                              ...selected,
                              newPhysician: {
                                ...value,
                                branch: activePlatform?.branchId,
                                source: getSourceForPhysician(
                                  deal?.source?._id
                                ),
                              },
                            })
                          }
                          handleCheck={() =>
                            handleUpdate("physicianId._id", "newPhysician")
                          }
                          handleClose={() => setSelected({})}
                        />
                      )}
                    </div>
                    <div
                      className="cursor-pointer"
                      style={{
                        opacity: isPhysicianEdit ? 0 : 1,
                      }}
                      onClick={() => {
                        setSelected({ ...deal, updatedKey: "physician" });
                      }}
                    >
                      <small className="mr-1 grey-text">Physician:</small>
                      {showingPhysician(deal)}
                    </div>
                  </td>

                  <td style={{ fontWeight: 400 }} className="position-relative">
                    <div className="d-flex align-items-center">
                      <div style={{ minHeight: "36px", minWidth: "42px" }}>
                        <EditableField
                          animationStyle={{ width: "7rem" }}
                          animation
                          displayStyle={{
                            marginTop: "0.5rem",
                            fontWeight: "bold",
                            marginRight: "0.2rem",
                          }}
                          className="form-control form-control-sm mb-1"
                          placeholder="Amount"
                          keyForValue="newAmount"
                          fieldData={{ _id: deal._id, newAmount: deal.amount }}
                          onSave={(data) => {
                            handleUpdatePrice({ ...data, ...deal });
                          }}
                          formSubmitted={formSubmitted}
                          isSuccess={isSuccess}
                          isMoney
                        />
                      </div>

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
                    {/* <p style={{ fontWeight: 500 }}>{currency.format(deal.amount)}</p> */}
                    {isDiscounted && (
                      <p
                        style={{ color: "red", marginTop: "-0.2rem" }}
                        title="Discount"
                        className="d-flex align-items-center"
                      >
                        {currency.format(deal.discount)}
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
                        {currency.format(deal.cash)}
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
                        title={menu?.packagesDisplay}
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
                              <button
                                onClick={() => handleDelete(deal)}
                                title="Delete Sale"
                                className="mr-1 "
                                style={{
                                  background: "red",
                                  border: "none",

                                  color: "white",
                                  borderRadius: "4px",
                                  boxShadow: "0 0px 7px  rgba(0, 0, 0, 0.2)",
                                  padding: "5px 8px",
                                  cursor: "pointer",
                                  transition: "all 0.2s",
                                }}
                              >
                                <MDBIcon icon="trash" />
                              </button>
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
                    <td colSpan={6}>Remarks: {deal.remarks}</td>
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
