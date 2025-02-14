import {
  MDBAlert,
  MDBBtn,
  MDBBtnGroup,
  MDBIcon,
  MDBSpinner,
  MDBTable,
  MDBTableBody,
  MDBTableHead,
} from "mdbreact";
import React, { useEffect, useState } from "react";
import Months from "../../../../../../services/fakeDb/calendar/months";
import Years from "../../../../../../services/fakeDb/calendar/years";
import "./index.css";
import {
  axioKit,
  capitalize,
  currency,
  generateCalendar,
} from "../../../../../../services/utilities";
import { useDispatch, useSelector } from "react-redux";
import { useHistory, useLocation } from "react-router-dom";
import CalendarMini from "./mini";
import { RESET } from "../../../../../../services/redux/slices/commerce/sales";

export default function Calendar({
  focusedDay,
  totalGrossSales,
  totalMenuExpenses,
  totalTransactionCount,
  setTotalGrossSales,
  setTotalMenuExpenses,
  setTotalTransactionCount,
  ledger,
  setLedger,
  showPopUp,
  setShowPopUp,
  year,
  month,
  selectToday,
  isSelectedMonthAndYearFuture,
  isTodaySelected,
  showProgress,
}) {
  const [parsedCalendarTable, setParsedCalendarTable] = useState([]),
    [isLoading, setIsLoading] = useState(false),
    { token, onDuty, activePlatform, auth } = useSelector(({ auth }) => auth),
    { pathname } = useLocation(),
    history = useHistory(),
    dispatch = useDispatch();

  // update parsing when month and year is changed
  useEffect(() => {
    const adjustArrayLength = (arr) => {
      const length = arr.length;
      const remainder = length % 7;

      // Check if the length is already divisible by 7
      if (remainder === 0) {
        return arr; // No changes needed
      }

      // Calculate the number of elements needed to make the length divisible by 7
      const elementsToAdd = 7 - remainder;

      // Push the required number of elements to make the length divisible by 7
      arr.push(...Array(elementsToAdd).fill({}));

      return arr;
    };

    const splitIntoChunks = (arr, chunkSize) => {
      // Initialize an empty array to hold the result
      const result = [];

      // Iterate through the array in steps of `chunkSize`
      for (let i = 0; i < arr.length; i += chunkSize) {
        // Slice the array to get a chunk of `chunkSize` elements
        const chunk = arr.slice(i, i + chunkSize);
        result.push(chunk); // Add the chunk to the result array
      }

      return result;
    };

    setParsedCalendarTable(
      splitIntoChunks(adjustArrayLength(generateCalendar(month, year)), 7)
    );
  }, [month, year]);

  useEffect(() => {
    // only fetch if the year and month is NOT a future
    if (
      !isSelectedMonthAndYearFuture &&
      onDuty?._id &&
      auth?._id &&
      !showPopUp &&
      !showProgress
    ) {
      setIsLoading(true);
      const fetchPreCalculatedSales = async () => {
        const query = {
          branch: onDuty._id,
          month: Months[month],
          year,
          ...(activePlatform === "cashier" && { cashier: auth._id }),
        };

        const {
          payload,
          totalGrossSales,
          totalMenuExpenses,
          totalTransactionCount,
        } = await axioKit.universal(
          "finance/pre-calculated-daily-sale/browse",
          token,
          query
        );

        setIsLoading(false);

        // payload is empty, show popup to inform user of long loading time
        if (payload.isEmpty) {
          setShowPopUp(true);
          return;
        }

        setLedger(payload);
        setTotalGrossSales(totalGrossSales);
        setTotalMenuExpenses(totalMenuExpenses);
        setTotalTransactionCount(totalTransactionCount);
      };

      // for some reason, 0 value for year is having an error, to be safe, check it first
      if (year) {
        fetchPreCalculatedSales();
      }
    }
  }, [
    showProgress,
    isSelectedMonthAndYearFuture,
    month,
    year,
    token,
    onDuty,
    activePlatform,
    auth,
    showPopUp,
    setShowPopUp,
    setLedger,
    setTotalGrossSales,
    setTotalMenuExpenses,
    setTotalTransactionCount,
  ]);

  const disablePrevOnLastChoice = () => {
    if (month === 0 && year === Years[0]) return true;

    return false;
  };

  const disableNextOnLastChoice = () => {
    if (month === 11 && year === Years[Years.length - 1]) return true;

    return false;
  };

  const prev = (clearFocused = true) => {
    if (showPopUp) setShowPopUp(false);

    let _month = month === 0 ? 11 : month - 1,
      _year = month === 0 ? year - 1 : year;

    const params = new URLSearchParams({
      month: _month,
      year: _year,
      ...(!clearFocused && { focusedDay }),
    });

    history.push(`${pathname}?${params.toString()}`);

    // if focused is not cleared, meaning we are using mini calendar
    // we need to reset the sales to perform a new query
    if (!clearFocused) dispatch(RESET({ resetCollections: true }));
  };

  const next = (clearFocused = true) => {
    if (showPopUp) setShowPopUp(false);

    let _month = month === 11 ? 0 : month + 1,
      _year = month === 11 ? year + 1 : year;

    const params = new URLSearchParams({
      month: _month,
      year: _year,
      ...(!clearFocused && { focusedDay }),
    });

    history.push(`${pathname}?${params.toString()}`);

    // if focused is not cleared, meaning we are using mini calendar
    // we need to reset the sales to perform a new query
    if (!clearFocused) dispatch(RESET({ resetCollections: true }));
  };

  const exitMiniView = () => {
    const params = new URLSearchParams({
      month,
      year,
    });

    history.push(`${pathname}?${params.toString()}`);
    dispatch(RESET({ resetCollections: true }));
  };

  const handleCensus = (month, year) => {
    // localStorage.setItem("ServiceLogs", month);
    window.location.href = `/pos/ledger/census?month=${month}&year=${year}`;
  };

  if (focusedDay)
    return (
      <CalendarMini
        exitMiniView={exitMiniView}
        ledger={ledger}
        focusedDay={focusedDay}
        year={year}
        month={month}
        parsedCalendarTable={parsedCalendarTable}
        isSelectedMonthAndYearFuture={isSelectedMonthAndYearFuture}
        prev={prev}
        disablePrevOnLastChoice={disablePrevOnLastChoice}
        next={next}
        disableNextOnLastChoice={disableNextOnLastChoice}
      />
    );

  return (
    <div className="py-1 rounded bg-white">
      <div className="d-flex justify-content-between">
        <div className="d-flex align-items-center">
          <MDBBtnGroup>
            <MDBBtn
              onClick={selectToday}
              size="sm"
              color="white"
              className="z-depth-0"
              disabled={isTodaySelected}
            >
              TODAY
            </MDBBtn>
            <MDBBtn
              onClick={prev}
              disabled={disablePrevOnLastChoice()}
              size="sm"
              color="white"
              className="z-depth-0"
            >
              <MDBIcon icon="angle-left" />
            </MDBBtn>
            <MDBBtn
              onClick={next}
              disabled={disableNextOnLastChoice()}
              size="sm"
              color="white"
              className="z-depth-0"
            >
              <MDBIcon icon="angle-right" />
            </MDBBtn>
          </MDBBtnGroup>
          <>
            <strong className="cursor-pointer h3-responsive">{year}</strong>
            &nbsp;
            <strong className="cursor-pointer h3-responsive">
              {Months[month]}
            </strong>
          </>
        </div>
        <MDBIcon
          title="Census"
          icon="receipt"
          onClick={() => handleCensus(month, year)}
        />
      </div>
      <div className="d-flex justify-content-around my-3">
        {isLoading ? (
          <MDBSpinner />
        ) : (
          <>
            <div className="bg-default rounded text-white d-flex flex-column py-1 px-3 text-center">
              <span className="fw-bold h4">{totalTransactionCount}</span>
              <small className="fw-bolder">TRANSACTIONS</small>
            </div>
            <div className="bg-default rounded text-white d-flex flex-column py-1 px-3 text-center">
              <span className="fw-bold h4">{currency(totalGrossSales)}</span>
              <small className="fw-bolder">GROSS SALES</small>
            </div>
            <div className="bg-default rounded text-white d-flex flex-column py-1 px-3 text-center">
              <span className="fw-bold h4">{currency(totalMenuExpenses)}</span>
              <small className="fw-bolder">EXPENSES</small>
            </div>
          </>
        )}
      </div>

      <div className="mx-2">
        <MDBTable bordered small striped responsive>
          <MDBTableHead>
            <tr className="text-center">
              <th scope="col">
                <span className="text-danger">Sun</span>
              </th>
              <th scope="col">Mon</th>
              <th scope="col">Tue</th>
              <th scope="col">Wed</th>
              <th scope="col">Thu</th>
              <th scope="col">Fri</th>
              <th scope="col">Sat</th>
            </tr>
          </MDBTableHead>
          <MDBTableBody>
            {parsedCalendarTable.map((chunks, y) => (
              <tr key={`chunk-${y}`}>
                {chunks.map(({ num = "" }, x) => {
                  // if no number, means its just a placeholder
                  if (!num)
                    return (
                      <td
                        key={`day-${x}`}
                        className="cursor-disabled table-active"
                      ></td>
                    );

                  const dateKey = `${Months[month]} ${num}, ${year}`,
                    breakdown = ledger[dateKey];

                  let _totalGrossSales = 0,
                    _totalTransactionCount = 0,
                    _totalExpenses = 0;

                  const cashiers = {};

                  if (breakdown) {
                    for (const {
                      totalSale = 0,
                      transactionCount = 0,
                      menuExpenses = 0,
                      cashier = {},
                    } of breakdown) {
                      _totalGrossSales += totalSale;
                      _totalTransactionCount += transactionCount;
                      _totalExpenses += menuExpenses;

                      const { lname = "", fname } = cashier.fullName,
                        cashierName = `${capitalize(
                          fname.split(" ")[0]
                        )} ${String(lname).charAt(0)}.`;

                      cashiers[cashierName] =
                        (cashiers[cashierName] || 0) + totalSale;
                    }
                  }

                  const focusDayOnClick = () => {
                    if (isSelectedMonthAndYearFuture) return;

                    const params = new URLSearchParams({
                      month,
                      year,
                      focusedDay: num,
                    });

                    history.push(`${pathname}?${params.toString()}`);
                  };

                  return (
                    <td
                      key={`day-${x}`}
                      className={`${
                        !isSelectedMonthAndYearFuture && "cursor-pointer"
                      }`}
                      onClick={focusDayOnClick}
                    >
                      <div
                        style={{ width: "25px" }}
                        className={`${
                          x === 0 && "text-danger"
                        } text-center mx-auto ${
                          !isSelectedMonthAndYearFuture && "mb-2"
                        }`}
                      >
                        <small id="date">{num}</small>
                      </div>
                      {!isSelectedMonthAndYearFuture && breakdown && (
                        <>
                          {/* only display breakdowns if manager is viewing ledger */}
                          {activePlatform === "manager" && (
                            <>
                              {Object.entries(cashiers).map(([key, value]) => (
                                <MDBAlert
                                  key={key}
                                  color="primary"
                                  className="my-0 py-0 px-1 d-flex justify-content-between"
                                >
                                  <span>{key}:</span> {currency(value)}
                                </MDBAlert>
                              ))}
                              <hr />
                            </>
                          )}

                          <MDBAlert
                            color="warning"
                            className="my-0 py-0 px-1 d-flex justify-content-between"
                          >
                            <span>Transactions:</span> {_totalTransactionCount}
                          </MDBAlert>
                          <MDBAlert
                            color="success"
                            className="my-0 py-0 px-1 d-flex justify-content-between"
                          >
                            <span>Sale:</span> {currency(_totalGrossSales)}
                          </MDBAlert>
                          <MDBAlert
                            color="danger"
                            className="my-0 py-0 px-1 d-flex justify-content-between"
                          >
                            <span>Expenses:</span> {currency(_totalExpenses)}
                          </MDBAlert>
                        </>
                      )}
                    </td>
                  );
                })}
              </tr>
            ))}
          </MDBTableBody>
        </MDBTable>
      </div>
    </div>
  );
}
