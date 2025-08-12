import { MDBBtn, MDBIcon, MDBTable } from "mdbreact";
import {
  computeGD,
  currency,
} from "../../../../../../../../services/utilities";
import Swal from "sweetalert2";

const Computations = ({ gross, discount = 0, amountPaid }) => {
  return (
    <MDBTable className="text-center mt-2 border" responsive hover>
      <thead>
        <tr>
          <th colSpan={2} className="py-1">
            Summary
          </th>
        </tr>
      </thead>
      <tbody>
        <tr>
          <td className="fw-bold text-left py-1">Gross Amount</td>
          <td className="fw-bold text-right py-1">{currency.format(gross)}</td>
        </tr>
        {amountPaid > 0 && (
          <tr>
            <td className="fw-bold text-left py-1">
              Paid Amount (Already Charged)
            </td>
            <td className="fw-bold text-right py-1">
              {currency.format(amountPaid)}
            </td>
          </tr>
        )}
        <tr>
          <td className="fw-bold text-left py-1">Discount</td>
          <td className="fw-bold text-right py-1">
            {currency.format(discount)}
          </td>
        </tr>
        <tr>
          <td className="fw-bold text-left py-1">Net Amount</td>
          <td className="fw-bold text-right py-1">
            {currency.format(gross - (discount + amountPaid))}
          </td>
        </tr>
      </tbody>
    </MDBTable>
  );
};

export default function PatientCart({
  overrideDiscount,
  amountPaid,
  gross,
  discount,
  didCheckout,
  toggleCheckout,
  cart,
  setCart,
  categoryIndex,
  privilegeIndex,
  dealId = "",
}) {
  const handleRemove = (menu, index) => {
    const newCart = cart.map((item) =>
      item.overrideBy === menu._id
        ? (() => {
            const { overrideBy, ...rest } = item;
            return rest;
          })()
        : item
    );

    newCart.splice(index, 1);
    setCart(newCart);
  };

  return (
    <>
      <div style={{ height: "300px", overflow: "auto" }}>
        <MDBTable className="text-center border mb-0" responsive hover>
          <thead>
            <tr>
              <th className="text-left py-1">Services</th>
              <th className="py-1">SRP</th>
              <th className="py-1">UP</th>
              <th />
            </tr>
          </thead>
          <tbody>
            {cart?.map((menu, index) => {
              const {
                description,
                abbreviation,
                _id,
                isNew = true,
                overrideBy = "",
              } = menu;

              const {
                gross = 0,
                up = 0,
                title = "",
                color = "",
              } = computeGD(menu, categoryIndex, privilegeIndex);
              const override =
                overrideBy &&
                cart.find(({ referenceId }) => referenceId === overrideBy);
              return (
                <tr
                  key={`cart-${index}-${_id}`}
                  style={{
                    cursor: "default",
                    ...(overrideBy && {
                      textDecoration: "line-through",
                      textDecorationThickness: "2px",
                      textDecorationColor: "red",
                    }),
                  }}
                  title={
                    overrideBy
                      ? `Override by ${
                          override?.description || override?.abbreviation
                        }`
                      : ""
                  }
                >
                  <td className="fw-bold text-left py-1">
                    {String(description || abbreviation).toUpperCase()}
                  </td>
                  <td className="py-1" title="Suggested Retail Price">
                    {currency.format(
                      isNew ? gross : menu.up + menu?.discount || 0
                    )}
                  </td>
                  <td className="py-1">
                    <span title={title} className={`text-${color}`}>
                      {currency.format(isNew ? up : menu.up)}
                    </span>
                  </td>
                  <td className="py-1">
                    {!isNew && (
                      <MDBIcon icon="check-double" className="text-success" />
                    )}
                    {!didCheckout && isNew && (
                      <MDBBtn
                        onClick={() => handleRemove(menu, index)}
                        color="danger"
                        size="sm"
                        className="py-1 px-2 m-0"
                      >
                        <MDBIcon icon="trash" />
                      </MDBBtn>
                    )}
                  </td>
                </tr>
              );
            })}
          </tbody>
        </MDBTable>
      </div>

      <Computations
        gross={gross}
        discount={discount}
        amountPaid={amountPaid}
        overrideDiscount={overrideDiscount}
      />

      <MDBBtn
        onClick={() => {
          const _cart = dealId ? cart.filter(({ up }) => !up) : cart;
          if (_cart.length === 0)
            return Swal.fire({
              icon: "error",
              title: "Invalid Transaction!",
              text: "Please select a service to continue.",
            });

          toggleCheckout();
        }}
        color={didCheckout ? "primary" : "success"}
        className="w-100 mx-auto"
      >
        {didCheckout ? "go back" : "checkout"}
      </MDBBtn>
    </>
  );
}
