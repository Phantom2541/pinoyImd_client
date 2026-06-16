import { useEffect, useMemo, useState } from "react";
import { useDispatch, useSelector } from "react-redux";
import {
  MDBAnimation,
  MDBBadge,
  MDBBtn,
  MDBCard,
  MDBCardBody,
  MDBCardHeader,
  MDBCol,
  MDBIcon,
  MDBInputGroup,
  MDBRow,
} from "mdbreact";
import TableLoading from "../../../../components/tableLoading";
import { SearchClinicMenus } from "../../../../components/searchables";
import {
  BROWSE,
  RemoveSettledAppointment,
  SetSelectedAppointment,
} from "../../../../services/redux/slices/diagnostics/clinic/clinicalBilling";
import {
  ChangeQty,
  SAVE,
  SetCART,
} from "../../../../services/redux/slices/diagnostics/clinic/settlements";
import Spinner from "../../../../components/spinner";
import {
  computeCP,
  currency,
  fullName,
} from "../../../../services/utilities";
import { formatScheduleLabel } from "../../../../services/redux/slices/diagnostics/clinic/appointments";
import "../appointment/transaction/menus/style.css";
import "../../cashier/cashRegistry/services/cashier/style.css";

const Billing = () => {
  const dispatch = useDispatch();
  const { token, activePlatform, auth } = useSelector(({ auth }) => auth);
  const {
    collections,
    selectedAppointment,
    selectedAppointmentId,
    isLoading,
  } = useSelector(({ clinicalBilling }) => clinicalBilling);
  const { cart = [], formSubmitted } = useSelector(
    ({ settlements }) => settlements,
  );
  const [payment, setPayment] = useState("cash");
  const [cash, setCash] = useState(0);

  useEffect(() => {
    if (!token || !activePlatform?.branch) return;

    const physicianIds =
      activePlatform.branch.physicians?.map(({ _id }) => _id).filter(Boolean) ||
      [];
    const secretaryId = auth?._id || "";
    const branchId =
      activePlatform?.branchId || activePlatform?.branch?._id || "";

    if (!secretaryId && !physicianIds.length) return;

    dispatch(
      BROWSE({
        token,
        data: {
          ...(secretaryId ? { secretaryId } : {}),
          ...(branchId ? { branchId } : {}),
          ...(physicianIds.length ? { physicianIds } : {}),
        },
      }),
    );
  }, [dispatch, token, activePlatform, auth]);

  useEffect(() => {
    dispatch(SetCART([]));
    setPayment("cash");
    setCash(0);
  }, [dispatch, selectedAppointmentId]);

  const handleAddToCart = (item) => {
    const exists = cart.some(({ _id }) => String(_id) === String(item?._id));

    if (exists) return;

    dispatch(SetCART([...cart, { ...item, qty: 1 }]));
  };

  const handleChangeQty = (index, value) => {
    dispatch(ChangeQty({ index, value }));
  };

  const handleRemove = (index) => {
    const nextCart = [...cart];
    nextCart.splice(index, 1);
    dispatch(SetCART(nextCart));
  };

  const appointmentOptions = useMemo(
    () =>
      collections.map((item) => ({
        value: item?._id,
        label: `${fullName(item?.patient?.fullName)} | ${item?.clinicTitle || "Clinic"} | QN ${item?.qn || "--"}`,
      })),
    [collections],
  );

  const { gross, discount, net } = computeCP(cart);
  const clinic = selectedAppointment?.clinic || {};
  const physicianName = fullName(
    selectedAppointment?.physician?.fullName ||
      selectedAppointment?.physician?.user?.fullName,
  );

  const handleSubmit = (e) => {
    e.preventDefault();
    if (!selectedAppointment?._id || !selectedAppointment?.patient?._id) return;

    const items = cart.map((item) => {
      const { discount: itemDiscount, up, net: itemNet } = computeCP(item);
      return {
        menu: item._id,
        srp: up,
        discount: itemDiscount,
        amount: itemNet,
        qty: item.qty,
      };
    });

    const settlement = {
      cart: items,
      userId: auth._id,
      patient: selectedAppointment.patient._id,
      appointment: selectedAppointment._id,
      consultation: selectedAppointment?.consultation?._id,
      payment,
      discount,
      cash,
      amount: net,
    };

    dispatch(SAVE({ data: settlement, token })).then((action) => {
      if (!action?.payload?.payload?.appointment?._id) return;

      dispatch(
        RemoveSettledAppointment(action.payload.payload.appointment._id),
      );
      dispatch(SetCART([]));
      setPayment("cash");
      setCash(0);
    });
  };

  return (
    <MDBAnimation type="fadeIn">
      <MDBCard narrow className="pb-3">
        <MDBCardHeader className="d-flex flex-wrap align-items-center justify-content-between">
          <div>
            <strong>Consultation Billing</strong>
            <div className="small text-muted">
              POS-style billing for completed consultations waiting for payment.
            </div>
          </div>
          <div style={{ minWidth: "24rem", maxWidth: "100%" }}>
            <select
              className="form-control"
              value={selectedAppointmentId || ""}
              onChange={({ target }) =>
                dispatch(SetSelectedAppointment(target.value))
              }
            >
              <option value="">Select patient consultation</option>
              {appointmentOptions.map((option) => (
                <option key={option.value} value={option.value}>
                  {option.label}
                </option>
              ))}
            </select>
          </div>
        </MDBCardHeader>

        <MDBCardBody>
          {isLoading ? (
            <TableLoading />
          ) : (
            <MDBRow>
              <MDBCol md="7" className="mb-4">
                <div className="border rounded p-3 h-100 bg-white">
                  <div className="d-flex flex-wrap align-items-start justify-content-between mb-3">
                    <div>
                      <div className="font-weight-bold">
                        {selectedAppointment
                          ? fullName(selectedAppointment?.patient?.fullName)
                          : "No patient selected"}
                      </div>
                      <div className="text-muted small">
                        {clinic?.title || "Select a completed consultation first"}
                      </div>
                    </div>
                    {selectedAppointment && (
                      <MDBBadge color="success">
                        Ready for Payment
                      </MDBBadge>
                    )}
                  </div>

                  {selectedAppointment ? (
                    <>
                      <div className="small text-muted mb-3">
                        <div>Doctor: {physicianName ? `Dr. ${physicianName}` : "--"}</div>
                        <div>
                          Schedule:{" "}
                          {selectedAppointment?.sched
                            ? formatScheduleLabel(selectedAppointment.sched)
                            : "--"}
                        </div>
                        <div>Queue No: {selectedAppointment?.qn || "--"}</div>
                      </div>

                      <div className="mb-3">
                        <SearchClinicMenus
                          setMenu={handleAddToCart}
                          clinic={selectedAppointment?.clinicId}
                        />
                      </div>

                      <table className="menus-clinic-table">
                        <thead>
                          <tr>
                            <th className="text-left">Menus</th>
                            <th style={{ width: "75px" }}>UP</th>
                            <th style={{ width: "90px" }}>Qty</th>
                            <th style={{ width: "90px" }}>Total</th>
                          </tr>
                        </thead>
                        <tbody>
                          {!cart.length && (
                            <tr>
                              <td colSpan="4" className="menus-empty">
                                <span>Select clinic menus to start billing.</span>
                              </td>
                            </tr>
                          )}
                          {cart.map((item, index) => {
                            const { _id, description, abbreviation, qty = 1 } = item;
                            const { up, gross: lineTotal } = computeCP(item);

                            return (
                              <tr key={`${_id}-${index}`}>
                                <td className="text-left">
                                  <span>
                                    {description ? `${description} - ` : ""}
                                    {abbreviation}
                                  </span>
                                </td>
                                <td>{currency.format(up)}</td>
                                <td className="menus-clinic-qty">
                                  <MDBInputGroup
                                    type="number"
                                    value={String(qty)}
                                    className="text-center border border-light"
                                    min="1"
                                    onChange={({ target }) => {
                                      const filteredValue = target.value.replace(
                                        /[^0-9]/g,
                                        "",
                                      );
                                      let quantity = Number(filteredValue || 1);
                                      if (quantity < 1) quantity = 1;
                                      handleChangeQty(index, quantity);
                                    }}
                                    size="sm"
                                    prepend={
                                      <MDBBtn
                                        className="m-0 px-2 py-0"
                                        size="sm"
                                        color="light"
                                        onClick={() =>
                                          handleChangeQty(
                                            index,
                                            qty === 1 ? 1 : qty - 1,
                                          )
                                        }
                                        style={{ boxShadow: "0px 0px 0px 0px" }}
                                        outline
                                      >
                                        <MDBIcon
                                          icon="minus"
                                          style={{ color: "black" }}
                                        />
                                      </MDBBtn>
                                    }
                                    append={
                                      <MDBBtn
                                        className="m-0 px-2 py-0"
                                        size="sm"
                                        color="light"
                                        onClick={() => handleChangeQty(index, qty + 1)}
                                        style={{ boxShadow: "0px 0px 0px 0px" }}
                                        outline
                                      >
                                        <MDBIcon
                                          icon="plus"
                                          style={{ color: "black" }}
                                        />
                                      </MDBBtn>
                                    }
                                  />
                                </td>
                                <td>
                                  <span className="text menus-up">
                                    {currency.format(lineTotal)}
                                  </span>
                                  <button
                                    onClick={() => handleRemove(index)}
                                    className="menus-clinic-button-delete"
                                  >
                                    <MDBIcon icon="trash" />
                                  </button>
                                </td>
                              </tr>
                            );
                          })}
                        </tbody>
                      </table>
                    </>
                  ) : (
                    <div className="text-center text-muted py-5">
                      <MDBIcon icon="cash-register" size="2x" className="mb-3" />
                      <div>Select a completed consultation from the dropdown.</div>
                    </div>
                  )}
                </div>
              </MDBCol>

              <MDBCol md="5" className="mb-4">
                <div className="border rounded p-3 h-100 bg-white">
                  <form onSubmit={handleSubmit}>
                    <table className="summary-table w-100">
                      <thead>
                        <tr>
                          <th colSpan="2" className="th-custom">
                            Summary
                          </th>
                        </tr>
                      </thead>
                      <tbody>
                        <tr>
                          <td>Gross Amount</td>
                          <td className="table-price text-right">
                            {currency.format(gross)}
                          </td>
                        </tr>
                        <tr>
                          <td>Discount</td>
                          <td className="table-price text-right">
                            {currency.format(discount)}
                          </td>
                        </tr>
                        <tr>
                          <td>Net Amount</td>
                          <td className="table-price text-right">
                            {currency.format(net)}
                          </td>
                        </tr>
                        <tr>
                          <td>Payment</td>
                          <td className="p-0">
                            <select
                              value={payment}
                              onChange={({ target }) => setPayment(target.value)}
                              className="form-control"
                            >
                              {["cash", "gcash"].map((item) => (
                                <option key={item} value={item}>
                                  {item.toUpperCase()}
                                </option>
                              ))}
                            </select>
                          </td>
                        </tr>
                        <tr>
                          <td colSpan="2">
                            {payment === "cash" ? (
                              <input
                                type="number"
                                min={net || 0}
                                value={String(cash)}
                                onChange={({ target }) =>
                                  setCash(Number(target.value))
                                }
                                placeholder="Amount in Peso"
                                required
                                name="amount"
                                className="form-control"
                              />
                            ) : (
                              <div className="text-muted small">
                                No cash input needed for this payment type.
                              </div>
                            )}
                          </td>
                        </tr>
                      </tbody>
                    </table>

                    <MDBBtn
                      type="submit"
                      className="m-0 w-100 fw-bold mt-3"
                      disabled={
                        !selectedAppointment || cart.length === 0 || formSubmitted
                      }
                      color="success"
                    >
                      Complete Billing <Spinner formSubmitted={formSubmitted} />
                    </MDBBtn>
                  </form>
                </div>
              </MDBCol>
            </MDBRow>
          )}
        </MDBCardBody>
      </MDBCard>
    </MDBAnimation>
  );
};

export default Billing;
