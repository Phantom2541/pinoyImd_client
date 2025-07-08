import { MDBTable, MDBTableHead, MDBTableBody, MDBBadge } from "mdbreact";
import { currency, fullName } from "../../../../../../services/utilities";
import { Privileges } from "../../../../../../services/fakeDb";
import { useDispatch, useSelector } from "react-redux";
import { CHECK_DEAL } from "../../../../../../services/redux/slices/commerce/pos/services/deals";
export default function Collapsable({ deals, date, isChecked }) {
  const { vendor } = useSelector(({ deals }) => deals);
  const isNoVendor = vendor?._id === "noSource" || !vendor?._id,
    dispatch = useDispatch();
  return (
    <MDBTable bordered className="m-0 p-0">
      <MDBTableHead>
        <tr>
          {isNoVendor && <th>Source</th>}
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
          } = deal;
          return (
            <tr key={index}>
              {isNoVendor && (
                <td>
                  <span className="fw-bold mr-1"> {++index}.</span>
                  {source?.displayname}
                </td>
              )}
              <td>
                {isNoVendor ? (
                  fullName(customerId?.fullName)
                ) : (
                  <>
                    <input
                      className="form-check-input m-0 p-0"
                      type="checkbox"
                      id={deal._id}
                      checked={isChecked(date, deal)}
                      onChange={() =>
                        dispatch(
                          // CHECK_DEAL({
                          //   id: deal._id,
                          //   hasSelected: !hasSelected,
                          //   date,
                          // })
                          CHECK_DEAL({
                            deal,
                            totalDeals: deals.length,
                            date,
                          })
                        )
                      }
                    />
                    <label
                      htmlFor={deal._id}
                      style={{ marginRight: "-0.5rem" }}
                      className="form-check-label label-table"
                    >
                      <span className="fw-bold mr-1"> {++index}.</span>
                      {fullName(customerId?.fullName)}
                    </label>
                  </>
                )}
              </td>
              <td>{category}</td>
              <td>
                {cart.map(({ menuId }, index) => (
                  <MDBBadge key={index} className="mr-1">
                    {menuId.abbreviation}
                  </MDBBadge>
                ))}
              </td>
              <td>{currency(amount)}</td>
              <td>{currency(discount)}</td>
              <td>{Privileges[privilege]}</td>
            </tr>
          );
        })}
      </MDBTableBody>
    </MDBTable>
  );
}
