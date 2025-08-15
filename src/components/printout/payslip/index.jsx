import { useState, useEffect } from "react";
import Hr from "./hr/index";
import "./style.css";

export default function Payslip() {
  const [payroll, setPayroll] = useState({ _id: "" });
  const [onloaded, setOnloaded] = useState(false);

  useEffect(() => {
    setPayroll(JSON.parse(localStorage.getItem("payslip")));

    return () => localStorage.removeItem("payslip");
  }, []);

  useEffect(() => {
    if (onloaded) {
      setTimeout(() => {
        window.print();
      }, 500);
    }
  }, [onloaded]);

  if (!payroll?._id) return <div>Payroll is Empty</div>;

  return (
    <div className="d-flex align-items-center payslip-printout-container">
      <div className="payslip-hr-printout">
        <Hr payroll={payroll} onloaded={onloaded} setOnloaded={setOnloaded} />
        <i>HR copy</i>
      </div>
      <div className="payslip-cut-line">
        <span className="cut-icon">✂️</span>
      </div>
      <div className="ml-3 payslip-employee-printout">
        <Hr payroll={payroll} onloaded={onloaded} setOnloaded={setOnloaded} />
        <i>Employee's copy</i>
      </div>
    </div>
  );
}
