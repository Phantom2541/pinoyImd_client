import { useState, useEffect } from "react";
import { useSelector } from "react-redux";
import { MDBBadge, MDBCol } from "mdbreact";
import { SecondaryFooter, PrimaryFooter } from "./footer";

import Tagging from "./body/tagging";
import Show from "./body/show";

export default function Card({ item, index }) {
  const { activePlatform } = useSelector(({ auth }) => auth),
    { collections: sources } = useSelector(({ providers }) => providers),
    [deal, setDeal] = useState({}),
    [edit, setEdit] = useState(false);
  const {
      customerId = {},
      createdAt,
      rendered = [],
      physicianId = {},
      source: forwardedBy = {},
      _id,
      cart = [],
    } = deal,
    { fullName: fullname = {} } = customerId,
    source = sources.find(({ vendors }) => vendors?._id === forwardedBy?._id),
    { at, dept } =
      rendered.find(
        ({ dept }) =>
          dept === (activePlatform.department === "Laboratory" ? "LAB" : "RAD")
      ) || {};

  useEffect(() => {
    setDeal(item);
  }, [item]);

  const handlePin = () => {
    return (
      <span className={`sales-card-num ${dept && "rendered"}`}>{deal?.pn}</span>
    );
  };

  return (
    <MDBCol className="p-2" md="4" key={index}>
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
            {cart?.map(({ abbreviation, referenceId }) => (
              <MDBBadge key={referenceId} className="mx-1">
                {abbreviation}
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
              <span>{at ? new Date(at).toLocaleTimeString() : "-"}</span>
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
    </MDBCol>
  );
}
