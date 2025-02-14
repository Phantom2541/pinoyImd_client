import {
  MDBBadge,
  MDBBtn,
  MDBBtnGroup,
  MDBIcon,
  MDBTypography,
} from "mdbreact";
import React, { useState } from "react";
import { fullName, generateClaimStub } from "../../../../../services/utilities";
import { useDispatch, useSelector } from "react-redux";
import { TAGGING } from "../../../../../services/redux/slices/commerce/sales";

export default function Card({
  sale,
  number,
  generateTask,

  // this is used by DailySaleModal
  ledgerView = false, // toggle for showing/hiding items depending on view
  isDeleted = false,
  remarks = "",
}) {
  const [edit, setEdit] = useState(false),
    { collections: physicians } = useSelector(({ physicians }) => physicians),
    { collections: sources } = useSelector(({ providers }) => providers),
    [data, setData] = useState({}),
    { token } = useSelector(({ auth }) => auth),
    dispatch = useDispatch();

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

  const handleChange = (e) => {
    const { name, value } = e.target;
    console.log(name, value);
    setData({ ...data, _id, [name]: value });
  };

  const handleUpdate = () => {
    dispatch(
      TAGGING({
        token,
        key: data,
      })
    );
    setEdit(false);
  };

  const handlePin = () => {
    if (!ledgerView)
      return (
        <span className={`sales-card-num ${renderedAt && "rendered"}`}>
          {number}
        </span>
      );

    // do not return anything if in ledgerView but not deleted
    if (!isDeleted) return;

    return (
      <span className={`sales-card-num ${isDeleted && "deleted"}`}>
        <MDBIcon icon="trash-alt" />
      </span>
    );
  };

  return (
    <>
      <div className="sales-card">
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
          <div className="sales-card-info">
            <small>Source</small>
            {edit ? (
              <select
                name="source"
                onChange={(e) => {
                  handleChange(e);
                }}
                defaultValue={forwardedBy?._id}
                className="w-100"
              >
                <option value="-">-</option>
                {sources?.map(({ _id, name, vendors }) => (
                  <option key={_id} value={vendors?._id}>
                    {name}
                  </option>
                ))}
              </select>
            ) : (
              <span className="ellipse">{source?.name || "walk in"}</span>
            )}
          </div>
          <div className="sales-card-info">
            <small>Referral</small>
            {edit ? (
              <select
                name="physician"
                defaultValue={physicianId?._id}
                onChange={(e) => {
                  handleChange(e);
                }}
                className="w-100"
              >
                <option value="-">-</option>
                {physicians?.map(({ user }) => (
                  <option key={user?._id} value={user?._id}>
                    {fullName(user?.fullName)}
                  </option>
                ))}
              </select>
            ) : (
              <span className="ellipse">{fullName(physicianId?.fullName)}</span>
            )}
          </div>
        </div>
        {ledgerView && remarks && (
          <div>
            <MDBTypography noteColor="warning" note>
              {remarks}
            </MDBTypography>
          </div>
        )}
        {edit ? (
          <MDBBtnGroup className="w-100">
            <MDBBtn
              type="button"
              className="m-0"
              size="sm"
              color="danger"
              onClick={() => setEdit(false)}
            >
              Cancel
            </MDBBtn>
            <MDBBtn
              onClick={handleUpdate}
              type="button"
              className="m-0 "
              size="sm"
              color="primary"
            >
              Submit
            </MDBBtn>
          </MDBBtnGroup>
        ) : (
          <MDBBtnGroup className="sales-card-footer w-100">
            <MDBBtn
              type="button"
              className="m-0"
              size="sm"
              color="primary"
              title="Edit"
              onClick={() => setEdit(true)}
            >
              <MDBIcon icon="pencil-alt" />
            </MDBBtn>
            <MDBBtn
              type="button"
              onClick={() => generateClaimStub(sale)}
              title="View Claim Stub"
              className="m-0 "
              size="sm"
              color="primary"
            >
              <MDBIcon icon="eye" />
            </MDBBtn>
            {!ledgerView && (
              <MDBBtn
                type="button"
                onClick={() => generateTask(sale)}
                className="m-0 "
                title="Generate Task"
                size="sm"
                color="primary"
              >
                <MDBIcon icon="user-injured" />
              </MDBBtn>
            )}
          </MDBBtnGroup>
        )}
      </div>
    </>
  );
}
