import React from "react";
import { MDBInput, MDBRow, MDBCol } from "mdbreact";
import { currency } from "./../../../../../../services/utilities";

const expenseCodes = [
  {
    code: "Tf",
    label: "Technical Fee (TF)",
    title: "Bayad sa nagsagawa ng procedure (e.g., sonologist, med tech)",
  },
  {
    code: "Pf",
    label: "Professional Fee (%PF)",
    title:
      "Bayad sa nagbasa o nag-interpret ng resulta (e.g., radiologist, pathologist)",
  },
  {
    code: "Rf",
    label: "Referral Fee (%RF)",
    title: "Incentive o share ng nag-refer ng pasyente (doktor o ahente)",
  },
];

export default function CostBreakdown({ form, setForm }) {
  const capital = form.capital || {};
  const expenses = form.expenses || {};
  const srp = form?.opd || 0; // ✅ SRP galing sa form.opd

  // 🔵 Capital Handling
  const handleCapitalChange = (field, value) => {
    const numVal = Number(value);
    const newCapital = { ...capital };
    if (numVal === 0 || isNaN(numVal)) {
      delete newCapital[field];
    } else {
      newCapital[field] = numVal;
    }
    setForm({ ...form, capital: newCapital });
  };

  const getCapitalValue = (field) => capital?.[field] ?? 0;

  // 🔴 Expense Handling
  const handleExpenseChange = (code, value) => {
    const numVal = Number(value);
    const newExpenses = { ...expenses };
    if (numVal === 0 || isNaN(numVal)) {
      delete newExpenses[code];
    } else {
      newExpenses[code] = numVal;
    }
    setForm({ ...form, expenses: newExpenses });
  };

  // ✅ Default PF & RF = 10%
  const getExpenseValue = (code) => {
    if ((code === "Pf" || code === "Rf") && expenses?.[code] == null) {
      return 10;
    }
    return expenses?.[code] ?? 0;
  };

  // 💰 Totals
  const capitalTotal = ["Pre", "Ana", "Pos"].reduce(
    (sum, key) => sum + (capital?.[key] ?? 0),
    0
  );

  const expensesTotal = expenseCodes.reduce((sum, { code }) => {
    if (code === "Pf" || code === "Rf") {
      return sum + ((srp || 0) * (getExpenseValue(code) || 0)) / 100;
    }
    return sum + (getExpenseValue(code) || 0);
  }, 0);

  const grandTotal = capitalTotal + expensesTotal;

  return (
    <>
      {/* 🔵 Capital Group */}
      <h6 className="mt-3 font-weight-bold text-primary">Capital Breakdown</h6>
      <MDBRow>
        <MDBCol md="4">
          <MDBInput
            type="number"
            label="Pre-analytical"
            title="Gastos bago ang test tulad ng syringes, tubes, forms, at phlebotomy"
            value={getCapitalValue("Pre")}
            onChange={(e) => handleCapitalChange("Pre", e.target.value)}
          />
        </MDBCol>
        <MDBCol md="4">
          <MDBInput
            type="number"
            label="Analytical"
            title="Gastos habang ginagawa ang test — kabilang ang reagents, mga gamit at machine depreciation kada test"
            value={getCapitalValue("Ana")}
            onChange={(e) => handleCapitalChange("Ana", e.target.value)}
          />
        </MDBCol>
        <MDBCol md="4">
          <MDBInput
            type="number"
            label="Post-analytical"
            title="Gastos pagkatapos ng test — printing, validation, release, storage"
            value={getCapitalValue("Pos")}
            onChange={(e) => handleCapitalChange("Pos", e.target.value)}
          />
        </MDBCol>
      </MDBRow>

      <MDBRow className="mt-2">
        <MDBCol md="4">
          <strong>Total Capital:</strong> {currency.format(capitalTotal)}
        </MDBCol>
      </MDBRow>

      {/* 🔴 Expense Group */}
      <h6 className="mt-4 font-weight-bold text-danger">Other Expenses</h6>
      <MDBRow>
        {expenseCodes.map(({ code, label, title }) => (
          <MDBCol md="4" key={code}>
            <div className="d-flex align-items-center">
              <MDBInput
                type="number"
                label={label}
                title={title}
                value={getExpenseValue(code)}
                onChange={(e) => handleExpenseChange(code, e.target.value)}
              />
              {/* ✅ Special handling for PF & RF */}
              {(code === "Pf" || code === "Rf") && srp ? (
                <small className="ml-2 text-primary font-weight-bold">
                  = {currency.format((srp * getExpenseValue(code)) / 100)}
                </small>
              ) : null}
            </div>
          </MDBCol>
        ))}
      </MDBRow>

      <MDBRow className="mt-2">
        <MDBCol md="4">
          <strong>Total Expenses:</strong> {currency.format(expensesTotal)}
        </MDBCol>
      </MDBRow>

      {/* ⚫ Grand Total */}
      <MDBRow className="mt-4">
        <MDBCol md="6">
          <h5 className="font-weight-bold">
            💸 Grand Total Cost:{" "}
            <span className="text-success">{currency.format(grandTotal)}</span>
          </h5>
        </MDBCol>
      </MDBRow>
    </>
  );
}
