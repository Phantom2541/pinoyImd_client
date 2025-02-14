import { MDBTable, MDBTableBody, MDBTableHead } from "mdbreact";
import React from "react";
import Months from "../../../../../../services/fakeDb/calendar/months";
import { currency, nickname } from "../../../../../../services/utilities";

export default function BreakdownTable({ focusedDay, ledger, year, month }) {
  const dateKey = `${Months[month]} ${focusedDay}, ${year}`,
    breakdown = ledger[dateKey] || [];

  const calculateBreakdowns = (_breakdown) => {
    let _totalGrossSales = 0,
      _totalTransactionCount = 0;

    const cashiers = {};

    for (const {
      totalSale = 0,
      transactionCount = 0,
      cashier = {},
    } of _breakdown) {
      _totalGrossSales += totalSale;
      _totalTransactionCount += transactionCount;

      const cashierName = nickname(cashier.fullName);

      // Initialize or update cashier entry
      if (!cashiers[cashierName]) {
        cashiers[cashierName] = {
          _totalGrossSales: 0,
          _totalTransactionCount: 0,
        };
      }

      // Accumulate data for each cashier
      cashiers[cashierName]._totalGrossSales += totalSale;
      cashiers[cashierName]._totalTransactionCount += transactionCount;
    }

    return {
      totalTransactionCount: _totalTransactionCount,
      totalGrossSales: _totalGrossSales,
      cashiers,
    };
  };

  const { totalTransactionCount, totalGrossSales, cashiers } =
      calculateBreakdowns(breakdown),
    cashierMapped = Object.entries(cashiers);

  return (
    <div className="mt-2 bg-white rounded p-1" style={{ width: "300px" }}>
      <strong className="h6-responsive ml-2">Breakdown</strong>
      <MDBTable>
        <MDBTableHead>
          <tr className="text-right cursor-help">
            <th scope="col" className="text-left" title="Cashier">
              Cashier
            </th>
            <th scope="col" title="Deals">
              Deals
            </th>
            <th scope="col" title="Gross Sale">
              Gross
            </th>
          </tr>
        </MDBTableHead>
        <MDBTableBody>
          {cashierMapped.map(([key, value]) => {
            const { _totalGrossSales, _totalTransactionCount } = value;

            return (
              <tr className="text-right" key={key}>
                <td className="text-left" title="Description">
                  {key}
                </td>
                <td title="Transactions">{_totalTransactionCount}</td>
                <td title="Gross Sale">{currency(_totalGrossSales, true)}</td>
              </tr>
            );
          })}
          <tr className="text-right">
            <td className="text-left fw-bold" title="Description">
              Total
            </td>
            <td title="Transactions" className="fw-bold">
              {totalTransactionCount}
            </td>
            <td title="Gross Sale" className="fw-bold">
              {currency(totalGrossSales, true)}
            </td>
          </tr>
          {!cashierMapped.length && (
            <tr>
              <td
                colSpan={4}
                className="text-center cursor-help"
                title="Empty breakdown"
              >
                No transaction
              </td>
            </tr>
          )}
        </MDBTableBody>
      </MDBTable>
    </div>
  );
}
