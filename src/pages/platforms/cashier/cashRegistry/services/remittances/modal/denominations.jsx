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
  dateFormat,
  removeUndefinedValues,
  timeFormat,
} from "./../../../../../../../services/utilities";
import "./style.css";
import RollingNumber from "../../../../../../../components/rollingNumber";
import Swal from "sweetalert2";

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
    const now = new Date();
    const _floating = removeUndefinedValues(floating);
    const hasBills = Object.values(_floating?.bills || {}).some(
      (qty) => qty > 0
    );
    const hasCoins = Object.values(_floating?.coins || {}).some(
      (qty) => qty > 0
    );
    if (!hasBills && !hasCoins) {
      Swal.fire({
        title: "No Denomination Declared",
        text: "Please declare at least one bill or coin before submitting.",
        icon: "warning",
        confirmButtonText: "Okay",
        confirmButtonColor: "#3085d6",
        backdrop: true,
      });
      return; // 🚫 Stop submission
    }

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
            rawCreatedAt: `${dateFormat(now)} ${timeFormat(now)}`,
            createdAt: new Date(
              year,
              month - 1,
              day,
              now.getHours(),
              now.getMinutes(),
              now.getSeconds()
            ),
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
            branch: activePlatform.branch,
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

    // Clone setup
    const clone = img.cloneNode(true);
    clone.style.position = "fixed";
    clone.style.top = `${imgRect.top}px`;
    clone.style.left = `${imgRect.left}px`;
    clone.style.width = `${imgRect.width}px`;
    clone.style.height = `${imgRect.height}px`;
    clone.style.transition = "transform 1s ease-in-out, opacity 1s ease-in-out";
    clone.style.zIndex = 9999;
    clone.style.pointerEvents = "none";
    document.body.appendChild(clone);

    // Kukunin natin yung final target position sa susunod na frame
    requestAnimationFrame(() => {
      const targetElement =
        floatingCashRef.current.firstElementChild || floatingCashRef.current;
      const targetRect = targetElement.getBoundingClientRect();

      // Center-to-center calculation
      const deltaX =
        targetRect.left +
        targetRect.width / 2 -
        (imgRect.left + imgRect.width / 2);
      const deltaY =
        targetRect.top +
        targetRect.height / 2 -
        (imgRect.top + imgRect.height / 2);

      // Trigger reflow para mag-apply animation
      void clone.offsetWidth;

      // Animate to center
      clone.style.transform = `translate(${deltaX}px, ${deltaY}px) scale(0.2)`;
      clone.style.opacity = "0.3";

      clone.addEventListener("transitionend", () => {
        clone.remove();
      });
    });
  };

  const handleFlyBackFromFloatingCash = (event) => {
    const billElement = event.currentTarget.querySelector("div");
    if (!billElement || !floatingCashRef.current) return;

    const originElement =
      floatingCashRef.current.firstElementChild || floatingCashRef.current;
    const originRect = originElement.getBoundingClientRect();

    const computed = window.getComputedStyle(billElement);

    const clone = billElement.cloneNode(true);
    clone.style.position = "fixed";
    clone.style.top = `${originRect.top}px`;
    clone.style.left = `${originRect.left}px`;
    clone.style.width = `${originRect.width}px`;
    clone.style.height = `${originRect.height}px`;
    clone.style.opacity = "0.3";
    clone.style.transform =
      computed.transform === "none"
        ? "scale(0.2)"
        : `${computed.transform} scale(0.2)`;
    clone.style.transition =
      "transform 1s ease-in-out, opacity 1s ease-in-out, width 1s ease-in-out, height 1s ease-in-out, top 1s ease-in-out, left 1s ease-in-out";
    clone.style.zIndex = 9999;
    clone.style.pointerEvents = "none";
    document.body.appendChild(clone);

    requestAnimationFrame(() => {
      const targetRect = billElement.getBoundingClientRect();

      // Get the unscaled dimensions by dividing by 0.8
      const unscaledWidth = targetRect.width / 0.8;
      const unscaledHeight = targetRect.height / 0.8;

      // Para lapat kahit naka-scale, adjust din ang top/left position
      const adjustedTop =
        targetRect.top - (unscaledHeight - targetRect.height) / 2;
      const adjustedLeft =
        targetRect.left - (unscaledWidth - targetRect.width) / 2;

      clone.style.top = `${adjustedTop}px`;
      clone.style.left = `${adjustedLeft}px`;
      clone.style.width = `${unscaledWidth}px`;
      clone.style.height = `${unscaledHeight}px`;
      clone.style.opacity = "1";
      clone.style.transform = "scale(0.8)";
    });

    clone.addEventListener("transitionend", () => {
      clone.remove();
    });
  };

  const dateHeader = selected?._id
    ? new Date(selected.createdAt)
    : new Date(year, month - 1, day);

  return (
    <>
      <style>
        {`
    .denomination-btn {
      cursor: pointer;
    }
    .denomination-btn:active {
      transform: scale(.98);
    }

    @keyframes denomination-pulse {
      0% { transform: scale(1); }
      50% { transform: scale(1.15); }
      100% { transform: scale(1); }
    }

    .denomination-pulse {
      animation: denomination-pulse 0.6s ease-in-out infinite;
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
          className="darken-3 light-blue white-text py-3"
        >
          <div
            style={{
              position: "absolute",
              top: "0px",
              left: "50%",
              transform: "translateX(-50%)",
            }}
          >
            <span
              className=" font-weight-bold mb-1"
              style={{
                textTransform: "uppercase",
                letterSpacing: "25px",
                fontSize: "1.5rem",
              }}
            >
              Denomination
            </span>
            <span
              className="text-center d-block mt-n1"
              style={{
                fontSize: "1rem",
                textTransform: "uppercase",
                letterSpacing: "2px",
              }}
            >
              {dateHeader.toDateString()}
            </span>
          </div>
        </MDBModalHeader>

        <MDBModalBody>
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
            <div
              className="d-flex justify-content-center align-items-center"
              style={{ gap: "30px" }}
            >
              <div className="d-flex flex-column justify-content-center align-items-center">
                <div className="d-flex flex-column">
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
                            transform: "scale(.8)",
                            transformOrigin: "top",
                            marginBottom: "-20px",
                            boxShadow: "none",
                            marginRight: "-50px",
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
                              transform: "scale(.8)",
                              transformOrigin: "top",
                              marginBottom: "-15px",
                              marginLeft: "-20px",
                              boxShadow: "none",
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
                <div className="d-flex flex-column align-items-center ml-n4 mr-4">
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
              {/* Summary */}
              <div
                className="d-flex flex-column align-items-center py-2 px-3 shadow-sm border rounded bg-white"
                style={{ gap: "15px", height: "fit-content" }}
              >
                {title === "Closing Cash Register" && (
                  <div className="d-flex flex-column align-items-center">
                    <span className="text-muted" style={{ fontWeight: "400" }}>
                      COH:
                    </span>
                    <span
                      className={
                        sum < coh
                          ? "text-danger denomination-pulse font-weight-bold"
                          : sum > coh
                          ? "text-warning denomination-pulse font-weight-bold"
                          : "text-success font-weight-bold"
                      }
                      style={{ fontSize: "1.5rem" }}
                    >
                      {currency?.format ? currency.format(coh || 0) : coh || 0}
                    </span>
                  </div>
                )}

                <div className="d-flex flex-column align-items-center">
                  <span className="text-muted" style={{ fontWeight: "400" }}>
                    <MDBIcon icon="calendar-alt" className="mr-2" />
                    {title || "Floating Cash"}
                  </span>

                  <div className="mt-1" ref={floatingCashRef}>
                    {sum > 0 && (
                      <RollingNumber
                        value={sum}
                        color="black"
                        size="1.5rem"
                        duration={800}
                        style={{ fontSize: "1.5rem", color: "red" }}
                      />
                    )}
                  </div>
                </div>

                <MDBBtn
                  color="primary"
                  onClick={handleSubmit}
                  disabled={
                    (title === "Closing Cash Register" && sum !== coh) ||
                    formSubmitted
                  }
                  className="mt-3"
                  style={{ fontWeight: "bold" }}
                  block
                >
                  <MDBIcon icon="check" className="mr-2" /> Submit
                  {formSubmitted && (
                    <MDBIcon icon="spinner" pulse className="ml-2" />
                  )}
                </MDBBtn>
              </div>
            </div>
          </div>

          <div
            className="d-flex align-items-center justify-content-center w-100"
            style={{ gap: "25px" }}
          >
            {title === "Floating Cash" && (
              <>
                <div className="d-flex align-items-center">
                  <span className="font-weight-bold mr-1">Shift:</span>
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
                </div>
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
        </MDBModalBody>
      </MDBModal>
    </>
  );
}
