import {
  MDBTable,
  MDBTableHead,
  MDBCollapse,
  MDBTableBody,
  MDBBadge,
} from "mdbreact";
import { currency, fullName } from "../../../../../services/utilities";
import { Services } from "../../../../../services/fakeDb";

const Deals = ({ deals, isOpen, _id }) => {
  return (
    <tr className="border-left border-right border-bottom border-black ">
      <td colSpan={6} className="m-0 p-0">
        <MDBCollapse id={`collapse-${_id}`} isOpen={isOpen} className="m-0 p-0">
          <MDBTable
            small
            className="m-0"
            style={{ marginBottom: "transparent" }}
          >
            <MDBTableHead>
              <tr>
                <td>
                  <span className="ml-5">Customer</span>
                </td>
                <td>Price</td>
                <td>Services</td>
              </tr>
            </MDBTableHead>
            <MDBTableBody>
              {deals.map((deal, index) => {
                const { pid: customerId, services, up } = deal;
                return (
                  <tr key={deal._id}>
                    <td>
                      <span className="ml-5">
                        {index + 1}.{" "}
                        <span style={{ fontWeight: "400" }}>
                          {fullName(customerId?.fullName)}
                        </span>
                      </span>
                    </td>
                    <td style={{ fontWeight: "400" }}>{currency.format(up)}</td>
                    <td>
                      {services?.map((id) => (
                        <MDBBadge key={id} className="ml-2">
                          {Services.getAbbr(id)}
                        </MDBBadge>
                      ))}
                    </td>
                  </tr>
                );
              })}
            </MDBTableBody>
          </MDBTable>
        </MDBCollapse>
      </td>
    </tr>
  );
};

export default Deals;
