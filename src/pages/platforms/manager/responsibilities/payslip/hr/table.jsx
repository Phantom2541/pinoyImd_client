import { useSelector } from "react-redux";
import { MDBTable } from "mdbreact";
import numWords from "num-words";
import { currency } from "../../../../../../services/utilities";
import Header from "./header";
export default function Table() {
  const { activePlatform } = useSelector(({ auth }) => auth);
  const payslip = JSON.parse(localStorage.getItem("payslip"));
  const { breakdown = {}, rate = {} } = payslip || {};
  const { deduction = {}, earn = {} } = breakdown;

  const { branch = {} } = activePlatform;

  return (
    <div>
      <MDBTable bordered small className="payslip">
        <Header branch={branch} payslip={payslip} />
        <tbody>
          <tr>
            <td className="bg-info py-1">Earnings</td>
            <td className="bg-info py-1">Amount</td>
            <td className="bg-info py-1">Deductions</td>
            <td className="bg-info py-1">Amount</td>
          </tr>
          <tr>
            <td className="py-0  ">Monthly</td>
            <td className="py-0 ">{currency(rate.monthly)}</td>
            <td className="py-0 ">Cash Advance</td>
            <td className="py-0 "> {currency(deduction?.ca)} </td>
          </tr>
          <tr>
            <td className="py-0 ">Daily</td>
            <td className="py-0 "> {currency(rate?.daily)} </td>
            <td className="py-0 ">Absent (days)</td>
            <td className="py-0 "> {deduction?.absent || "-"} </td>
          </tr>
          <tr>
            <td className="py-0 ">COLA</td>
            <td className="py-0 "> {currency(rate?.cola)} </td>
            <td className="py-0 ">Loan</td>
            <td className="py-0 "> {currency(deduction?.loan)} </td>
          </tr>
          <tr>
            <td className="py-0 ">Holiday (days)</td>
            <td className="py-0 "> {currency(earn?.holiday)} </td>
            <td className="py-0 ">Phil. Health</td>
            <td className="py-0 "> {currency(deduction?.ph)} </td>
          </tr>
          <tr>
            <td className="py-0 ">Over Time (hrs)</td>
            <td className="py-0 ">{earn?.overtime || "-"} </td>
            <td className="py-0 ">SSS</td>
            <td className="py-0 "> {currency(deduction?.sss)} </td>
          </tr>
          <tr>
            <td className="py-0 ">Bonus</td>
            <td className="py-0 "> {currency(earn?.bonus)} </td>
            <td className="py-0 ">Pag-ibig</td>
            <td className="py-0 "> {currency(deduction?.pi)} </td>
          </tr>
          <tr>
            <td className="py-0 ">Gross Earnings :</td>
            <td className="py-0 font-weight-bold"> {currency(earn?.total)} </td>
            <td className="py-0 ">Total Deductions </td>
            <td className="py-0 font-weight-bold">
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
              <i> {numWords(Math.round(breakdown?.net)).toUpperCase()}</i>
            </td>
          </tr>
        </tbody>
      </MDBTable>
    </div>
  );
}
