import { MDBTable } from "mdbreact";
import { currency } from "../../../services/utilities";

const Body = ({ remittance = {} }) => {
  const { closing } = remittance; // sales
  const { coins = {}, bills = {}, sum = 0 } = closing || {};
  var tableRaw = 1;
  return (
    <MDBTable small responsive hover bordered>
      <thead>
        <tr>
          <th>#</th>
          <th style={{ textAlign: "center" }}>Denomination</th>
          <th style={{ textAlign: "center" }}>Qty</th>
          <th style={{ textAlign: "center" }}>Amount</th>
        </tr>
      </thead>
      <tbody>
        {Object.entries(coins).map(([denomination, quantity], index) => {
          tableRaw = index++;
          const amount = denomination * quantity;
          return (
            <tr key={`coin-${denomination}`}>
              <td>{tableRaw + 1}</td>
              <td className="text-center">{currency(denomination)}</td>
              <td className="text-center">{quantity}</td>
              <td className="text-center">{currency(amount)}</td>
            </tr>
          );
        })}
        {Object.entries(bills).map(([denomination, quantity], index) => {
          const amount = denomination * quantity;
          return (
            <tr key={`bill-${denomination}`}>
              <td>{index + 2 + tableRaw}.</td>
              <td className="text-center">{currency(denomination)}</td>
              <td className="text-center">{quantity}</td>
              <td className="text-center">{currency(amount)}</td>
            </tr>
          );
        })}
        <tr>
          <td
            style={{ textAlign: "right", verticalAlign: "middle" }}
            colSpan={3}
          >
            Total Remit :
          </td>
          <td
            className="text-center"
            style={{ verticalAlign: "middle", fontWeight: 700 }}
          >
            <h4>{currency(sum)}</h4>
          </td>
        </tr>
      </tbody>
    </MDBTable>
  );
};

export default Body;
