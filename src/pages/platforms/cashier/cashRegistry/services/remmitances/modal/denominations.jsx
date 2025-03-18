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
  1: "-178px -325px",
  5: "-232px -315px",
  10: "-295px -312px",
  20: "-363px -310px",
};
const coinSize = {
  1: "55px",
  5: "68px",
  10: "70px",
  20: "75px",
};

export default function Modal() {
  const { token, activePlatform, auth } = useSelector(({ auth }) => auth),
    { month, year, day, showModal, title, selected } = useSelector(
      ({ remittances }) => remittances
    ),
    [floating, setFloating] = useState({ bills: {}, coins: {} }),
    [sum, setSum] = useState(0),
    dispatch = useDispatch();

  useEffect(() => {
    calculateSum(floating);
  }, [floating]);

  useEffect(() => {
    setFloating({ bills: {}, coins: {} });
  }, [showModal]);

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
    const total =
      Object.entries(data.bills).reduce(
        (acc, [denom, qty]) => acc + parseInt(denom) * qty,
        0
      ) +
      Object.entries(data.coins).reduce(
        (acc, [denom, qty]) => acc + parseInt(denom) * qty,
        0
      );
    setSum(total);
  };

  const handleSubmit = () => {
    const _floating = removeUndefinedValues(floating);
    if (!selected._id) {
      dispatch(
        SAVE({
          token,
          data: {
            date: new Date().toLocaleString("en-US", {
              timeZone: "Asia/Manila",
            }),
            opening: {
              ..._floating,
              sum,
            },
            cashier: auth._id,
            branch: activePlatform?.branchId,
            department: Policy.getDepartment(activePlatform.position),
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
            gross: selected.gross,
            _id: selected._id,
          },
        })
      );
    }
    dispatch(TOGGLE());
  };

  return (
    <MDBModal
      isOpen={showModal}
      toggle={() => dispatch(TOGGLE({ key: "open" }))}
      size="lg"
      backdrop
    >
      <MDBModalHeader
        toggle={() => dispatch(TOGGLE({ key: "open" }))}
        className="light-blue darken-3 white-text"
      >
        <MDBIcon icon="calendar-alt" className="mr-2" />
        {title || "Floating Cash"} {sum > 0 && ` : (${currency(sum)})`}
      </MDBModalHeader>
      <MDBModalBody className="mb-0">
        <MDBRow>
          <MDBCol md="12">
            <h5 className="text-center font-weight-bold">Bills</h5>
            <MDBTable bordered small>
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
                        <MDBCard>
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
                        className=" d-flex align-items-center "
                        style={{ height: "9.2rem" }}
                      >
                        <MDBInput
                          type="number"
                          min={0}
                          className="w-100 text-center"
                          required
                          value={String(floating.bills[bill1] || 0)}
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
                          <MDBCard>
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
                        className=" d-flex align-items-center"
                        style={{ height: "9.2rem" }}
                      >
                        {bill2 && (
                          <MDBInput
                            type="number"
                            min={0}
                            className="w-100 text-center"
                            required
                            value={String(floating.bills[bill2] || 0)}
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
        </MDBRow>

        <h5 className="text-center font-weight-bold mt-1">Coins</h5>
        <MDBRow style={{ marginTop: "-0.5rem" }}>
          {Object.keys(coinPositions).map((coin) => (
            <MDBCol key={coin} md="3" className="d-flex align-items-center">
              <div style={getCoinIMG(Number(coin))} title={currency(coin)} />
              <MDBInput
                type="number"
                min={0}
                className="text-center mt-2"
                value={String(floating.coins[coin] || 0)}
                style={{ width: "6rem" }}
                onChange={(e) =>
                  handleInputChange("coins", coin, Number(e.target.value))
                }
              />
            </MDBCol>
          ))}
        </MDBRow>

        <div className="text-right mt-3">
          <MDBBtn color="primary" onClick={handleSubmit}>
            <MDBIcon icon="check" className="mr-2" /> Submit
          </MDBBtn>
        </div>
      </MDBModalBody>
    </MDBModal>
  );
}
