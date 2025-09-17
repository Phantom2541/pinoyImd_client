import { MDBCol, MDBBtn } from "mdbreact";
import { capitalize } from "lodash";
import { useState } from "react";
import { computeCP, currency } from "../../../../../../services/utilities";
import { useSelector } from "react-redux";
import RollingNumber from "../../../../../../components/rollingNumber";
const Summary = () => {
  const { cart } = useSelector(({ appointments }) => appointments),
    [payment, setPayment] = useState("cash"),
    [cash, setCash] = useState(0),
    { gross, discount, net } = computeCP(cart);

  const handleSubmit = (e) => {
    e.preventDefault();
  };
  return (
    <MDBCol md="5">
      <form onSubmit={handleSubmit}>
        <table className="summary-table">
          <thead>
            <tr>
              <th colSpan="2" className="th-custom">
                summary
              </th>
            </tr>
          </thead>
          <tbody>
            <tr>
              <td>Gross Amount</td>
              <td className="table-price text-right">
                {currency.format(gross)}
              </td>
            </tr>
            <tr>
              <td>Discount</td>
              <td className="table-price  text-right">
                {currency.format(discount)}
              </td>
            </tr>
            <tr>
              <td>Net Amount</td>
              <td className="table-price  text-right">
                {currency.format(net)}
              </td>
            </tr>
            <tr>
              <td>Payment</td>
              <td className="p-0">
                <select
                  value={payment}
                  onChange={({ target }) => setPayment(target.value)}
                >
                  {["cash", "gcash"]?.map((payment, index) => (
                    <option key={`${payment}-${index}`} value={payment}>
                      {capitalize(payment)}
                    </option>
                  ))}
                </select>
              </td>
            </tr>
            <tr>
              <td colSpan="2">
                {["cash"].includes(payment) ? (
                  <input
                    type="number"
                    min={net}
                    value={String(cash)}
                    onChange={({ target }) => setCash(Number(target.value))}
                    placeholder="Amount in Peso"
                    required
                    name="amount"
                  />
                ) : (
                  <span>No cash input needed</span>
                )}
              </td>
            </tr>
          </tbody>
        </table>
        <MDBBtn
          type="submit"
          className="m-0 w-100 fw-bold mt-3"
          disabled={cart.length === 0}
          color="success"
        >
          Complete Transaction
        </MDBBtn>
      </form>
    </MDBCol>
  );
};

export default Summary;
