import { MDBCol, MDBBtn, MDBIcon } from "mdbreact";
import { currency } from "../../../../../../../../services/utilities";
import { isEmpty } from "lodash";

const Summary = ({
  cart = 0,
  gross = 0,
  discount = 0,
  amount = 0,
  handleSubmit,
  formSubmitted = false,
}) => {
  return (
    <MDBCol md="4">
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
            <td className="table-price">{currency(gross)}</td>
          </tr>
          <tr>
            <td>Discount</td>
            <td className="table-price">{currency(discount)}</td>
          </tr>
          <tr>
            <td>Net Amount</td>
            <td className="table-price">{currency(amount)}</td>
          </tr>
          <tr>
            <td>Payment</td>
            <td className="p-0 text-right">Voucher</td>
          </tr>

          <tr>
            <td colSpan="2" className="td-skip" />
          </tr>
        </tbody>
      </table>
      <MDBBtn
        type="submit"
        disabled={isEmpty(cart) || formSubmitted}
        onClick={handleSubmit}
        className="m-0 w-100 fw-bold mt-4"
        color="success"
      >
        Complete Transaction
        {formSubmitted && <MDBIcon icon="spinner" className="ml-2" pulse />}
      </MDBBtn>
    </MDBCol>
  );
};

export default Summary;
