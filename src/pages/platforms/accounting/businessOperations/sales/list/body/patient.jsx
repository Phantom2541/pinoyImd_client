import { MDBBtn, MDBBadge, MDBIcon, MDBBtnGroup } from "mdbreact";
import {
  currency,
  fullName,
  getGenderIcon,
  paymentMethod,
} from "../../../../../../../services/utilities";
import React from "react";
import EditableSelect from "../../../../../../../components/customizable/editableSelect";
import EditableField from "../../../../../../../components/customizable/editableField";
import tendered from "../../../../../../../assets/tendered.png";
import discount from "../../../../../../../assets/discount.png";
import { Categories, HMO } from "../../../../../../../services/fakeDb";
import { useSelector } from "react-redux";
import PickPhysician from "../../../../../../../components/searchables/physicians/pickPhysician";
const Patient = ({
  index = -1,
  deal = {},
  isDiscounted = false,
  isDeleted = false,
  isPhysicianEdit = false,
  isHover = false,
  sourceName = "",
  selected = {},
  setSelected = () => {},
  getPhysicians = () => {},
  getSourceForPhysician = () => {},
  handleDelete = () => {},
  handleRevert = () => {},
  handleUpdatePrice = () => {},
  handleUpdate = () => {},
  onSave = () => {},
  showingPhysician = () => {},
  setDidHoverID = () => {},
}) => {
  const { activePlatform } = useSelector(({ auth }) => auth),
    { formSubmitted, isSuccess } = useSelector(({ deals }) => deals),
    { collections: sources } = useSelector(({ providers }) => providers);

  const {
    img = "",
    style = {},
    text = "",
  } = paymentMethod.getImage(deal?.payment);
  return (
    <React.Fragment key={`sales-${index + 1}`}>
      <tr
        onMouseEnter={() => setDidHoverID(index)}
        onMouseLeave={() => setDidHoverID(-1)}
        style={{
          backgroundColor: isDeleted
            ? "#ffcccc"
            : isDiscounted
            ? "#ccffcc"
            : "",
        }}
      >
        <td className="position-relative">
          <div className="d-flex align-items-center">
            <h6>{getGenderIcon(deal?.customerId?.isMale)} </h6>
            <h6>{fullName(deal?.customerId?.fullName)}</h6>
          </div>
          <div className="d-flex align-items-center">
            <EditableSelect
              isEditable={true}
              collections={Categories.map(({ name, abbr }) => ({
                category: abbr,
                name,
              }))}
              preValue={deal.category}
              displayTag="span"
              classNameTxt="badge bg-info"
              className="m-0 mb-n2 p-0"
              keyForValue="category"
              keyForText="name"
              fieldData={{
                _id: deal?._id,
                category: deal?.category,
                name: deal?.category,
              }}
              onSave={(data) => {
                const { name, ...rest } = data;
                onSave(rest);
              }}
              animationStyle={{ width: "17rem" }}
              formSubmitted={formSubmitted}
              isSuccess={isSuccess}
              animation
            />
            <span className="ml-2">
              @ {new Date(deal.createdAt).toLocaleTimeString()}
            </span>
          </div>
        </td>
        <td className="position-relative">
          <div style={{ minWidth: "8rem" }}>
            <EditableField
              fieldData={{ _id: deal?._id, ssx: deal?.ssx }}
              keyForValue="ssx"
              placeholder="SSX"
              displayTag="h6"
              onSave={(data) => onSave(data)}
              animationStyle={{ width: "17rem" }}
              displayStyle={{ fontSize: "14px" }}
              animation
              formSubmitted={formSubmitted}
              isSuccess={isSuccess}
            />
          </div>
        </td>
        <td className="position-relative">
          <small className="mr-1 grey-text">Source:</small>
          <div style={{ minHeight: "27px" }}>
            <EditableSelect
              isEditable={true}
              collections={sources.map(({ clients }) => ({
                source: clients._id,
                text: `${clients?.displayname?.toUpperCase()}`,
              }))}
              preValue={deal.source._id}
              displayTag="h6"
              className="m-0 mb-n2 p-0"
              keyForValue="source"
              keyForText="text"
              fieldData={{
                _id: deal?._id,
                source: deal?.source?._id,
                text: sourceName,
              }}
              onSave={(data) => {
                const { text, ...rest } = data;
                onSave(rest);
              }}
              formSubmitted={formSubmitted}
              animationStyle={{ width: "17rem" }}
              animation
              isSuccess={isSuccess}
              selectStyle={{ width: "17rem" }}
            />
          </div>
          <div
            style={{
              width: "19rem",
              opacity: isPhysicianEdit ? 1 : 0,
              zIndex: isPhysicianEdit ? 2 : -1,
            }}
            className={`position-absolute mt-3 py-1 ${
              isPhysicianEdit && "deals-zoom-in"
            }`}
          >
            {isPhysicianEdit && (
              <PickPhysician
                defaultValue={
                  !deal?.physicianId?._id
                    ? deal?.physicianSTR
                    : fullName(deal?.physicianId?.fullName)
                }
                classNameInput="deals-zoom-in-input-physician "
                formSubmitted={formSubmitted}
                isEditable
                suggested={getPhysicians(deal.source._id)}
                source={getSourceForPhysician(deal?.source?._id)}
                onChange={(value) =>
                  setSelected({
                    ...selected,
                    newPhysician: {
                      ...value,
                      branch: activePlatform?.branchId,
                      source: getSourceForPhysician(deal?.source?._id),
                    },
                  })
                }
                handleCheck={() =>
                  handleUpdate("physicianId._id", "newPhysician")
                }
                handleClose={() => setSelected({})}
              />
            )}
          </div>
          <div
            className="cursor-pointer"
            style={{
              opacity: isPhysicianEdit ? 0 : 1,
            }}
            onClick={() => {
              setSelected({ ...deal, updatedKey: "physician" });
            }}
          >
            <small className="mr-1 grey-text">Physician:</small>
            {showingPhysician(deal)}
          </div>
        </td>

        <td style={{ fontWeight: 400 }} className="position-relative">
          <div className="d-flex align-items-center">
            <div style={{ minHeight: "36px", minWidth: "42px" }}>
              <EditableField
                animationStyle={{ width: "7rem" }}
                animation
                displayStyle={{
                  marginTop: "0.5rem",
                  fontWeight: "bold",
                  marginRight: "0.2rem",
                }}
                className="form-control form-control-sm mb-1"
                placeholder="Amount"
                keyForValue="newAmount"
                fieldData={{ _id: deal._id, newAmount: deal.amount }}
                onSave={(data) => {
                  handleUpdatePrice({ ...data, ...deal });
                }}
                formSubmitted={formSubmitted}
                isSuccess={isSuccess}
                isMoney
              />
            </div>

            <img
              src={img}
              alt={text}
              className="ml-1"
              title={text}
              style={{
                ...style,
              }}
            />
          </div>
          {isDiscounted && (
            <p
              style={{ color: "red", marginTop: "-0.2rem" }}
              title="Discount"
              className="d-flex align-items-center"
            >
              {currency.format(deal.discount)}
              <img
                alt="Discount"
                className="ml-3"
                src={discount}
                title="Discount"
                style={{ height: "1.4rem" }}
              />
            </p>
          )}
          {deal.payment !== "voucher" && (
            <p
              style={{ marginTop: "-0.5rem" }}
              title="Tendered"
              className="d-flex align-items-center"
            >
              {currency.format(deal.cash)}
              <img
                alt="tendered"
                className="ml-2"
                src={tendered}
                title="Tendered"
                style={{ height: "2rem" }}
              />
            </p>
          )}
        </td>
        <td>
          {deal.cart?.map((menu) => (
            <MDBBadge
              key={menu.referenceId}
              className="mx-1"
              title={menu?.packagesDisplay}
            >
              {menu?.abbreviation}
            </MDBBadge>
          ))}
        </td>
        <td>
          {!isHover ? (
            HMO.getName(deal.hmo)
          ) : (
            <>
              <MDBBtnGroup>
                {!isDeleted ? (
                  <>
                    <button
                      onClick={() => handleDelete(deal)}
                      title="Delete Sale"
                      className="mr-1 "
                      style={{
                        background: "red",
                        border: "none",

                        color: "white",
                        borderRadius: "4px",
                        boxShadow: "0 0px 7px  rgba(0, 0, 0, 0.2)",
                        padding: "5px 8px",
                        cursor: "pointer",
                        transition: "all 0.2s",
                      }}
                    >
                      <MDBIcon icon="trash" />
                    </button>
                  </>
                ) : (
                  <div style={{ width: "8.4rem" }}>
                    <MDBBtn
                      size="sm"
                      color="warning"
                      rounded
                      onClick={() => handleRevert(deal)}
                      title="Revert Sale"
                    >
                      <MDBIcon fas icon="sync-alt" />
                    </MDBBtn>
                  </div>
                )}
              </MDBBtnGroup>
            </>
          )}
        </td>
      </tr>
      {deal.remarks && (
        <tr>
          <td colSpan={6}>Remarks: {deal.remarks}</td>
        </tr>
      )}
    </React.Fragment>
  );
};

export default Patient;
