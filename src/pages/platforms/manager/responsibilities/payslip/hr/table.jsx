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
  console.log("payslip", payslip);
  //comment for darrel

  // //console.log("earnings", totEarn);

  // //console.log("deductions", totDeduc);

  // optimized by darrel
  const _payroll = payroll[0];
  useEffect(() => {
    if (payslip) {
      setCola(rate.cola);
      setHoliday(payroll[0]?.breakdown?.earn?.holiday);
      setOTn(payroll[0]?.breakdown?.earn?.overtime.number * rate.daily);
      setBonus(payroll[0]?.breakdown?.earn?.bonus);

      setAbsent(payroll[0]?.breakdown?.deduction?.absent * rate.daily);
      setCa(payroll[0]?.breakdown?.deduction?.ca);
      setSss(payroll[0]?.breakdown?.deduction?.sss);
      setLoan(payroll[0]?.breakdown?.deduction?.loan);
      setPh(payroll[0]?.breakdown?.deduction?.ph);
      setPi(Number(payroll[0]?.breakdown?.deduction?.pi));

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
            <td className="py-0 ">{currency(rate.monthly)}</td>
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
