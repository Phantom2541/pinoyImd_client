import { MDBBtn, MDBIcon, MDBTable, MDBTableBody, MDBTableHead } from 'mdbreact';
import React from 'react';
import Months from '../../../../../../services/fakeDb/calendar/months';
import { useHistory, useLocation } from 'react-router-dom';
import BreakdownTable from './breakdown';
import { useDispatch } from 'react-redux';
import { RESET } from '../../../../../../services/redux/slices/commerce/sales';

const today = new Date();

export default function CalendarMini({
  ledger,
  focusedDay,
  year,
  month,
  parsedCalendarTable,
  isSelectedMonthAndYearFuture,
  prev,
  disablePrevOnLastChoice,
  next,
  disableNextOnLastChoice,
  exitMiniView
}) {
  const { pathname } = useLocation(),
    history = useHistory(),
    dispatch = useDispatch()

  return (
    <div>
      <div className="bg-white rounded py-1" style={{ width: '300px' }}>
        <div className="d-flex align-items-center justify-content-between">
          <MDBBtn
            onClick={() => prev(false)}
            disabled={disablePrevOnLastChoice()}
            size="sm"
            color="white"
            className="z-depth-0"
          >
            <MDBIcon icon="angle-left" />
          </MDBBtn>
          <span onClick={exitMiniView}>
            <strong className="cursor-pointer h4-responsive">{year}</strong>&nbsp;
            <strong className="cursor-pointer h4-responsive">{Months[month]}</strong>
          </span>
          <MDBBtn
            onClick={() => {
              const _month = month === 11 ? 0 : month + 1,
                _year = month === 11 ? year + 1 : year;

              // checks if the next month and year are future
              const nextMonthAndYearIsFuture =
                _year > today.getFullYear() ||
                (_year === today.getFullYear() && _month > today.getMonth());

              next(nextMonthAndYearIsFuture); // resets the focusedDay if true
            }}
            disabled={disableNextOnLastChoice()}
            size="sm"
            color="white"
            className="z-depth-0"
          >
            <MDBIcon icon="angle-right" />
          </MDBBtn>
        </div>
        <div className="mx-2">
          <MDBTable small striped>
            <MDBTableHead>
              <tr className="text-center">
                <th scope="col">
                  <span className="text-danger">S</span>
                </th>
                <th scope="col">M</th>
                <th scope="col">T</th>
                <th scope="col">W</th>
                <th scope="col">TH</th>
                <th scope="col">F</th>
                <th scope="col">S</th>
              </tr>
            </MDBTableHead>
            <MDBTableBody>
              {parsedCalendarTable.map((chunks, y) => (
                <tr key={`chunk-${y}`}>
                  {chunks.map(({ num = '' }, x) => {
                    // if no number, means its just a placeholder
                    if (!num)
                      return <td key={`day-${x}`} className="cursor-disabled table-active"></td>;

                    const focusDayOnClick = () => {
                      if (isSelectedMonthAndYearFuture) return;

                      const params = new URLSearchParams({
                        month,
                        year,
                        focusedDay: num,
                      });

                      history.push(`${pathname}?${params.toString()}`);
                      dispatch(RESET({ resetCollections: true}));
                    };

                    return (
                      <td
                        key={`day-${x}`}
                        className={`${!isSelectedMonthAndYearFuture && 'cursor-pointer'}`}
                        onClick={focusDayOnClick}
                      >
                        <div
                          style={{ width: '25px', height: '25px' }}
                          className={`d-flex align-items-center justify-content-center ${
                            x === 0 && focusedDay !== num && 'text-danger'
                          } ${focusedDay === num && 'bg-primary text-white rounded-circle'}`}
                        >
                          <div>{num}</div>
                        </div>
                      </td>
                    );
                  })}
                </tr>
              ))}
            </MDBTableBody>
          </MDBTable>
        </div>
      </div>
      <BreakdownTable ledger={ledger} focusedDay={focusedDay} year={year} month={month} />
    </div>
  );
}
