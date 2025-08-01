import { useState, useEffect, useRef } from "react";
import { useDispatch, useSelector } from "react-redux";
import {
  MDBModal,
  MDBModalBody,
  MDBIcon,
  MDBModalHeader,
  MDBBtn,
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
import { Policy } from "./../../../../../../../services/fakeDb";
import {
  currency,
  removeUndefinedValues,
} from "./../../../../../../../services/utilities";
import "./style.css";

export default function Modal() {
  const { token, activePlatform, auth } = useSelector(({ auth }) => auth),
    {
      showModal,
      title,
      selected,
      day,
      month,
      year,
      isSuccess,
      formSubmitted,
      description = "",
    } = useSelector(({ remittances }) => remittances),
    [floating, setFloating] = useState({ bills: {}, coins: {} }),
    floatingCashRef = useRef(null),
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
      ).then(() => {
        dispatch(TOGGLE({ key: "closed" }));
        localStorage.setItem(
          "remittance",
          JSON.stringify({
            ...selected,
            closing: {
              time: new Date().toLocaleTimeString("en-PH", {
                timeZone: "Asia/Manila",
                hour12: false,
              }),
              ..._floating,
              sum, // floating is included
            },
            sales: selected.sales,
          })
        );
        window.open(
          "/printout/remittance",
          "remittance",
          "top=100px,left=0px,width=1050px,height=750px"
        );
      });
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

  const decreaseQuantity = (type, denomination) => {
    setFloating((prev) => {
      const current = prev[type]?.[denomination] || 0;
      const newQty = current > 0 ? current - 1 : 0;
      return {
        ...prev,
        [type]: {
          ...prev[type],
          [denomination]: newQty,
        },
      };
    });
  };

  const handleFlyToFloatingCash = (event) => {
    const img = event.currentTarget.querySelector("div");
    if (!img || !floatingCashRef.current) return;

    const imgRect = img.getBoundingClientRect();
    const targetRect = floatingCashRef.current.getBoundingClientRect();

    const clone = img.cloneNode(true);
    clone.style.position = "fixed";
    clone.style.top = `${imgRect.top}px`;
    clone.style.left = `${imgRect.left}px`;
    clone.style.width = `${imgRect.width}px`;
    clone.style.height = `${imgRect.height}px`;
    clone.style.transform = "scale(1)";
    clone.style.transition = "all 1s ease-in-out";
    clone.style.zIndex = 9999;
    clone.style.pointerEvents = "none";
    document.body.appendChild(clone);

    // Trigger reflow
    void clone.offsetWidth;

    // Animate to exact span position
    clone.style.top = `${targetRect.top}px`;
    clone.style.left = `${targetRect.left}px`;
    clone.style.transform = "scale(0.2)";
    clone.style.opacity = "0.3";

    clone.addEventListener("transitionend", () => {
      clone.remove();
    });
  };

  const handleFlyBackFromFloatingCash = (event) => {
    const target = event.currentTarget.querySelector("div");
    if (!target || !floatingCashRef.current) return;

    const targetRect = target.getBoundingClientRect();
    const originRect = floatingCashRef.current.getBoundingClientRect();

    const clone = target.cloneNode(true);
    clone.style.position = "fixed";
    clone.style.top = `${originRect.top}px`;
    clone.style.left = `${originRect.left}px`;
    clone.style.width = `20px`;
    clone.style.height = `20px`;
    clone.style.opacity = "0.3";
    clone.style.transform = "scale(0.2)";
    clone.style.transition = "all 1s ease-in-out";
    clone.style.zIndex = 9999;
    clone.style.pointerEvents = "none";
    document.body.appendChild(clone);

    // Force reflow
    void clone.offsetWidth;

    // Animate to the bill/coin
    clone.style.top = `${targetRect.top}px`;
    clone.style.left = `${targetRect.left}px`;
    clone.style.width = `${targetRect.width}px`;
    clone.style.height = `${targetRect.height}px`;
    clone.style.opacity = "1";
    clone.style.transform = "scale(1)";

    clone.addEventListener("transitionend", () => {
      clone.remove();
    });
  };

  return (
    <>
      <style>
        {`
        .denomination-btn{
        cursor: pointer;
        }
        .denomination-btn:active{
          transform: scale(.98)
        }
        `}
      </style>
      <MDBModal
        isOpen={showModal}
        toggle={() => dispatch(TOGGLE({ key: "closed" }))}
        size="xl"
        backdrop
      >
        <MDBModalHeader
          toggle={() => dispatch(TOGGLE({ key: "closed" }))}
          className="darken-3 light-blue white-text"
        >
          <div className="d-flex" style={{ gap: "60px" }}>
            <div className="d-flex justify-content-between align-content-center">
              <MDBIcon icon="calendar-alt" className="mr-2" />
              <div className="d-flex align-items-end">
                <span ref={floatingCashRef}>
                  {title || "Floating Cash  "}
                  {sum > 0 && ` : (${currency.format(sum)})`}
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
                COH: {currency.format(coh)}
              </span>
            )}
          </div>
        </MDBModalHeader>

        <MDBModalBody className="mb-0">
          {!selected?._id && (
            //   ? (
            //   <MDBTypography note noteTitle="Note: " tag="h6" noteColor="primary">
            //     Declare your closing by selecting each denomination. Make sure it
            //     matches your Cash On Hand (COH) before submitting.
            //   </MDBTypography>
            // ) : (
            <MDBTypography note noteTitle="Note: " tag="h6" noteColor="primary">
              {description
                ? description
                : "Declare your floating cash by selecting each denomination."}
            </MDBTypography>
          )}
          <div className="d-flex flex-column align-items-center justify-content-center">
            <span
              className=" font-weight-bold mb-4"
              style={{
                textTransform: "uppercase",
                letterSpacing: "25px",
                fontSize: "1.5rem",
              }}
            >
              Denomination
            </span>
            <div
              className="d-flex justify-content-center"
              style={{ gap: "50px" }}
            >
              <div className="d-flex flex-column justify-content-center align-items-center">
                <h5 className="text-center font-weight-bold mb-4">Bills</h5>
                <div
                  className="d-flex flex-column"
                  style={{
                    gap: "15px",
                  }}
                >
                  {/* LEFT COLUMN */}
                  {currency.Denominations.bills
                    .reduce((rows, bill, index) => {
                      if (index % 2 === 0) {
                        rows.push([
                          bill,
                          currency.Denominations.bills[index + 1] || null,
                        ]);
                      }
                      return rows;
                    }, [])
                    .map(([bill1, bill2], idx) => (
                      <div
                        key={`row-${idx}`}
                        className="d-flex"
                        style={{ gap: "30px" }}
                      >
                        <MDBCard
                          onClick={(e) => {
                            increaseQuantity("bills", bill1);
                            handleFlyToFloatingCash(e);
                          }}
                          onContextMenu={(e) => {
                            e.preventDefault();
                            const qty = floating?.bills?.[bill1] || 0;
                            if (qty > 0) {
                              decreaseQuantity("bills", bill1);
                              handleFlyBackFromFloatingCash(e);
                            }
                          }}
                          className="denomination-btn"
                          style={{
                            position: "relative",
                            overflow: "hidden",
                            width: "fit-content",
                          }}
                        >
                          <MDBCardBody
                            className="p-0"
                            style={{ backgroundColor: "transparent" }}
                          >
                            <div
                              style={currency.getBill(Number(bill1))}
                              title={currency.format(bill1)}
                            />
                          </MDBCardBody>
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
                            {floating?.bills?.[bill1] || 0}
                          </span>
                        </MDBCard>

                        {/* RIGHT CARD (bill2) */}
                        {bill2 && (
                          <MDBCard
                            onClick={(e) => {
                              increaseQuantity("bills", bill2);
                              handleFlyToFloatingCash(e);
                            }}
                            onContextMenu={(e) => {
                              e.preventDefault();
                              const qty = floating?.bills?.[bill2] || 0;
                              if (qty > 0) {
                                decreaseQuantity("bills", bill2);
                                handleFlyBackFromFloatingCash(e);
                              }
                            }}
                            className="denomination-btn"
                            style={{
                              position: "relative",
                              overflow: "hidden",
                              width: "fit-content",
                            }}
                          >
                            <MDBCardBody className="p-0">
                              <div
                                style={currency.getBill(Number(bill2))}
                                title={currency.format(bill2)}
                              />
                            </MDBCardBody>
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
                              {floating?.bills?.[bill2] || 0}
                            </span>
                          </MDBCard>
                        )}
                      </div>
                    ))}
                </div>
              </div>
              <div className="d-flex flex-column align-items-center">
                <h5 className="text-center font-weight-bold mb-4">Coins</h5>
                <div
                  className="d-flex flex-column align-items-center"
                  style={{ gap: "15px" }}
                >
                  {currency.Denominations?.coins.map((coin) => (
                    <div key={coin} className="d-flex align-items-center mb-3">
                      <MDBCard
                        className="coins-radius denomination-btn"
                        onClick={(e) => {
                          increaseQuantity("coins", coin);
                          handleFlyToFloatingCash(e);
                        }}
                        onContextMenu={(e) => {
                          e.preventDefault(); // prevent right-click menu
                          const qty = floating?.coins?.[coin] || 0;
                          if (qty > 0) {
                            decreaseQuantity("coins", coin); // subtract
                            handleFlyBackFromFloatingCash(e); // animate
                          }
                        }}
                        style={{ position: "relative" }}
                      >
                        <MDBCardBody className="m-0 p-0 coins-radius">
                          <div
                            style={currency.getCoin(Number(coin))}
                            title={currency.format(coin)}
                          />
                        </MDBCardBody>
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
                          {floating?.coins?.[coin] || 0}
                        </span>
                      </MDBCard>
                    </div>
                  ))}
                </div>
              </div>
            </div>
          </div>
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
              {formSubmitted && (
                <MDBIcon icon="spinner" pulse className="ml-2" />
              )}
            </MDBBtn>
          </div>
        </MDBModalBody>
      </MDBModal>
    </>
  );
}
