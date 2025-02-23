import React, { useEffect, useState } from "react";
import { MDBTable } from "mdbreact";
import { currency } from "../../../../../../services/utilities";

export default function Table() {
  const payslip = JSON.parse(localStorage.getItem("payslip")),
    { rate, payroll } = payslip,
    // Earning
    [cola, setCola] = useState(0),
    [holiday, setHoliday] = useState(0),
    [oTn, setOTn] = useState(0),
    [bonus, setBonus] = useState(0),
    // Deductions
    [absent, setAbsent] = useState(0),
    [ca, setCa] = useState(0),
    [sss, setSss] = useState(0),
    [loan, setLoan] = useState(0),
    [ph, setPh] = useState(0), // phil health
    [pi, setPi] = useState(0), // pag ibig
    // total
    [totDeduc, setTotDeduc] = useState(0),
    [totEarn, setTotEarn] = useState(0);

  //comment for darrel
  // useEffect(() => {
  //   if (payslip) {
  //     setCola(rate.cola / 2);
  //     setHoliday(payroll[0]?.breakdown?.income?.holiday);
  //     setOTn(payroll[0]?.breakdown?.income?.overtime.number * rate.daily);
  //     setBonus(payroll[0]?.breakdown?.income?.bonus);

  //     setAbsent(payroll[0]?.breakdown?.Deduction?.absent * rate.daily);
  //     setCa(payroll[0]?.breakdown?.Deduction?.ca);
  //     setSss(payroll[0]?.breakdown?.Deduction?.sss);
  //     setLoan(payroll[0]?.breakdown?.Deduction?.loan);
  //     setPh(payroll[0]?.breakdown?.Deduction?.ph);
  //     setPi(Number(payroll[0]?.breakdown?.Deduction?.pi));

  //     setTotEarn(cola + oTn + holiday + bonus);
  //     setTotDeduc(absent + ca + sss + loan + ph + pi);
  //   }
  // }, [payslip, payroll[0]]);

  // //console.log("earnings", totEarn);

  // //console.log("deductions", totDeduc);

  // optimized by darrel
  const _payroll = payroll[0];
  useEffect(() => {
    if (payslip) {
      const { breakdown = {} } = payroll[0] || {};
      const { income = {}, Deduction = {} } = breakdown || {};
      const { holiday: _holiday, overtime = {}, bonus } = income;
      setCola(rate.cola / 2);
      setHoliday(_holiday);
      setOTn(overtime.number * rate.daily);
      setBonus(income?.bonus);

      setAbsent(Deduction?.absent * rate.daily);
      setCa(Deduction?.ca);
      setSss(Deduction?.sss);
      setLoan(Deduction?.loan);
      setPh(Deduction?.ph);
      setPi(Number(Deduction?.pi));

      setTotEarn(cola + oTn + holiday + bonus);
      setTotDeduc(absent + ca + sss + loan + ph + pi);
    }
  }, [
    payslip,
    _payroll,
    loan,
    oTn,
    holiday,
    bonus,
    rate.daily,
    rate.cola,
    payroll,
    absent,
    ca,
    cola,
    ph,
    pi,
    sss,
  ]);

  return (
    <div>
      <MDBTable bordered small>
        <thead>
          <tr>
            <th></th>
            <th>Earnings</th>
            <th></th>
            <th>Deductions</th>
          </tr>
        </thead>
        <tbody>
          <tr>
            <td className="py-0 ">Rate</td>
            <td className="py-0 ">{currency(rate.monthly / 2)}</td>
            <td className="py-0 ">Cash Advance</td>
            <td className="py-0 "> {currency(ca)} </td>
          </tr>
          <tr>
            <td className="py-0 ">COLA</td>
            <td className="py-0 "> {currency(cola)} </td>
            <td className="py-0 ">Absent</td>
            <td className="py-0 "> {currency(absent)} </td>
          </tr>
          <tr>
            <td className="py-0 ">Holiday</td>
            <td className="py-0 "> {currency(holiday)} </td>
            <td className="py-0 ">Loan</td>
            <td className="py-0 "> {currency(loan)} </td>
          </tr>
          <tr>
            <td className="py-0 ">Over Time</td>
            <td className="py-0 ">{currency(oTn)} </td>
            <td className="py-0 ">Phil. Health</td>
            <td className="py-0 "> {currency(ph)} </td>
          </tr>
          <tr>
            <td className="py-0 ">Bonus</td>
            <td className="py-0 "> {currency(bonus)} </td>
            <td className="py-0 ">SSS</td>
            <td className="py-0 "> {currency(sss)} </td>
          </tr>
          <tr>
            <td className="py-0 "></td>
            <td className="py-0 "> </td>
            <td className="py-0 ">Pag-ibig</td>
            <td className="py-0 "> {currency(pi)} </td>
          </tr>
          <tr>
            <td className="py-0 ">Total :</td>
            <td className="py-0 "> {currency(totEarn)} </td>
            <td className="py-0 "> </td>
            <td className="py-0 "> {currency(totDeduc)} </td>
          </tr>
        </tbody>
      </MDBTable>
      NET SALARY : <b>{currency(payroll[0]?.breakdown?.net)}</b>
    </div>
  );
}
