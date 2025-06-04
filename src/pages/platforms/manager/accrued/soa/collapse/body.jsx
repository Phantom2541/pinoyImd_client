import { MDBTable, MDBTableHead, MDBTableBody, MDBBadge } from "mdbreact";
import { currency, fullName } from "../../../../../../services/utilities";
import { Services } from "../../../../../../services/fakeDb";
import { useDispatch, useSelector } from "react-redux";
import {
  CHECK_SOA,
  UPDATE,
} from "../../../../../../services/redux/slices/commerce/pos/services/billing";
import { Input } from "../../../../../../components/customizable";
import Swal from "sweetalert2";
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

  const handleUpdatePrice = () => {
    if (!selected.up) return setSelected({});
    dispatch(UPDATE({ data: selected, token }));
  };

  const handleCheck = (deal) => {
    const { sendouts } = deal;
    if (!sendouts?.up) {
      Swal.fire({
        icon: "warning",
        title: "Enter Deal Price",
        text: "This deal has no price. Please enter a valid amount to continue.",
        input: "number",

        inputAttributes: {
          min: 0,
          step: "0.01",
        },
        inputPlaceholder: "Enter price",
        confirmButtonColor: "#3085d6",
        confirmButtonText: "Submit",
        showCancelButton: true,
        reverseButtons: true,
        cancelButtonText: "Cancel",
        preConfirm: (value) => {
          if (!value || isNaN(value) || Number(value) <= 0) {
            Swal.showValidationMessage(
              "Please enter a valid price greater than 0"
            );
          }
          return Number(value); // Return numeric value
        },
      }).then((result) => {
        const _sendouts = { ...sendouts, up: result.value };
        if (result.isConfirmed) {
          dispatch(
            UPDATE({
              data: { ..._sendouts, up: result.value, dealId: deal?._id },
              token,
            })
          ).then(() => {
            dispatch(
              CHECK_SOA({
                deal: { ...deal, sendouts: _sendouts },
                totalDeals: deals.length,
                date,
              })
            );
          });
        } else {
          console.log("User cancelled the input.");
        }
      });
    } else {
      dispatch(
        CHECK_SOA({
          deal,
          totalDeals: deals.length,
          date,
        })
      );
    }
  };
  return (
    <MDBTable bordered className="m-0">
      <MDBTableHead>
        <tr>
          {!vendor?._id && <th>Outsource</th>}
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
                      onChange={() => handleCheck(deal)}
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
                    handleCheck={() => handleUpdatePrice()}
                    className="form-control form-control-sm"
                    _key={"up"}
                    type="number"
                  />
                )}
              </td>
              <td className="mb-1">
                {sendouts?.servicesId?.map((id) => (
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
  );
}
