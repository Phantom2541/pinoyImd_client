import { MDBCol, MDBBtn } from "mdbreact";
import { capitalize } from "lodash";
import { useState } from "react";
import { computeCP, currency } from "../../../../../../services/utilities";
import { useDispatch, useSelector } from "react-redux";
import {
  SAVE,
  SetCART,
} from "../../../../../../services/redux/slices/diagnostics/clinic/settlements";
import {
  SetSETTLED,
  TOGGLE_TRANSAC_MODAL,
} from "../../../../../../services/redux/slices/diagnostics/clinic/appointments";
import Spinner from "../../../../../../components/spinner";
const Summary = () => {
  const { auth, token } = useSelector(({ auth }) => auth),
    { selected } = useSelector(({ appointments }) => appointments),
    { cart, formSubmitted } = useSelector(({ settlements }) => settlements),
    [payment, setPayment] = useState("cash"),
    [cash, setCash] = useState(0),
    { gross, discount, net } = computeCP(cart),
    dispatch = useDispatch();

  const { patient } = selected;
  console.log("selected", selected);
  const handleSubmit = (e) => {
    e.preventDefault();
    const items = cart.map((item) => {
      const { discount, up, net } = computeCP(item);
      return {
        menu: item._id,
        srp: up,
        discount,
        amount: net,
        qty: item.qty,
      };
    });

    const settlement = {
      cart: items,
      userId: auth._id,
      patient: patient._id,
      appointment: selected._id,
      consultation: selected?.consultation?._id,
      payment,
      discount,
      cash,
      amount: net,
    };
    dispatch(SAVE({ data: settlement, token })).then((action) => {
      const { payload = {} } = action?.payload;
      const { appointment = {} } = payload;
      dispatch(SetSETTLED(appointment?._id));
      dispatch(TOGGLE_TRANSAC_MODAL());
      dispatch(SetCART([]));
      setPayment("cash");
      setCash(0);
    });
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
          disabled={cart.length === 0 || formSubmitted}
          color="success"
        >
          Complete Transaction <Spinner formSubmitted={formSubmitted} />
        </MDBBtn>
      </form>
    </MDBCol>
  );
};

export default Summary;
