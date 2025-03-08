import React from "react";
import { MDBBtn, MDBIcon, MDBTable } from "mdbreact";
import {
  computeGD,
  currency,
} from "../../../../../../../../services/utilities";
import Swal from "sweetalert2";

const Computations = ({ gross, discount }) => {
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
          <td className="fw-bold text-right py-1">{currency(gross)}</td>
        </tr>
        <tr>
          <td className="fw-bold text-left py-1">Discount</td>
          <td className="fw-bold text-right py-1">{currency(discount)}</td>
        </tr>
        <tr>
          <td className="fw-bold text-left py-1">Net Amount</td>
          <td className="fw-bold text-right py-1">
            {currency(gross - discount)}
          </td>
        </tr>
      </tbody>
    </MDBTable>
  );
};

export default function PatientCart({
  gross,
  discount,
  didCheckout,
  toggleCheckout,
  cart,
  setCart,
  categoryIndex,
  privilegeIndex,
  saleId = "",
}) {
  return (
    <>
      <div style={{ height: "300px", overflow: "auto" }}>
        <MDBTable className="text-center border mb-0" responsive hover>
          <thead>
            <tr>
              <th className="text-left py-1">Service</th>
              <th className="py-1">SRP</th>
              <th className="py-1">UP</th>
              <th />
            </tr>
          </thead>
          <tbody>
            {cart?.map((menu, index) => {
              const { description, abbreviation, _id, isNew = true } = menu;

              const {
                gross = 0,
                up = 0,
                title = "",
                color = "",
              } = computeGD(menu, categoryIndex, privilegeIndex);

              return (
                <tr key={`cart-${index}`} style={{ cursor: "default" }}>
                  <td className="fw-bold text-left py-1">
                    {String(description || abbreviation).toUpperCase()}
                  </td>
                  <td className="py-1" title="Suggested Retail Price">
                    {currency(gross)}
                  </td>
                  <td className="py-1">
                    <span title={title} className={`text-${color}`}>
                      {currency(up)}
                    </span>
                  </td>
                  <td className="py-1">
                    {!isNew && (
                      <MDBIcon icon="check-double" className="text-success" />
                    )}
                    {!didCheckout && isNew && (
                      <MDBBtn
                        onClick={() =>
                          setCart((prev) => prev.filter((p) => p._id !== _id))
                        }
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

      <Computations gross={gross} discount={discount} />

      <MDBBtn
        onClick={() => {
          const _cart = saleId ? cart.filter(({ up }) => !up) : cart;
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
