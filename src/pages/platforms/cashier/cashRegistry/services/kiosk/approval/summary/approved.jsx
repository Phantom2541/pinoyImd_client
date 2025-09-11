import { MDBCol, MDBBtn, MDBIcon } from "mdbreact";
import { currency } from "../../../../../../../../services/utilities";
import { capitalize, isEmpty } from "lodash";

const AuthorizedSummary = ({
  cart = 0,
  gross = 0,
  discount = 0,
  amount = 0,
  handleSubmit,
  formSubmitted = false,
  cash,
  payment,
  setCash,
  setPayment,
  category,
}) => {
  return (
    <MDBCol md="4">
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
              <td className="table-price">{currency.format(gross)}</td>
            </tr>
            <tr>
              <td>Discount</td>
              <td className="table-price">{currency.format(discount)}</td>
            </tr>
            <tr>
              <td>Net Amount</td>
              <td className="table-price">{currency.format(amount)}</td>
            </tr>
            <tr>
              <td>Payment</td>
              <td className="p-0">
                {category === "opd" ? (
                  <select
                    value={payment}
                    onChange={({ target }) => setPayment(target.value)}
                  >
                    {["cash", "gcash", "cheque"]?.map((payment, index) => (
                      <option key={`${payment}-${index}`} value={payment}>
                        {capitalize(payment)}
                      </option>
                    ))}
                  </select>
                ) : (
                  <span className="text-right d-block"> Voucher</span>
                )}
              </td>
            </tr>
            <tr>
              <td colSpan="2">
                {["cash"].includes(payment) && category === "opd" ? (
                  <input
                    type="number"
                    min={amount}
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
          disabled={isEmpty(cart) || formSubmitted}
          className="m-0 w-100 fw-bold mt-3"
          color="success"
        >
          Complete Transaction
          {formSubmitted && <MDBIcon icon="spinner" className="ml-2" pulse />}
        </MDBBtn>
      </form>
    </MDBCol>
  );
};

export default AuthorizedSummary;
