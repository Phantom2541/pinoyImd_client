import React from 'react';
import './index.css';
import { currency, generateCalendar } from '../../../../../../services/utilities';
import { useSelector } from 'react-redux';
import { MDBIcon } from 'mdbreact';
import { useLocation, useHistory } from 'react-router-dom';
import DailySaleModal from '../dailySaleModal';

// const today = new Date();

export default function Calendar({ month, year }) {
  const { isLoading: authLoader } = useSelector(({ auth }) => auth),
    { census, censusLoading: isLoading } = useSelector(({ sales }) => sales),
    { expenses, grossSales, patients } = census,
    { pathname } = useLocation(),
    history = useHistory();
  // { activePortal } = useSelector(({ auth }) => auth);
  // isManager = activePortal === "manager";

  return (
    <>
      <div className="pos-ledger-calendar">
        <div className="pos-ledger-calendar-header">
          <span>
            <small>Expenses</small> - {currency(expenses)}
          </span>
          <span>
            <small> Gross Sales</small> - {currency(grossSales)}
          </span>
          <span>
            <small>Patients</small> - {patients}
          </span>
        </div>
        <div className="pos-ledger-calendar-weeks">
          <div>Sun</div>
          <div>Mon</div>
          <div>Tue</div>
          <div>Wed</div>
          <div>Thu</div>
          <div>Fri</div>
          <div>Sat</div>
        </div>
        <div className="pos-ledger-calendar-daily">
          {generateCalendar(month, year).map(({ num, txt = '' }, index) => {
            const today = new Date(); // Assuming 'today' is defined somewhere in your code
            const { sales = [], total = 0 } = census?.daily?.[txt] || {};
            const isEmpty = !sales.length; // reverse sales.length to see if its empty
            const date = new Date(txt);
            const week = txt.slice(0, 3);
            const isFuture = date > today;

            const employee = sales.reduce((acc, sale) => {
              // Check if sale.cashierId and sale.cashierId.fullName are defined before accessing fullName.fname
              const cashierName = sale.cashierId?.fullName?.fname;
              if (cashierName) {
                // Only proceed if cashierName is defined
                if (!acc[cashierName]) {
                  acc[cashierName] = 0;
                }
                acc[cashierName] += sale.amount;
              }
              return acc;
            }, {});

            return (
              <div
                key={`pos-calendar-${index}`}
                onClick={() => {
                  if (isFuture || isEmpty) {
                    history.push(pathname);
                    return;
                  }

                  const modalTitle = new Date(year, month, num).toDateString(),
                    startDate = new Date(year, month, num).setHours(0, 0, 0, 0),
                    endDate = new Date(year, month, num).setHours(23, 59, 59, 999);

                  const queryParams = new URLSearchParams({
                    dailyFilter: 1,
                    startDate,
                    endDate,
                    modalTitle,
                  }).toString();

                  history.push(`${pathname}?${queryParams}`);
                }}
              >
                {num && (
                  <span className="text-left">
                    <small className={`${week === 'Sun' && 'sunday'}`}>{num}</small>

                    {isFuture ? (
                      <>
                        <br />
                        <hr />
                        <br />
                      </>
                    ) : isLoading ? (
                      <MDBIcon icon="spinner" pulse />
                    ) : isEmpty ? (
                      <span>No patients</span>
                    ) : (
                      <>
                        <strong>Cashier</strong>
                        {Object.entries(employee).map(([key, value]) => (
                          <p key={key}>
                            <strong>{key}:</strong> {currency(value)}
                          </p>
                        ))}
                        <hr />
                        <p>Daily sales - {currency(total)}</p>
                        <p>Patients - {sales.length}</p>
                      </>
                    )}
                  </span>
                )}
              </div>
            );
          })}
        </div>
      </div>
      {!authLoader && <DailySaleModal />}
    </>
  );
}
