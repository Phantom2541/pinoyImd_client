import React, { useState, useEffect } from "react";
import { useDispatch, useSelector } from "react-redux";
import {
  MDBModal,
  MDBModalBody,
  MDBIcon,
  MDBModalHeader,
  MDBTable,
  MDBTableHead,
  MDBTableBody,
  MDBBtn,
  MDBRow,
  MDBCol,
  MDBInput,
  MDBCardBody,
} from "mdbreact";
import {
  TOGGLE,
  SetLEDGER,
} from "../../../../../../services/redux/slices/finance/bookkeeping/remittances";
import {
  SAVE,
  RESET,
} from "../../../../../../services/redux/slices/finance/bookkeeping/ledger";
import { currency, fullName } from "../../../../../../services/utilities";
import Breakdown from "./breakdown";

export default function Modal() {
  const { token, activePlatform, auth } = useSelector(({ auth }) => auth),
    { showModal, title, selected } = useSelector(
      ({ remittances }) => remittances
    ),
    { isLoading, isSuccess } = useSelector(({ ledger }) => ledger),
    [floating, setFloating] = useState({ bills: {}, coins: {} }),
    [schedule, setSchedule] = useState("morning"),
    [position, setPosition] = useState(0),
    [location, setLocation] = useState("reception"),
    dispatch = useDispatch();

  useEffect(() => {
    if (showModal && !isLoading && isSuccess) {
      dispatch(TOGGLE());
      dispatch(RESET());
    }
  }, [showModal, isLoading, isSuccess, dispatch]);

  useEffect(() => {
    if (showModal) {
      const { bills = {}, coins = {} } = selected?.closing || {};
      setFloating({ bills, coins });
      console.log("denominations", bills, coins);
    }
  }, [showModal, title, selected]);

  const handleSubmit = () => {
    const { sales, _id, cashier, createdAtNow } = selected;

    dispatch(
      SAVE({
        token,
        data: {
          remittanceID: _id,
          branchId: activePlatform?.branchId,
          userId: auth._id,
          fsid: 1,
          amount: sales,
          breakdown: {
            cashierId: cashier._id,
            amount: sales,
            collector: auth._id,
            createdAt: new Date(),
          },
          createdAt: createdAtNow,
        },
      })
    )
      .then(({ payload }) => {
        const { payload: data } = payload;
        dispatch(TOGGLE({ key: "closed" }));
        dispatch(SetLEDGER(data)); // depende sa structure ng res
      })
      .catch((err) => {
        console.error("Error saving remittance:", err);
      });
  };
  return (
    <>
      <MDBModal
        isOpen={showModal}
        toggle={() => dispatch(TOGGLE({ key: "closed" }))}
        size="xl"
        backdrop
      >
        <MDBModalHeader
          toggle={() => dispatch(TOGGLE({ key: "closed" }))}
          className="darken-3 light-blue white-text py-4"
          style={{ width: "100%", position: "relative" }}
        >
          <div
            className="d-flex justify-content-between align-items-center px-5"
            style={{
              width: "100%",
              padding: "0 20px",
              position: "absolute",
              top: "50%",
              left: "50%",
              transform: "translate(-50%,-50%)",
            }}
          >
            <div>
              <MDBIcon icon="user" className="mr-2" />
              <span style={{ fontSize: "1.4rem" }}>
                {fullName(selected?.cashier?.fullName)}
              </span>
            </div>
            <div className="d-flex align-items-center ">
              <MDBIcon icon="calendar-alt" className="mr-2" />
              <span style={{ fontSize: "1.4rem", fontWeight: "400" }}>
                Remittance ({currency.format(selected?.coh || 0)})
              </span>
            </div>
          </div>
        </MDBModalHeader>

        <MDBModalBody className="mb-0">
          <MDBRow>
            <MDBCol md="8">
              <h5 className="text-center font-weight-bold">Bills</h5>
              <MDBTable style={{ border: "none !important" }}>
                <MDBTableHead>
                  <tr>
                    <th className="text-center">Denomination</th>
                  </tr>
                </MDBTableHead>
                <MDBTableBody>
                  <MDBTableBody>
                    {currency.Denominations.bills
                      .filter((bill) => floating.bills?.[bill])
                      .reduce((rows, bill, index, arr) => {
                        if (index % 2 === 0) {
                          rows.push([bill, arr[index + 1] || null]);
                        }
                        return rows;
                      }, [])
                      .map(([bill1, bill2], idx) => (
                        <tr key={`row-${idx}`}>
                          {/* Bill 1 */}
                          <td className="text-center">
                            <div
                              style={{
                                position: "relative",
                                width: "fit-content",
                                overflow: "hidden",
                              }}
                            >
                              <MDBCardBody className="m-0 p-0">
                                <div
                                  style={currency.getBill(Number(bill1))}
                                  title={currency.format(bill1)}
                                />
                              </MDBCardBody>
                              {floating?.bills?.[bill1] > 0 && (
                                <span
                                  className="badge badge-primary"
                                  style={{
                                    position: "absolute",
                                    top: "0",
                                    right: "0",
                                    fontSize: "1rem",
                                    paddingLeft: "10px",
                                    paddingBottom: "10px",
                                    borderBottomLeftRadius: "100%",
                                  }}
                                >
                                  {floating.bills[bill1]}
                                  <small>x</small>
                                </span>
                              )}
                            </div>
                          </td>

                          {/* Bill 2 Image */}
                          <td className="text-center">
                            {bill2 && (
                              <div
                                style={{
                                  position: "relative",
                                  width: "fit-content",
                                }}
                              >
                                <MDBCardBody className="m-0 p-0">
                                  <div
                                    style={currency.getBill(Number(bill2))}
                                    title={currency.format(bill2)}
                                  />
                                </MDBCardBody>
                                {floating?.bills?.[bill2] > 0 && (
                                  <span
                                    className="badge badge-primary"
                                    style={{
                                      position: "absolute",
                                      top: "0",
                                      right: "0",
                                      fontSize: "1rem",
                                      paddingLeft: "10px",
                                      paddingBottom: "10px",
                                      borderBottomLeftRadius: "100%",
                                    }}
                                  >
                                    {floating.bills[bill2]}
                                    <small>x</small>
                                  </span>
                                )}
                              </div>
                            )}
                          </td>

                          {/* Empty cell just for height balance */}
                          <td style={{ height: "9.2rem" }}></td>
                        </tr>
                      ))}
                  </MDBTableBody>
                </MDBTableBody>
              </MDBTable>
            </MDBCol>
            <MDBCol md="2">
              <h5 className="text-center font-weight-bold mt-1">Coins</h5>
              <div className="d-flex flex-column align-items-center ">
                {Object.entries(floating?.coins || {}).map(([coin, qty]) => (
                  <div
                    key={coin}
                    className="d-flex flex-column align-items-center mb-3"
                    style={{ position: "relative", width: "fit-content" }}
                  >
                    <MDBCardBody
                      className="m-0 p-0 coins-radius"
                      style={{ cursor: "pointer" }}
                    >
                      <div
                        style={currency.getCoin(Number(coin))}
                        title={currency.format(coin)}
                      />
                    </MDBCardBody>

                    {/* Quantity Badge */}
                    {qty > 0 && (
                      <span
                        className="badge badge-primary"
                        style={{
                          position: "absolute",
                          top: "0",
                          right: "0",
                          transform: "translate(60%, -20%)",
                          fontSize: "1rem",
                          padding: "0.3rem 0.5rem",
                          borderRadius: "50%",
                        }}
                      >
                        {qty}
                        <small>x</small>
                      </span>
                    )}
                  </div>
                ))}
              </div>
            </MDBCol>
            <Breakdown />
          </MDBRow>
          <div
            className="d-flex align-items-center justify-content-between mt-3"
            style={{ flexWrap: "nowrap", gap: "10px", width: "100%" }}
          >
            <div className="d-flex align-items-center" style={{ gap: "10px" }}>
              {title === "Floating Cash" && (
                <>
                  <span className="font-weight-bold">Shift:</span>
                  <select
                    className="browser-default custom-select"
                    value={schedule}
                    onChange={(e) => setSchedule(e.target.value)}
                    title="shift"
                    style={{ width: "auto" }}
                  >
                    <option value="morning">morning</option>
                    <option value="afternoon">afternoon</option>
                    <option value="night">Night</option>
                  </select>
                  <MDBInput
                    type="text"
                    label="Cashier Position"
                    value={position}
                    onChange={(e) => setPosition(e.target.value)}
                    style={{ minWidth: "10rem" }}
                  />
                  <MDBInput
                    type="text"
                    label="Location"
                    value={location}
                    onChange={(e) => setLocation(e.target.value)}
                    style={{ minWidth: "10rem" }}
                  />
                </>
              )}
            </div>

            {/* Button always at the end */}
            <MDBBtn
              color="primary"
              style={{ marginTop: "-2rem" }}
              onClick={handleSubmit}
              disabled={isLoading}
            >
              <MDBIcon icon="check" className="mr-2" /> Submit xxx
              {isLoading && <MDBIcon icon="spinner" pulse className="ml-2" />}
            </MDBBtn>
          </div>
        </MDBModalBody>
      </MDBModal>
    </>
  );
}
