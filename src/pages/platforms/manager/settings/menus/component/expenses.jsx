import React from "react";
import { MDBInput, MDBRow, MDBCol } from "mdbreact";

const expenseCodes = [
  {
    code: "Tf",
    label: "Technical Fee (TF)",
    title: "Bayad sa nagsagawa ng procedure (e.g., sonologist, med tech)",
  },
  {
    code: "Pf",
    label: "Professional Fee (PF)",
    title:
      "Bayad sa nagbasa o nag-interpret ng resulta (e.g., radiologist, pathologist)",
  },
  {
    code: "Rf",
    label: "Referral Fee (RF)",
    title: "Incentive o share ng nag-refer ng pasyente (doktor o ahente)",
  },
];

export default function CostBreakdown({ form, setForm }) {
  const capital = form.capital || {};
  const expenses = Array.isArray(form.expenses) ? form.expenses : [];

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
  const getExpenseValue = (code) => {
    const found = expenses.find((e) => Object.keys(e)[0] === code);
    return found ? found[code] : 0;
  };

  const handleExpenseChange = (code, value) => {
    const numVal = Number(value);
    let _expenses = [...expenses];
    const index = _expenses.findIndex((e) => Object.keys(e)[0] === code);

    if (numVal === 0 || isNaN(numVal)) {
      if (index > -1) _expenses.splice(index, 1);
    } else {
      if (index > -1) {
        _expenses[index] = { [code]: numVal };
      } else {
        _expenses.push({ [code]: numVal });
      }
    }

    setForm({ ...form, expenses: _expenses });
  };

  // 💰 Totals
  const capitalTotal = ["Pre", "Ana", "Pos"].reduce(
    (sum, key) => sum + (capital?.[key] ?? 0),
    0
  );
  const expensesTotal = expenseCodes.reduce(
    (sum, { code }) => sum + (getExpenseValue(code) || 0),
    0
  );
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
            title="Gastos habang ginagawa ang test — reagents, machine use, tech time"
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
          <strong>Total Capital:</strong> ₱{capitalTotal.toFixed(2)}
        </MDBCol>
      </MDBRow>

      {/* 🔴 Expense Group */}
      <h6 className="mt-4 font-weight-bold text-danger">Other Expenses</h6>
      <MDBRow>
        {expenseCodes.map(({ code, label, title }) => (
          <MDBCol md="4" key={code}>
            <MDBInput
              type="number"
              label={label}
              title={title}
              value={getExpenseValue(code)}
              onChange={(e) => handleExpenseChange(code, e.target.value)}
            />
          </MDBCol>
        ))}
      </MDBRow>

      <MDBRow className="mt-2">
        <MDBCol md="4">
          <strong>Total Expenses:</strong> ₱{expensesTotal.toFixed(2)}
        </MDBCol>
      </MDBRow>

      {/* ⚫ Grand Total */}
      <MDBRow className="mt-4">
        <MDBCol md="6">
          <h5 className="font-weight-bold">
            💸 Grand Total Cost:{" "}
            <span className="text-success">₱{grandTotal.toFixed(2)}</span>
          </h5>
        </MDBCol>
      </MDBRow>
    </>
  );
}
