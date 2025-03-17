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
} from "mdbreact";
import {
  TOGGLE,
  FLOATINGCASH,
} from "../../../../../../services/redux/slices/finance/bookkeeping/remittances";
import { Denominations, Policy } from "../../../../../../services/fakeDb";
import {
  currency,
  removeUndefinedValues,
} from "../../../../../../services/utilities";

const billPositions = {
  20: "0px 0px",
  50: "-300px 0px",
  100: "0px -126px",
  200: "-300px -126px",
  500: "0px -248px",
  1000: "-300px -248px",
};

const coinPositions = {
  1: "-178px -325px",
  5: "-235px -317px",
  10: "-304px -315px",
  20: "-372px -315px",
};
const monthNames = [
  "January",
  "February",
  "March",
  "April",
  "May",
  "June",
  "July",
  "August",
  "September",
  "October",
  "November",
  "December",
];

export default function Modal() {
  const { token, activePlatform, auth } = useSelector(({ auth }) => auth),
    { month, year, day, showModal, title } = useSelector(
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

  const getBillStyle = (bill) => ({
    width: "300px",
    height: "126px",
    backgroundImage: `url(${coinImage})`,
    backgroundPosition: billPositions[bill] || "0px 0px",
    backgroundSize: "600px auto",
    display: "block",
  });

  const getCoinStyle = (coin) => ({
    width: "60px",
    height: "60px",
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
    const department = Policy.getDepartment(activePlatform.position);
    const _floating = removeUndefinedValues(floating);

    dispatch(
      FLOATINGCASH({
        token,
        data: {
          date: {
            month: monthNames[month],
            year,
            day,
          },
          opening: {
            time: new Date().toLocaleTimeString("en-PH", {
              timeZone: "Asia/Manila",
              hour12: false,
            }),
            ..._floating,
            sum,
          },
          cashier: auth._id,
          branch: activePlatform?.branchId,
          department,
        },
      })
    );
    dispatch(TOGGLE());
  };

  return (
    <MDBModal
      isOpen={showModal}
      toggle={() => dispatch(TOGGLE())}
      size="lg"
      backdrop
    >
      <MDBModalHeader
        toggle={() => dispatch(TOGGLE())}
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
                        <div
                          style={getBillStyle(Number(bill1))}
                          title={currency(bill1)}
                        />
                      </td>
                      <td className="p-0">
                        <input
                          type="number"
                          min={0}
                          className="w-100 text-center"
                          required
                          value={floating.bills[bill1] || ""}
                          onChange={(e) =>
                            handleInputChange("bills", bill1, e.target.value)
                          }
                        />
                      </td>
                      <td className="text-center">
                        {bill2 && (
                          <div
                            style={getBillStyle(Number(bill2))}
                            title={currency(bill2)}
                          />
                        )}
                      </td>
                      <td className="p-0">
                        {bill2 && (
                          <input
                            type="number"
                            min={0}
                            className="w-100 text-center"
                            required
                            value={floating.bills[bill2] || ""}
                            onChange={(e) =>
                              handleInputChange("bills", bill2, e.target.value)
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

        <h5 className="text-center font-weight-bold mt-4">Coins</h5>
        <MDBRow>
          {Object.keys(coinPositions).map((coin) => (
            <MDBCol key={coin} md="3" className="text-center">
              <div style={getCoinStyle(Number(coin))}></div>
              <input
                type="number"
                min={0}
                className="w-100 text-center mt-2"
                value={floating.coins[coin] || ""}
                onChange={(e) =>
                  handleInputChange("coins", coin, e.target.value)
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
