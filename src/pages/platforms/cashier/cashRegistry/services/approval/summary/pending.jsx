import { MDBCol, MDBBtn, MDBIcon, MDBBtnGroup } from "mdbreact";
import { currency } from "../../../../../../../services/utilities";
import { capitalize, isEmpty } from "lodash";
import { useDispatch, useSelector } from "react-redux";
import { HMO } from "../../../../../../../services/fakeDb";
import Credit from "./credit";
import utils from "../utils";
import {
  ResetREFNO,
  SetPAYMENT,
  SetREFNO,
} from "../../../../../../../services/redux/slices/commerce/pos/services/kiosk";

const ApprovalSummary = ({ handleSubmit, formSubmitted = false }) => {
  const { selected, cart, payment, refNo, isAuthorization } = useSelector(
    ({ kiosk }) => kiosk
  );
  const { requirements, pid: customer } = selected || {};
  const { hmo } = requirements || {};
  const { healthCard = {} } = customer || {};
  const { gross, amount } = utils.computeCharges(cart, selected);
  const dispatch = useDispatch();
  const setPayment = (value) => dispatch(SetPAYMENT(value));
  const setRefNo = (value) => dispatch(SetREFNO(value));

  const isMixed = payment === "mixed";

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
              <td>Company</td>
              <td className="table-price">{HMO.getName(hmo)}</td>
            </tr>
            <tr>
              <td>ID No.</td>
              <td className="table-price">{healthCard?.id}</td>
            </tr>
            <tr>
              <td>Approval No.</td>
              <td className="p-0">
                <input required />
              </td>
            </tr>
            <tr>
              <td>Expiration</td>
              <td className="p-0">
                <input type="date" name="expiration" required />
              </td>
            </tr>
            <tr>
              <td>Payment</td>
              <td className="p-0">
                <select
                  value={payment}
                  onChange={({ target }) => {
                    setPayment(target.value);
                    dispatch(ResetREFNO());
                  }}
                >
                  {["voucher", "mixed"]?.map((payment, index) => (
                    <option key={`${payment}-${index}`} value={payment}>
                      {capitalize(payment === "mixed" ? "Split Bill" : payment)}
                    </option>
                  ))}
                </select>
              </td>
            </tr>

            {isMixed ? (
              <tr>
                <td>Patient Payable</td>
                <td className="p-0">
                  <select
                    value={refNo.pp}
                    onChange={({ target }) =>
                      setRefNo({ ...refNo, pp: target.value })
                    }
                  >
                    <option value="cash">Cash</option>
                    <option value="co">Care Of</option>
                  </select>
                </td>
              </tr>
            ) : (
              ""
            )}

            {isMixed && isAuthorization && refNo.pp === "cash" && (
              <tr>
                <td>Cash Out</td>
                <td className="p-0">
                  {currency.format(utils.compute.cashOut(cart, selected))}
                </td>
              </tr>
            )}

            <Credit amount={amount} refNo={refNo} setRefNo={setRefNo} />
          </tbody>
        </table>
        <MDBBtnGroup className="w-100">
          <MDBBtn className="m-0  mt-3" block color="danger">
            Deny
          </MDBBtn>
          <MDBBtn
            type="submit"
            block
            disabled={isEmpty(cart) || formSubmitted}
            className="m-0  mt-3"
            color="success"
          >
            Approved
            {formSubmitted && <MDBIcon icon="spinner" className="ml-2" pulse />}
          </MDBBtn>
        </MDBBtnGroup>
      </form>
    </MDBCol>
  );
};

export default ApprovalSummary;
