import { MDBBtn, MDBCol, MDBIcon, MDBInputGroup } from "mdbreact";
import { SearchClinicMenus } from "../../../../../../components/searchables";
import { computeCP, currency } from "../../../../../../services/utilities";
import { useDispatch, useSelector } from "react-redux";
import {
  ChangeQty,
  SetCART,
} from "../../../../../../services/redux/slices/diagnostics/clinic/appointments";
import "./style.css";
const Menus = () => {
  const { cart = [] } = useSelector(({ appointments }) => appointments),
    dispatch = useDispatch();

  const handleAddToCart = (item) => {
    const _cart = [...cart];
    _cart.push({ ...item, qty: 1 });
    dispatch(SetCART(_cart));
  };

  const handleChangeQty = (index, value) => {
    dispatch(ChangeQty({ index, value }));
  };

  const handleRemove = (index) => {
    const _cart = [...cart];
    _cart.splice(index, 1);
    dispatch(SetCART(_cart));
  };

  return (
    <MDBCol md="7">
      <table className="menus-clinic-table">
        <thead>
          <tr>
            <th colSpan="4" className="bg-white">
              <div className="d-flex justify-content-center ">
                <SearchClinicMenus setMenu={handleAddToCart} />
              </div>
            </th>
          </tr>
          <tr>
            <th className="text-left">Menus</th>
            <th style={{ width: "75px" }}>UP</th>
            <th style={{ width: "75px" }}>Qty</th>
            <th style={{ width: "75px" }}>Total</th>
          </tr>
        </thead>
        <tbody>
          {!cart.length && (
            <tr>
              <td colSpan="4" className="menus-empty">
                <span>Start by searching your menus .</span>
              </td>
            </tr>
          )}
          {cart.map((item, index) => {
            const { _id, description, abbreviation, qty = 1 } = item;
            const { up, gross } = computeCP(item);

            return (
              <tr key={_id}>
                <td
                  className="text-left"
                  style={{ background: "white !important" }}
                >
                  <span>
                    {description ? `${description} - ` : ""}
                    {abbreviation}
                  </span>
                </td>
                <td title="Suggested Retail Price">{currency.format(up)}</td>
                <td
                  title="Suggested Retail Price "
                  className="menus-clinic-qty"
                >
                  <MDBInputGroup
                    type="number"
                    value={String(qty)}
                    className="text-center border border-light"
                    min="1"
                    onChange={({ target }) => {
                      let filteredQuantity = target.value.replace(
                        /[^0-9]/g,
                        ""
                      );
                      var quantity = Number(filteredQuantity);
                      if (quantity < 1) quantity = 1;
                      handleChangeQty(index, quantity);
                    }}
                    size="sm"
                    prepend={
                      <MDBBtn
                        className="m-0 px-2 py-0"
                        size="sm"
                        color="light"
                        onClick={() =>
                          handleChangeQty(index, qty === 1 ? 1 : qty - 1)
                        }
                        style={{ boxShadow: "0px 0px 0px 0px" }}
                        outline
                      >
                        <MDBIcon icon="minus" style={{ color: "black" }} />
                      </MDBBtn>
                    }
                    append={
                      <MDBBtn
                        className="m-0 px-2  py-0"
                        size="sm"
                        color="light"
                        onClick={() => handleChangeQty(index, qty + 1)}
                        style={{ boxShadow: "0px 0px 0px 0px" }}
                        outline
                      >
                        <MDBIcon icon="plus" style={{ color: "black" }} />
                      </MDBBtn>
                    }
                  />
                </td>

                <td title="Suggested Retail Price">
                  <span className={`text menus-up`}>
                    {currency.format(gross)}
                  </span>
                  <button
                    onClick={() => handleRemove(_id)}
                    className="menus-clinic-button-delete"
                  >
                    <MDBIcon icon="trash" />
                  </button>
                </td>
              </tr>
            );
          })}
        </tbody>
      </table>
    </MDBCol>
  );
};

export default Menus;
