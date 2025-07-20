import { useEffect, useState } from "react";
import { useDispatch, useSelector } from "react-redux";
import {
  capitalize,
  currency,
  Deals,
} from "../../../../../../../services/utilities";
import {
  MANAGERUPDATE,
  RESET,
  SetREVERT,
  SetSORTING,
  UPDATE_INFO,
} from "../../../../../../../services/redux/slices/commerce/pos/services/deals";
import { useToasts } from "react-toast-notifications";

import Swal from "sweetalert2";
import Months from "../../../../../../../services/fakeDb/calendar/months";

import { MDBCardBody, MDBTable, MDBIcon } from "mdbreact";
import "../style.css";
import Patient from "./patient";

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
      return capitalize(physicianId?.fullName?.lname);
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

            const isMatch = (key) =>
              selected?._id === deal?._id && selected.updatedKey === key;
            const isPhysicianEdit = isMatch("physician");
            return (
              <Patient
                setDidHoverID={setDidHoverID}
                deal={deal}
                isPhysicianEdit={isPhysicianEdit}
                index={index}
                isDiscounted={isDiscounted}
                isDeleted={isDeleted}
                isHover={isHover}
                sourceName={sourceName}
                selected={selected}
                showingPhysician={showingPhysician}
                setSelected={setSelected}
                getSourceForPhysician={getSourceForPhysician}
                getPhysicians={getPhysicians}
                handleDelete={handleDelete}
                handleRevert={handleRevert}
                handleUpdatePrice={handleUpdatePrice}
                handleUpdate={handleUpdate}
                onSave={onSave}
              />
            );
          })}
        </tbody>
      </MDBTable>
    </MDBCardBody>
  );
};

export default Tables;
