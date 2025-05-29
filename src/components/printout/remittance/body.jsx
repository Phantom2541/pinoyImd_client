import { useSelector } from "react-redux";
import { MDBTable } from "mdbreact";
import { currency } from "../../../services/utilities";

const Body = () => {
  const { closing, sales } = useSelector(
    ({ remittances }) => remittances.selected
  );

  return (
    <MDBTable responsive hover bordered>
      {/* <thead>
        <tr>
          <th>#</th>
          <th>Services</th>
          <th>Qnty</th>
        </tr>
      </thead>
      <tbody>
        {Object.entries(census?.menus)?.map(([id, qnty], index) => {
          return (
            <tr key={index}>
              <td>{index + 1}</td>
              <td>{id}</td>
              <td>{qnty}</td>
            </tr>
          );
        })}
        <tr>
          <td colSpan={3}>Total</td>
          <td colSpan={2}>
            <h4>{currency(sales)}</h4>
          </td>
        </tr>
      </tbody> */}
      <thead>
        <tr>
          <th>#</th>
          <th>Denomination</th>
          <th>Qnty</th>
          <th>Amount</th>
        </tr>
      </thead>
      <tbody>
        {Object.entries(closing?.bills)?.map(
          ([denomination, quantity], index) => {
            const amount = denomination * quantity;
            return (
              <tr key={index}>
                <td>{index + 1}</td>
                <td>{currency(denomination)}</td>
                <td>{quantity}</td>
                <td>{currency(amount)}</td>
              </tr>
            );
          }
        )}
        <tr>
          <td colSpan={3}>Total Remit</td>
          <td colSpan={2}>
            <h4>{currency(sales)}</h4>
          </td>
        </tr>
      </tbody>
    </MDBTable>
  );
};

export default Body;
