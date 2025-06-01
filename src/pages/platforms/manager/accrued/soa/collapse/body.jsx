import { MDBTable, MDBTableHead, MDBTableBody } from "mdbreact";
import { currency, fullName } from "../../../../../../services/utilities";
import { Services } from "../../../../../../services/fakeDb";
import { useDispatch, useSelector } from "react-redux";
import {
  CHECK_SOA,
  UPDATE,
} from "../../../../../../services/redux/slices/commerce/pos/services/billing";
import { Input } from "../../../../../../components/customizable";
export default function Collapsable({
  deals,
  date,
  selected,
  setSelected,
  isChecked,
}) {
  const { token } = useSelector(({ auth }) => auth),
    { vendor, isSuccess, formSubmitted } = useSelector(
      ({ billings }) => billings
    ),
    dispatch = useDispatch();

  const handleCheck = () => {
    dispatch(UPDATE({ data: selected, token }));
  };
  return (
    <MDBTable bordered>
      <MDBTableHead>
        <tr>
          {!vendor._id && <th>Outsource</th>}
          <th>Customer</th>
          <th>Source</th>
          <th>Price</th>
          <th>Services</th>
        </tr>
      </MDBTableHead>
      <MDBTableBody>
        {deals?.map((deal, index) => {
          const { customerId, outsource, sendouts, source } = deal;
          const isToUpdate = deal._id === selected.dealId && vendor.soa?._id;
          return (
            <tr key={index}>
              {!vendor._id && (
                <td>
                  <span className="fw-bold mr-1"> {++index}.</span>
                  {outsource?.displayname}
                </td>
              )}
              <td>
                {vendor._id && vendor.soa ? (
                  <>
                    <input
                      className="form-check-input m-0 p-0"
                      type="checkbox"
                      id={deal._id}
                      checked={isChecked(date, deal)}
                      onChange={() =>
                        dispatch(
                          CHECK_SOA({
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
                ) : (
                  fullName(customerId?.fullName)
                )}
              </td>
              <td>{source?.displayname}</td>
              <td className=" cursor-pointer" style={{ width: "10rem" }}>
                {!isToUpdate ? (
                  <div
                    onClick={() =>
                      setSelected({ ...deal.sendouts, dealId: deal._id })
                    }
                    className="w-100"
                  >
                    {currency(sendouts?.up)}
                  </div>
                ) : (
                  <Input
                    handleClose={() => setSelected({})}
                    isSuccess={isSuccess}
                    formSubmitted={formSubmitted}
                    selected={selected}
                    onChange={(key, value) =>
                      setSelected({ ...selected, [key]: Number(value) })
                    }
                    handleCheck={() => handleCheck()}
                    className="form-control form-control-sm"
                    _key={"up"}
                    type="number"
                  />
                )}
              </td>
              <td className="mb-1">
                {sendouts?.servicesId
                  ?.map((id) => Services.getAbbr(id))
                  ?.join(", ")}
              </td>
            </tr>
          );
        })}
      </MDBTableBody>
    </MDBTable>
  );
}
