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
  MDBCard,
  MDBInput,
  MDBCardBody,
  MDBTypography,
} from "mdbreact";
import {
  TOGGLE,
  SAVE,
  UPDATE as CLOSINGCASH,
} from "./../../../../../../../services/redux/slices/finance/bookkeeping/remittances";
import { Denominations, Policy } from "./../../../../../../../services/fakeDb";
import {
  currency,
  removeUndefinedValues,
} from "./../../../../../../../services/utilities";
import "./style.css";

const billPositions = {
  20: "-2px -3px",
  50: "-302px 0px",
  100: "0px -126px",
  200: "-310px -127px",
  500: "0px -253px",
  1000: "-308px -253px",
};

const coinPositions = {
  1: "-182px -324px",
  5: "-235px -317px",
  10: "-300px -314px",
  20: "-368px -310px",
};
const coinSize = {
  1: "51px",
  5: "60px",
  10: "64px",
  20: "68px",
};

export default function Modal() {
  const { token, activePlatform, auth } = useSelector(({ auth }) => auth),
    { showModal, title, selected, day, month, year, isSuccess, formSubmitted } =
      useSelector(({ remittances }) => remittances),
    [floating, setFloating] = useState({ bills: {}, coins: {} }),
    [sum, setSum] = useState(0),
    [coh, setCoh] = useState(0),
    [schedule, setSchedule] = useState("morning"),
    [position, setPosition] = useState(0),
    [location, setLocation] = useState("reception"),
    dispatch = useDispatch();

  useEffect(() => {
    calculateSum(floating);
  }, [floating]);

  useEffect(() => {
    if (showModal && isSuccess && !formSubmitted) {
      dispatch(TOGGLE());
    }
  }, [formSubmitted, isSuccess, showModal, dispatch]);

  useEffect(() => {
    setCoh(selected?.coh);
  }, [selected]);

  useEffect(() => {
    let denominations = { bills: {}, coins: {} };
    if (title === "Closing Cash Register")
      denominations = { ...selected?.closing };
    setFloating(denominations);
  }, [showModal, title, selected]);

  const coinImage = `${process.env.PUBLIC_URL}/assets/denominations.png`;

  const getBillimg = (bill) => ({
    width: "300px",
    height: "126px",
    backgroundImage: `url(${coinImage})`,
    backgroundPosition: billPositions[bill] || "0px 0px",
    backgroundSize: "610px auto",
    backgroundRepeat: "no-repeat",

    display: "block",
  });

  const getCoinIMG = (coin) => ({
    width: coinSize[coin],
    height: coinSize[coin],
    backgroundImage: `url(${coinImage})`,
    backgroundPosition: coinPositions[coin] || "0px 0px",
    backgroundSize: "500px auto",
    display: "block",
    borderRadius: "50%",
  });

  const handleInputChange = (type, denomination, value) => {
    const quantity = parseInt(value, 10) || 0;
    setFloating((prev) => {
      const newFloating = {
        ...prev,
        [type]: { ...prev[type], [denomination]: quantity },
      };
      return newFloating;
    });
  };

  const calculateSum = (data) => {
    if (!data) return; // Ensure data is not null or undefined
    const bills = data.bills || {}; // Default to empty object if undefined
    const coins = data.coins || {};

    const total =
      Object.entries(bills).reduce(
        (acc, [denom, qty]) => acc + parseInt(denom) * qty,
        0
      ) +
      Object.entries(coins).reduce(
        (acc, [denom, qty]) => acc + parseInt(denom) * qty,
        0
      );

    setSum(total);
  };

  const handleSubmit = () => {
    const _floating = removeUndefinedValues(floating);
    if (!selected?._id) {
      dispatch(
        SAVE({
          token,
          data: {
            opening: {
              ..._floating,
              sum,
            },
            position,
            location,
            shift: schedule,
            cashier: auth._id,
            branch: activePlatform?.branchId,
            department: Policy.getDepartment(activePlatform.position),
            createdAt: new Date(year, month - 1, day).setHours(17, 4, 0, 3),
          },
        })
      );
    } else {
      dispatch(
        CLOSINGCASH({
          token,
          data: {
            closing: {
              time: new Date().toLocaleTimeString("en-PH", {
                timeZone: "Asia/Manila",
                hour12: false,
              }),
              ..._floating,
              sum, // floating is included
            },
            sales: selected.sales,
            _id: selected._id,
          },
        })
      );
    }
  };

  const increaseQuantity = (type, denomination) => {
    setFloating((prev) => ({
      ...prev,
      [type]: {
        ...prev[type],
        [denomination]: (prev[type]?.[denomination] || 0) + 1,
      },
    }));
  };

  return (
    <MDBModal
      isOpen={showModal}
      toggle={() => dispatch(TOGGLE({ key: "open" }))}
      size="xl"
      backdrop
    >
      <MDBModalHeader
        toggle={() => dispatch(TOGGLE({ key: "open" }))}
        className="d-flex align-items-center justify-content-between darken-3 light-blue white-text"
      >
        <div className="d-flex justify-content-between">
          <MDBIcon icon="calendar-alt" className="mr-2" />
          <div className="d-flex align-items-end">
            <span>
              {title || "Floating Cash  "} {sum > 0 && ` : (${currency(sum)})`}
            </span>
            <span></span>
          </div>
        </div>

        {title === "Closing Cash Register" && (
          <span
            className={
              sum < coh
                ? "text-danger" // 🔴 Shortage
                : sum > coh
                ? "text-warning" // 🟡 Overage
                : "text-success" // ✅ Balanced
            }
          >
            COH: {currency(coh)}
          </span>
        )}
      </MDBModalHeader>

      <MDBModalBody className="mb-0">
        {selected?._id ? (
          <MDBTypography note noteTitle="Note: " tag="h6" noteColor="primary">
            Declare your closing by selecting each denomination. Make sure it
            matches your Cash On Hand (COH) before submitting.
          </MDBTypography>
        ) : (
          <MDBTypography note noteTitle="Note: " tag="h6" noteColor="primary">
            Declare your floating cash by selecting each denomination.
          </MDBTypography>
        )}
        <MDBRow>
          <MDBCol md="10">
            <h5 className="text-center font-weight-bold">Bills</h5>
            <MDBTable style={{ border: "none !important" }}>
              <MDBTableHead>
                <tr>
                  <th>Denomination</th>
                  <th className="text-center">Qty</th>
                  <th>Denomination</th>
                  <th className="text-center">Qty</th>
                </tr>
              </MDBTableHead>
              <MDBTableBody>
                {Denominations.bills
                  .reduce((rows, bill, index) => {
                    if (index % 2 === 0) {
                      rows.push([bill, Denominations.bills[index + 1] || null]);
                    }
                    return rows;
                  }, [])
                  .map(([bill1, bill2], idx) => (
                    <tr key={`row-${idx}`}>
                      <td className="text-center">
                        <MDBCard
                          onClick={() => increaseQuantity("bills", bill1)}
                        >
                          <MDBCardBody
                            style={{ backGroundColor: "transparent" }}
                            className="p-0 m"
                          >
                            <div
                              style={getBillimg(Number(bill1))}
                              title={currency(bill1)}
                            />
                          </MDBCardBody>
                        </MDBCard>
                      </td>
                      <td
                        className="d-flex align-items-center"
                        style={{ height: "9.2rem" }}
                      >
                        <MDBInput
                          type="number"
                          min={0}
                          className="text-center w-100"
                          required
                          value={String(floating?.bills?.[bill1] || 0)}
                          onChange={(e) =>
                            handleInputChange(
                              "bills",
                              bill1,
                              Number(e.target.value)
                            )
                          }
                        />
                      </td>
                      <td className="text-center">
                        {bill2 && (
                          <MDBCard
                            onClick={() => increaseQuantity("bills", bill2)}
                          >
                            <MDBCardBody className="m-0 p-0">
                              <div
                                style={getBillimg(Number(bill2))}
                                title={currency(bill2)}
                              />
                            </MDBCardBody>
                          </MDBCard>
                        )}
                      </td>
                      <td
                        className="d-flex align-items-center"
                        style={{ height: "9.2rem" }}
                      >
                        {bill2 && (
                          <MDBInput
                            type="number"
                            min={0}
                            className="text-center w-100"
                            required
                            value={String(floating?.bills?.[bill2] || 0)}
                            onChange={(e) =>
                              handleInputChange(
                                "bills",
                                bill2,
                                Number(e.target.value)
                              )
                            }
                          />
                        )}
                      </td>
                    </tr>
                  ))}
              </MDBTableBody>
            </MDBTable>
          </MDBCol>
          <MDBCol md="2">
            <h5 className="text-center font-weight-bold mt-1">Coins</h5>
            <div className="d-flex flex-column align-items-center">
              {Object.keys(coinPositions).map((coin) => (
                <div key={coin} className="d-flex align-items-center mb-3">
                  <MDBCard
                    className="coins-radius"
                    onClick={() => increaseQuantity("coins", coin)}
                  >
                    <MDBCardBody className="m-0 p-0 coins-radius">
                      <div
                        style={getCoinIMG(Number(coin))}
                        title={currency(coin)}
                      />
                    </MDBCardBody>
                  </MDBCard>
                  <MDBInput
                    type="number"
                    min={0}
                    className="text-center ml-3"
                    value={String(floating?.coins?.[coin] || 0)}
                    style={{ width: "6rem" }}
                    onChange={(e) =>
                      handleInputChange("coins", coin, Number(e.target.value))
                    }
                  />
                </div>
              ))}
            </div>
          </MDBCol>
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
            onClick={handleSubmit}
            disabled={
              (title === "Closing Cash Register" && sum !== coh) ||
              formSubmitted
            }
          >
            <MDBIcon icon="check" className="mr-2" /> Submit
            {formSubmitted && <MDBIcon icon="spinner" pulse className="ml-2" />}
          </MDBBtn>
        </div>
      </MDBModalBody>
    </MDBModal>
  );
}
