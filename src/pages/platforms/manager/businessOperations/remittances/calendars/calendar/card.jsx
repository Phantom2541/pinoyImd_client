import React from "react";
import { useDispatch, useSelector } from "react-redux";
import Indicator from "./indicator";
import { currency } from "../../../../../../../services/utilities";
import {
  SetActiveDATE,
  SetSELECTED,
} from "../../../../../../../services/redux/slices/finance/bookkeeping/remittances";
import { capitalize } from "lodash";
import { MDBAnimation, MDBProgress } from "mdbreact";
const Card = ({ txt, num, index, items = [] }) => {
  const { isLoading } = useSelector(({ remittances }) => remittances);
  const dispatch = useDispatch();
  const today = new Date();
  const dateCell = new Date(txt);
  const isFuture = dateCell > today;
  const week = txt?.slice(0, 3);

  // Compute total gross
  const totalGross = items.reduce((sum, { gross }) => sum + (gross || 0), 0);
  const handleRemittance = (_id) => {
    const selected = items.find(({ _id: id }) => id === _id);
    if (selected) dispatch(SetSELECTED({ key: "remit", value: selected }));
  };

  const handleDate = () => dispatch(SetActiveDATE(num));

  const handleTitle = (breakdown) => {
    if (!breakdown) return "";

    return Object.entries(breakdown)
      .map(([key, value]) => `${capitalize(key)}: ${currency(value)}`)
      .join(", ");
  };

  console.log("items", items);

  return (
    <div
      className={`calendar-card  ${
        num ? "cursor-pointer" : "opacity-0 pointer-events-none"
      }`}
      style={!num ? { opacity: 0, pointerEvents: "none" } : {}}
      key={`pos-calendar-${index}`}
      onClick={handleDate}
    >
      <Indicator num={num} week={week} isFuture={isFuture} />
      {/* wag icocomment itong h6 tag na ito para mamaintain yung 100% width  */}
      <h6 style={{ width: "10rem", opacity: 0, marginBottom: "-1.3rem" }}>.</h6>
      {!isLoading ? (
        <div className="sales-card-body">
          <div className="d-flex flex-column">
            {items.map(
              ({ cashier, gross, collector, _id, breakdown }, i) =>
                gross > 0 && (
                  <div
                    key={i}
                    className="manager-remmitance-info mb-1 d-flex justify-content-between"
                    onClick={() => collector || handleRemittance(_id)}
                    title={handleTitle(breakdown)}
                    style={{ position: "relative", zIndex: 999 }}
                  >
                    {cashier?.alias}
                    <span style={{ color: collector ? "" : "green" }}>
                      {currency(gross)}
                    </span>
                  </div>
                )
            )}
          </div>
          <hr />

          {totalGross > 0 && (
            <div className="manager-remmitance-total d-flex align-items-center text-end mt-2">
              <h6 className="title"> Gross:</h6>
              <strong> {currency(totalGross)}</strong>
            </div>
          )}
        </div>
      ) : (
        <div>
          <MDBAnimation
            type="fadeIn"
            infinite
            delay={`100ms`}
            duration="3000ms"
            className="mt-3"
          >
            <MDBProgress animated color="light" value={3000}></MDBProgress>
          </MDBAnimation>
        </div>
      )}
    </div>
  );
};

export default Card;
