import React, { useState, useEffect } from "react";
import { useSelector } from "react-redux";
import { MDBBadge } from "mdbreact";
import { SecondaryFooter, PrimaryFooter } from "./footer";
import { fullName } from "../../../../../../services/utilities";

import Tagging from "./body/tagging";
import Show from "./body/show";

export default function Card({ item, index }) {
  const { collections: sources } = useSelector(({ providers }) => providers),
    [sale, setSale] = useState({}),
    [edit, setEdit] = useState(false);
  const {
      customerId = {},
      createdAt,
      renderedAt,
      physicianId = {},
      source: forwardedBy = {},
      cart,
      _id,
    } = sale,
    { fullName: fullname = {} } = customerId,
    source = sources.find(({ vendors }) => vendors?._id === forwardedBy?._id);

  useEffect(() => {
    setSale(item);
  }, [item]);

  const handlePin = () => {
    return (
      <span className={`sales-card-num ${renderedAt && "rendered"}`}>
        {sale.page}
      </span>
    );
    // return (
    //   <span className={`sales-card-num ${true && "deleted"}`}>
    //     <MDBIcon icon="trash-alt" />
    //   </span>
    // );
  };

  return (
    <>
      <div className="sales-card" key={index}>
        {handlePin()}
        <p className="line-clamp">{fullName(fullname)}</p>
        <div className="sales-card-body">
          <div className="d-flex">
            {cart?.map((menu) => (
              <MDBBadge key={menu.referenceId} className="mx-1">
                {menu?.abbreviation}
              </MDBBadge>
            ))}
          </div>

          <div className="d-flex items-center">
            <div className="sales-card-info mr-4">
              <small>Time Charge</small>
              <span>{new Date(createdAt).toLocaleTimeString()}</span>
            </div>
            <div className="sales-card-info">
              <small>Time Rendered</small>
              <span>
                {renderedAt ? new Date(renderedAt).toLocaleTimeString() : "-"}
              </span>
            </div>
          </div>
          {edit ? (
            <Tagging
              forwardedBy={forwardedBy}
              physicianId={physicianId}
              _id={_id}
            />
          ) : (
            <Show source={source} physicianId={physicianId} />
          )}
        </div>
        {edit ? (
          <SecondaryFooter setEdit={setEdit} />
        ) : (
          <PrimaryFooter sale={sale} setEdit={setEdit} />
        )}
      </div>
    </>
  );
}
