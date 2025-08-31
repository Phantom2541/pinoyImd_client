import { currency, fullName } from "../../../services/utilities";
import { Privileges } from "../../../services/fakeDb";
import "./index.css";
const Body = ({ isMembership, resecos = [] }) => {
  return (
    <table responsive bordered small className="reseco-table-printOut">
      <thead>
        <tr>
          <th>Customer</th>
          <th>Category</th>
          <th>Menus</th>
          <th>Amount</th>
          <th>Discount</th>
          <th>Privellege</th>
          <th>Rebate</th>
        </tr>
      </thead>
      <tbody>
        {resecos?.map((item, index) => {
          const { deals, date, time } = item;
          const totalAmount = deals.reduce((acc, item) => acc + item.amount, 0);
          const _deals = deals.map((deal, i) => {
            const { customerId, amount, cart, category, discount, privilege } =
              deal;

            const services = cart
              .map(({ abbreviation }) => abbreviation)
              .join(",    ");
            return (
              <tr key={index}>
                <td>
                  {i + 1}. {fullName(customerId?.fullName)}
                </td>
                <td>{category}</td>

                <td>
                  <span>{services}</span>
                </td>
                <td>{currency.format(amount)}</td>
                <td>{discount ? currency.format(discount) : ""}</td>
                <td>{Privileges[privilege]}</td>
                <td>₱{Number(!isMembership ? amount * 0.1 : 0).toFixed(2)}</td>
              </tr>
            );
          });
          return (
            <>
              <tr>
                <td colSpan={7} className="bg-light fw-bold">
                  {date} {time} | {currency.format(totalAmount)}
                </td>
              </tr>
              {_deals}
            </>
          );
        })}
      </tbody>
    </table>
  );
};

export default Body;
