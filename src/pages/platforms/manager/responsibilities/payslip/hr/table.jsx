import { useSelector } from "react-redux";
import { MDBTable } from "mdbreact";
import { toWords } from "number-to-words";
import { currency } from "../../../../../../services/utilities";
import Header from "./header";
export default function Table() {
  const { activePlatform } = useSelector(({ auth }) => auth);
  const payslip = JSON.parse(localStorage.getItem("payslip"));
  const { breakdown = {}, rate = {} } = payslip || {};
  const { deduction = {}, earn = {} } = breakdown;

  const { branch = {} } = activePlatform;
  const { overtime = 0, nightShift = 0, holiday } = earn;
  const { regular = { present: 0, absent: 0 }, special = 0 } = holiday;
  const { present = 0, absent = 0 } = regular;
  const hourlyRate = rate.daily / 8;

  return (
    <div>
      <MDBTable bordered small className="payslip" responsive>
        <Header branch={branch} payslip={payslip} />
        <tbody>
          <tr>
            <td className="bg-info py-1" style={{ width: "22%" }}>
              Earnings
            </td>
            <td className="bg-info py-1">Amount</td>
            <td className="bg-info py-1" style={{ width: "22%" }}>
              Deductions
            </td>
            <td className="bg-info py-1">Amount</td>
          </tr>
          <tr>
            <td className="py-0  ">Monthly</td>
            <td className="py-0 text-right ">{currency(rate.monthly)}</td>
            <td className="py-0 ">Cash Advance</td>
            <td className="py-0 "> {currency(deduction?.ca)} </td>
          </tr>
          <tr>
            <td className="py-0 ">Daily</td>
            <td className="py-0 text-right"> {currency(rate?.daily)} </td>
            <td className="py-0 ">Absent </td>
            <td className="py-0 ">
              {deduction.absent ? (
                <div className="d-flex align-items-center justify-content-between">
                  <span>{deduction.absent} days</span>
                  <span>{currency(deduction.absent * rate?.daily)}</span>
                </div>
              ) : (
                "-"
              )}
            </td>
          </tr>
          <tr>
            <td className="py-0 ">COLA</td>
            <td className="py-0 text-right"> {currency(rate?.cola)} </td>
            <td className="py-0 ">Loan</td>
            <td className="py-0 text-right"> {currency(deduction?.loan)} </td>
          </tr>
          <tr>
            <td className="py-0 " style={{ verticalAlign: "middle" }}>
              Regular Holiday{" "}
            </td>
            <td className="py-0 ">
              <div className="d-flex align-items-center justify-content-between">
                {present ? (
                  <>
                    <span>{present}days P</span>
                    <span>{currency(present * rate?.daily * 2)}</span>
                  </>
                ) : (
                  "P -"
                )}
              </div>
              <div className="d-flex align-items-center justify-content-between">
                {absent ? (
                  <>
                    <span>{absent}days A</span>
                    <span>{currency(absent * rate?.daily)}</span>
                  </>
                ) : (
                  "A -"
                )}
              </div>
            </td>
            <td className="py-0 " style={{ verticalAlign: "middle" }}>
              Phil. Health
            </td>
            <td
              className="py-0  text-right"
              style={{ verticalAlign: "middle" }}
            >
              {" "}
              {currency(deduction?.ph)}{" "}
            </td>
          </tr>
          <tr>
            <td className="py-0 ">Special Holiday</td>
            <td className="py-0 ">
              {special ? (
                <div className="d-flex align-items-center justify-content-between">
                  <span>{special}days</span>
                  <span>{currency(special * rate?.daily * 1.3)}</span>
                </div>
              ) : (
                "-"
              )}
            </td>
            <td className="py-0 ">SSS</td>
            <td className="py-0 text-right"> {currency(deduction?.sss)} </td>
          </tr>
          <tr>
            <td className="py-0 ">Night Shift </td>
            <td className="py-0 ">
              {nightShift ? (
                <div className="d-flex align-items-center justify-content-between">
                  <span>{nightShift}hrs</span>
                  <span>{currency(nightShift * hourlyRate * 0.1)}</span>
                </div>
              ) : (
                "-"
              )}
            </td>
            <td className="py-0 ">Pag-ibig</td>
            <td className="py-0 text-right"> {currency(deduction?.pi)} </td>
          </tr>
          <tr>
            <td className="py-0 ">Over Time </td>
            <td className="py-0 ">
              {earn?.overtime ? (
                <div className="d-flex align-items-center justify-content-between">
                  <span>{earn?.overtime}hrs</span>
                  <span>{currency(overtime * hourlyRate * 1.25)}</span>
                </div>
              ) : (
                "-"
              )}
            </td>
            <td className="py-0 "></td>
            <td className="py-0 "> </td>
          </tr>
          <tr>
            <td className="py-0 ">Bonus</td>
            <td className="py-0 text-right"> {currency(earn?.bonus)} </td>
            <td className="py-0 "></td>
            <td className="py-0 "> </td>
          </tr>
          <tr>
            <td className="py-0 ">Gross Earnings :</td>
            <td className="py-0 font-weight-bold text-right">
              {currency(earn?.total)}{" "}
            </td>
            <td className="py-0 ">Total Deductions </td>
            <td className="py-0 font-weight-bold text-right">
              {currency(deduction?.total)}{" "}
            </td>
          </tr>
          <tr>
            <td
              className="py-0 "
              colSpan={2}
              rowSpan={3}
              style={{
                verticalAlign: "middle",
                textAlign: "center",
              }}
            >
              <div style={{ marginBottom: "-1.2rem" }}>
                <div
                  style={{
                    borderBottom: "1px solid black",
                    width: "80%",
                    margin: "0 auto",
                  }}
                ></div>

                <p style={{ margin: "5px 0 0 0", fontSize: "0.9rem" }}>
                  Authorized Signature
                </p>
              </div>
            </td>

            <td
              className="py-0 m-0 p-0 border bg-info text-center font-weight-bold"
              colSpan={2}
            >
              NET PAY
            </td>
          </tr>
          <tr>
            <td
              className="py-0 m-0 p-0 border text-center bg-light font-weight-bold"
              colSpan={2}
              style={{ fontSize: "1.2rem" }}
            >
              {currency(breakdown?.net)}
            </td>
          </tr>
          <tr>
            <td className="py-0 m-0 p-0 border text-center" colSpan={2}>
              <i> {toWords(breakdown?.net).toUpperCase()}</i>
            </td>
          </tr>
        </tbody>
      </MDBTable>
    </div>
  );
}
