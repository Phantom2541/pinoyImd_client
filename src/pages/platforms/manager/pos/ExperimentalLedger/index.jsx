import React, { useEffect, useState } from 'react';
import Calendar from './calendar';
import { MDBBtn, MDBProgress, MDBTypography } from 'mdbreact';
import Swal from 'sweetalert2';
import axios from 'axios';
import { useSelector } from 'react-redux';
import Months from '../../../../../services/fakeDb/calendar/months';
import { useLocation, useHistory } from 'react-router-dom';
import FocusedSale from './focused';

const today = new Date();

export default function ExperimentalLedger() {
  const [showPopUp, setShowPopUp] = useState(false),
    [showProgress, setShowProgress] = useState(false),
    { search, pathname } = useLocation(),
    query = new URLSearchParams(search),
    month = query.get('month'),
    year = query.get('year'),
    focusedDay = query.get('focusedDay'),
    history = useHistory(),
    [progressBar, setProgressBar] = useState(0),
    { token, onDuty } = useSelector(({ auth }) => auth),
    [ledger, setLedger] = useState([]),
    [totalGrossSales, setTotalGrossSales] = useState(0),
    [totalTransactionCount, setTotalTransactionCount] = useState(0),
    [totalMenuExpenses, setTotalMenuExpenses] = useState(0),
    [autoCalculateResume, setAutoCalculateResume] = useState(false);

  // handler route for month, year and selected day
  useEffect(() => {
    if (!month && !year) {
      // this will only be true on first access to this link
      const currentDate = new Date();
      const params = new URLSearchParams({
        month: currentDate.getMonth(),
        year: currentDate.getFullYear(),
      });

      history.push(`${pathname}?${params.toString()}`);
    } 
  }, [month, year, history, pathname]);

  const isTodaySelected =
      Number(month) === today.getMonth() && Number(year) === today.getFullYear(),
    isSelectedMonthAndYearFuture =
      Number(year) > today.getFullYear() ||
      (Number(year) === today.getFullYear() && Number(month) > today.getMonth());

  // listener if the ledger calculation gets cut off
  useEffect(() => {
    // only check if the selected month is not a future
    if (!isSelectedMonthAndYearFuture) {
      const ledgerCalculation = localStorage.getItem(`${month}-${year}-ledgerCalculation`);

      if (ledgerCalculation) {
        setAutoCalculateResume(true);
        setShowPopUp(true);
      }
    }
  }, [isSelectedMonthAndYearFuture, month, year]);

  const calculateLedger = () =>
    Swal.fire({
      icon: 'warning',
      title: 'Warning',
      text: 'Calculating data for an entire month may take several minutes. Please do not leave this page while the process is ongoing.',
      showCancelButton: true,
      confirmButtonText: 'Continue',
    }).then(async (result) => {
      if (result.isConfirmed) {
        const lsName = `${month}-${year}-ledgerCalculation`; //local storage name

        const generatePayload = () => {
          const totalDays = new Date(year, month + 1, 0).getDate();

          let days = Array.from({ length: totalDays }, (_, i) => {
            const day = i + 1,
              start = new Date(year, month, day).setHours(0, 0, 0, 0),
              end = new Date(year, month, day).setHours(23, 59, 59, 999);

            return {
              day,
              start,
              end,
            };
          });

          if (autoCalculateResume) {
            days.splice(0, Number(localStorage.getItem(lsName) - 1)); // adjust a single day, to ensure that the cutoff date was fully calculated
          }

          return {
            branch: onDuty._id,
            days,
            month: Months[month],
            year,
          };
        };

        const { days, ...rest } = generatePayload();

        // initialize the showing of progressbar and hide popup
        setShowProgress(true);
        setShowPopUp(false);

        // sets total count for progress bar
        const max = days[days.length - 1]?.day;

        for (const value of days) {
          await axios.post(
            `finance/pre-calculated-daily-sale/calculate`,
            { ...rest, ...value },
            {
              headers: {
                Authorization: `QTracy ${token}`,
              },
            },
          );

          const progress = Math.round((value.day / max) * 100);

          setProgressBar(progress);

          if (progress < 100) {
            localStorage.setItem(lsName, value.day);
          } else {
            localStorage.removeItem(lsName);
            Swal.fire({
              icon: 'success',
              title: 'Calculation Complete',
              text: 'Your ledger has been calculated, please reload to reflect changes.',
              confirmButtonText: 'Continue',
            }).then(() => window.location.reload());
          }
        }
      }
    });

  const selectToday = () => {
    if (showPopUp) setShowPopUp(false);

    const params = new URLSearchParams({
      month: today.getMonth(),
      year: today.getFullYear(),
    });

    history.push(`${pathname}?${params.toString()}`);
  };

  return (
    <>
      {showPopUp && (
        <MDBTypography
          note
          noteColor="info"
          noteTitle={autoCalculateResume ? 'Incomplete Ledger ' : 'Empty Data Set '}
        >
          {autoCalculateResume
            ? 'Your previous calculation was not completed.'
            : 'The currently selected month and year do not have data calculated yet.'}
          <MDBBtn onClick={calculateLedger} size="sm" color="primary">
            {autoCalculateResume ? 'Click here to resume calculation' : 'Click here to calculate'}
          </MDBBtn>
        </MDBTypography>
      )}
      {showProgress && <MDBProgress min={1} value={progressBar} animated />}

      <div className={`${focusedDay && 'd-flex'}`}>
        <Calendar
          focusedDay={Number(focusedDay)}
          totalGrossSales={totalGrossSales}
          totalMenuExpenses={totalMenuExpenses}
          totalTransactionCount={totalTransactionCount}
          setTotalGrossSales={setTotalGrossSales}
          setTotalMenuExpenses={setTotalMenuExpenses}
          setTotalTransactionCount={setTotalTransactionCount}
          ledger={ledger}
          setLedger={setLedger}
          showProgress={showProgress}
          setShowPopUp={setShowPopUp}
          showPopUp={showPopUp}
          year={Number(year)}
          month={Number(month)}
          selectToday={selectToday}
          isTodaySelected={isTodaySelected}
          isSelectedMonthAndYearFuture={isSelectedMonthAndYearFuture}
        />
        {focusedDay && (
          <FocusedSale
            ledger={ledger}
            focusedDay={Number(focusedDay)}
            month={Number(month)}
            year={Number(year)}
          />
        )}
      </div>
    </>
  );
}
