import React, { useState, useEffect } from "react";
import { useSelector } from "react-redux";
import { MDBBadge } from "mdbreact";
import { SecondaryFooter, PrimaryFooter } from "./footer";

import Tagging from "./body/tagging";
import Show from "./body/show";

export default function Card({ item, index }) {
  const { collections: sources } = useSelector(({ providers }) => providers),
    [deal, setDeal] = useState({}),
    [edit, setEdit] = useState(false);
  const {
      customerId = {},
      createdAt,
      renderedAt,
      physicianId = {},
      source: forwardedBy = {},
      _id,
    } = deal,
    { fullName: fullname = {} } = customerId,
    source = sources.find(({ vendors }) => vendors?._id === forwardedBy?._id);

  useEffect(() => {
    setDeal(item);
  }, [item]);

  const handlePin = () => {
    return (
      <span
        className={`sales-card-num ${item.rendered?.length > 0 && "rendered"}`}
      >
        {deal.page} {index + 1}
      </span>
    );
  };

  return (
    <>
      <div className="sales-card" key={index}>
        {handlePin()}
        <p className="line-clamp">
          {fullname.lname},
          <br />
          <small>
            {fullname.fname} {fullname.mname}
          </small>
        </p>
        <div className="sales-card-body">
          <div className="d-flex">
            {item.cart?.map((menu) => {
              return (
                <MDBBadge key={menu.referenceId} className="mx-1">
                  {menu?.abbreviation}
                </MDBBadge>
              );
            })}
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
          <PrimaryFooter
            deal={{ ...deal, patientNo: index + 1 }}
            setEdit={setEdit}
          />
        )}
      </div>
    </>
  );
}
