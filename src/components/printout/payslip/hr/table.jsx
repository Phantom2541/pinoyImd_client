import { toWords } from "number-to-words";
import Header from "./header";
import { currency } from "../../../../services/utilities";
export default function Table() {
  const payslip = JSON.parse(localStorage.getItem("payslip"));
  const { breakdown = {}, rate = {}, branch = {} } = payslip || {};
  const { deduction = {}, earn = {} } = breakdown;

  const { overtime = 0, nightShift = 0, holiday } = earn;
  const { regular = { present: 0, absent: 0 }, special = 0 } = holiday;
  const { present = 0, absent = 0 } = regular || {};
  const hourlyRate = rate.daily / 8;
  const { late = {}, underTime = {} } = deduction;

  const lateUnderTimeShow = (obj) => {
    const { deduc = "", mins = "", no = "" } = obj;
    return `${no ? `(${no})` : ""} ${no && deduc ? " x " : ""} ${
      mins ? `${mins} minutes` : ""
    } ${
      deduc ? ` ${deduc || mins ? " = " : ""} ${currency.format(deduc)}` : ""
    }`;
  };

  return (
    <div>
      <table className="payslip">
        <Header branch={branch} payslip={payslip} />
        <tbody>
          <tr>
            <td className="bg-info py-1  px-1 " style={{ width: "22%" }}>
              Earnings
            </td>
            <td className="bg-info py-1   px-1  payslip-amount-earnings-printout ">
              Amount
            </td>
            <td
              className="bg-info py-1   px-1  payslip-amount-earnings-printout "
              style={{ width: "24%" }}
            >
              Deductions
            </td>
            <td
              className="bg-info py-1   px-1  payslip-amount-deductions-printout "
              style={{ width: "27%" }}
            >
              Amount
            </td>
          </tr>
          <tr>
            <td className="py-0   px-1  ">Monthly</td>
            <td className="py-0 text-right   px-1 ">
              {currency.format(rate.monthly)}
            </td>
            <td className="py-0   px-1 ">Cash Advance</td>
            <td className="py-0   px-1  text-right ">
              {" "}
              {currency.format(deduction?.ca)}{" "}
            </td>
          </tr>
          <tr>
            <td className="py-0   px-1 ">Daily</td>
            <td className="py-0 text-right   px-1 ">
              {currency.format(rate?.daily)}{" "}
            </td>
            <td className="py-0   px-1 ">Absent </td>
            <td className="py-0   px-1 ">
              {deduction.absent ? (
                <div className="d-flex align-items-center justify-content-between">
                  <span>{deduction.absent} days</span>
                  <span>{currency.format(deduction.absent * rate?.daily)}</span>
                </div>
              ) : (
                "-"
              )}
            </td>
          </tr>
          <tr>
            <td className="py-0 px-1  ">COLA</td>
            <td className="py-0 px-1  text-right">
              {currency.format(rate?.cola)}{" "}
            </td>
            <td className="py-0 px-1  ">Loan</td>
            <td className="py-0 px-1  text-right">
              {currency.format(deduction?.loan)}{" "}
            </td>
          </tr>
          <tr>
            <td className="py-0   px-1  " style={{ verticalAlign: "middle" }}>
              Regular Holiday{" "}
            </td>
            <td className="py-0   px-1 ">
              <div className="d-flex align-items-center justify-content-between">
                {present ? (
                  <>
                    <span>{present}days P</span>
                    <span>{currency.format(present * rate?.daily * 2)}</span>
                  </>
                ) : (
                  "P -"
                )}
              </div>
              <div className="d-flex align-items-center justify-content-between">
                {absent ? (
                  <>
                    <span>{absent}days A</span>
                    <span>{currency.format(absent * rate?.daily)}</span>
                  </>
                ) : (
                  "A -"
                )}
              </div>
            </td>
            <td className="py-0   px-1 " style={{ verticalAlign: "middle" }}>
              Late
            </td>
            <td
              className="py-0   px-1  text-right"
              style={{ verticalAlign: "middle" }}
            >
              {lateUnderTimeShow(late)}
            </td>
          </tr>
          <tr>
            <td className="py-0   px-1 ">Special Holiday</td>
            <td className="py-0   px-1 ">
              {special ? (
                <div className="d-flex align-items-center justify-content-between">
                  <span>{special}days</span>
                  <span>{currency.format(special * rate?.daily * 1.3)}</span>
                </div>
              ) : (
                "-"
              )}
            </td>
            <td className="py-0   px-1 ">Under Time</td>
            <td className="py-0 text-right   px-1 ">
              {lateUnderTimeShow(underTime)}
            </td>
          </tr>
          <tr>
            <td className="py-0   px-1 ">Night Shift </td>
            <td className="py-0   px-1 ">
              {nightShift ? (
                <div className="d-flex align-items-center justify-content-between">
                  <span>{nightShift}hrs</span>
                  <span>{currency.format(nightShift * hourlyRate * 0.1)}</span>
                </div>
              ) : (
                "-"
              )}
            </td>
            <td className="py-0   px-1 ">Phil. Health</td>

            <td className="py-0 text-right   px-1 ">
              {currency.format(deduction?.ph)}{" "}
            </td>
          </tr>
          <tr>
            <td className="py-0   px-1 ">Over Time </td>
            <td className="py-0   px-1 ">
              {earn?.overtime ? (
                <div className="d-flex align-items-center justify-content-between">
                  <span>{earn?.overtime}hrs</span>
                  <span>{currency.format(overtime * hourlyRate * 1.25)}</span>
                </div>
              ) : (
                "-"
              )}
            </td>
            <td className="py-0  px-1  ">SSS</td>
            <td className="py-0   px-1 text-right">
              {currency.format(deduction?.sss)}{" "}
            </td>
          </tr>
          <tr>
            <td className="py-0   px-1 ">Bonus</td>
            <td className="py-0   px-1  text-right">
              {" "}
              {currency.format(earn?.bonus)}{" "}
            </td>
            <td className="py-0   px-1 ">Pag-ibig</td>
            <td className="py-0   px-1 text-right">
              {currency.format(deduction?.pi)}{" "}
            </td>
          </tr>
          <tr>
            <td className="py-0   px-1 ">Gross Earnings :</td>
            <td className="py-0 font-weight-bold text-right   px-1 ">
              {currency.format(earn?.total)}{" "}
            </td>
            <td className="py-0   px-1 ">Total Deductions </td>
            <td className="py-0   px-1  font-weight-bold text-right">
              {currency.format(deduction?.total)}{" "}
            </td>
          </tr>
          <tr>
            <td
              className="py-0   px-1 "
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
              className="py-0 m-0 p-0   px-1  border bg-info text-center font-weight-bold"
              colSpan={2}
            >
              NET PAY
            </td>
          </tr>
          <tr>
            <td
              className="py-0 m-0   px-1  p-0 border text-center bg-light font-weight-bold"
              colSpan={2}
              style={{ fontSize: "1.2rem" }}
            >
              {currency.format(breakdown?.net)}
            </td>
          </tr>
          <tr>
            <td className="py-0 m-0  px-1 p-0 border text-center" colSpan={2}>
              <i> {toWords(breakdown?.net).toUpperCase()}</i>
            </td>
          </tr>
        </tbody>
      </table>
    </div>
  );
}
