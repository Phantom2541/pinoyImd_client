import { MDBTable, MDBTableHead, MDBTableBody, MDBBadge } from "mdbreact";
import { currency, fullName } from "../../../../../../services/utilities";
import { Privileges } from "../../../../../../services/fakeDb";
import { useSelector } from "react-redux";
export default function Collapsable({ deals }) {
  const { source, physician } = useSelector(({ deals }) => deals);
  const haveSource = source !== "All" && source !== "No Source";
  const showPhysician = haveSource && physician === "All";

  return (
    <MDBTable bordered className="m-0 p-0">
      <MDBTableHead>
        <tr>
          {!haveSource && <th>Source</th>}
          {showPhysician && <th>Physician</th>}
          <th>Customer</th>
          <th>Category</th>
          <th>Services</th>
          <th>Amount</th>
          <th>Discount</th>
          <th>Privilege</th>
        </tr>
      </MDBTableHead>
      <MDBTableBody>
        {deals?.map((deal, index) => {
          const {
            customerId,
            category,
            amount,
            discount,
            privilege,
            source,
            cart = [],
            _id,
            physicianId = {},
          } = deal;
          return (
            <tr key={_id}>
              {!haveSource && (
                <td>
                  <span className="fw-bold mr-1"> {++index}.</span>
                  {source?.displayname}
                </td>
              )}
              {showPhysician && (
                <td>
                  <span className="fw-bold mr-1"> {++index}.</span>
                  {fullName(physicianId?.fullName)}
                </td>
              )}
              <td>
                {haveSource && !showPhysician && (
                  <span className="fw-bold mr-1"> {++index}.</span>
                )}
                {fullName(customerId?.fullName)}
              </td>
              <td>{category}</td>
              <td>
                {cart.map(({ menuId }, index) => (
                  <MDBBadge key={index} className="mr-1">
                    {menuId.abbreviation}
                  </MDBBadge>
                ))}
              </td>
              <td>{currency.format(amount)}</td>
              <td>{currency.format(discount)}</td>
              <td>{Privileges[privilege]}</td>
            </tr>
          );
        })}
      </MDBTableBody>
    </MDBTable>
  );
}
