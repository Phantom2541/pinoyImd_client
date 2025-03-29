import React from "react";
import { useDispatch } from "react-redux";
import Indicator from "./indicator";
import { currency } from "../../../../../../../services/utilities";
import {
  SetActiveDATE,
  SetSELECTED,
} from "../../../../../../../services/redux/slices/finance/bookkeeping/remittances";
import { capitalize } from "lodash";

const Card = ({ txt, num, index, items = [] }) => {
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

  return (
    <div
      className={`calendar-card  ${
        num ? "cursor-pointer" : "opacity-0 pointer-events-none"
      }`}
      key={`pos-calendar-${index}`}
      onClick={handleDate}
    >
      <Indicator num={num} week={week} isFuture={isFuture} />
      <div className="sales-card-body">
        <div className="d-flex flex-column">
          {/* wag icocomment itong h6 tag na ito para mamaintain yung 100% width  */}
          <h6 style={{ width: "10rem", opacity: 0, marginBottom: "-1.3rem" }}>
            .
          </h6>
          {items.map(
            ({ cashier, gross, collector, _id, breakdown }, i) =>
              gross > 0 && (
                <div
                  key={i}
                  className="manager-remmitance-info mb-1 d-flex justify-content-between"
                  onClick={() => collector || handleRemittance(_id)}
                  title={handleTitle(breakdown)}
                >
                  {cashier?.fullName?.fname}
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
    </div>
  );
};

export default Card;
