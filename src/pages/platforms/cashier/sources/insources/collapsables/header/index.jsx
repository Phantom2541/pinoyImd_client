import React from "react";
import { MDBCollapseHeader, MDBBtn, MDBBadge } from "mdbreact";
import {
  capitalize,
  collapse,
  currency,
} from "../../../../../../../services/utilities";
import { Input } from "../../../../../../../components/customizable";
import { Select } from "../../../../../../../components/customizable";
import PopOver from "./popOver";
import { Memberships } from "../../../../../../../services/fakeDb";

const Header = ({
  insource,
  registerGhostCompany,
  setDidHoverId,
  setSelected,
  handleUntag,
  setActiveId,
  activeId,
  didHoverId,
  index,
  update,
  setUpdate,
  handleUpdate,
  formSubmitted,
}) => {
  const {
    clients,
    _id,
    membership = "",
    name: ghostName,
    subName: ghostSubName,
    cutoff = 0,
    credit = 0,
  } = insource;
  const isGhost = clients?._id ? false : true;

  const { name, displayname } = clients || "";
  const baseName = isGhost ? ghostName : name;
  const baseSubname = isGhost ? ghostSubName : displayname;

  const { color, border } = collapse.getStyle(index, activeId, didHoverId);

  const isPopOver = (activeId === index || didHoverId === index) && !isGhost;

  const isEditableBranch =
    !clients?.companyId && !clients?.isVerified && !isGhost;

  const isWhiteColor = color === "text-white"; //para sa color ng small tag

  return (
    <MDBCollapseHeader
      onMouseLeave={() => setDidHoverId(-1)}
      onMouseEnter={() => setDidHoverId(index)}
      onClick={(event) => {
        event.stopPropagation();
        if (isGhost) return registerGhostCompany(insource);
        setSelected({
          branchId: clients?._id,
          providerId: _id,
        });
      }}
      className={`${border} m-0 p-3`}
      title={isGhost && "Unregistered company"}
      style={{ borderRadius: "50%" }}
    >
      <div
        className={`d-flex justify-content-between ${color} `}
        style={{ color: color === "text-white" && "white !important" }}
      >
        <div className="d-flex align-items-start">
          <div className="mr-5">
            <small
              style={{ fontSize: "0.7rem" }}
              className={!isWhiteColor && "grey-text"}
            >
              Branch
            </small>
            {update.updatedKey === "branch" &&
            update.providerID === _id &&
            isEditableBranch ? (
              <Input
                className="mt-2 form-control form-control-sm"
                _key={"newName"}
                selected={update}
                formSubmitted={formSubmitted}
                onChange={(value) => setUpdate({ ...update, newName: value })}
                handleCheck={() => handleUpdate(false)}
                handleClose={() => setUpdate({})}
              />
            ) : (
              <h6
                style={{ marginBottom: "-4px" }}
                onClick={() =>
                  setUpdate({
                    ...clients,
                    newName: clients.displayname,
                    updatedKey: "branch",
                    providerID: _id,
                  })
                }
              >
                {baseSubname}
              </h6>
            )}
            <MDBBadge style={{ fontSize: "10px" }}>{baseName}</MDBBadge>
          </div>

          <div className="mr-5">
            <small
              style={{ fontSize: "0.7rem" }}
              className={!isWhiteColor && "grey-text"}
            >
              Membership
            </small>
            {update?.updatedKey === "membership" &&
            update?.providerID === _id ? (
              <Select
                className="m-0 p-0"
                collections={Memberships}
                preValue={update.updatedValue}
                handleCheck={() => handleUpdate()}
                handleClose={() => setUpdate({})}
                formSubmitted={formSubmitted}
                onChange={(value) =>
                  setUpdate({
                    updatedKey: "membership",
                    newMembership: value,
                    membership,
                    newKey: "newMembership",
                    providerID: _id,
                  })
                }
                values={"text"}
                soloUpdate
                keys={"value"}
              />
            ) : (
              <h6
                onClick={() => {
                  setUpdate({
                    updatedKey: "membership",
                    updatedValue: membership,
                    providerID: _id,
                  });
                }}
              >
                {membership ? capitalize(membership) : "N/A"}
              </h6>
            )}
          </div>
          <div className="mr-5">
            <small
              style={{ fontSize: "0.7rem" }}
              className={!isWhiteColor && "grey-text"}
            >
              Monthly Cutoff
            </small>
            {update?.updatedKey === "cutoff" && update?.providerID === _id ? (
              <div style={{ width: "6rem" }}>
                <Select
                  className="m-0 p-0"
                  collections={new Array(27).fill(0).map((_, i) => i + 1)}
                  preValue={update.updatedValue}
                  handleCheck={() => handleUpdate()}
                  handleClose={() => setUpdate({})}
                  formSubmitted={formSubmitted}
                  onChange={(value) =>
                    setUpdate({
                      updatedKey: "cutoff",
                      newCutoff: value,
                      cutoff,
                      newKey: "newCutoff",
                      providerID: _id,
                    })
                  }
                  soloUpdate
                />
              </div>
            ) : (
              <h6
                onClick={() => {
                  setUpdate({
                    updatedKey: "cutoff",
                    updatedValue: cutoff,
                    providerID: _id,
                  });
                }}
              >
                {cutoff ? cutoff : "N/A"}
              </h6>
            )}
          </div>
          <div>
            <small
              style={{ fontSize: "0.7rem" }}
              className={!isWhiteColor && "grey-text"}
            >
              Credit
            </small>
            {update.updatedKey === "credit" && update?.providerID === _id ? (
              <div style={{ width: "9rem" }}>
                <Input
                  _key={"newCredit"}
                  className="mt-2 form-control form-control-sm"
                  type="number"
                  selected={update}
                  formSubmitted={formSubmitted}
                  handleClose={() => setUpdate({})}
                  handleCheck={() => handleUpdate()}
                  onChange={(value) =>
                    setUpdate({
                      updatedKey: "credit",
                      credit,
                      newCredit: Number(value),
                      newKey: "newCredit",
                      providerID: _id,
                    })
                  }
                />
              </div>
            ) : (
              <h6
                onClick={() => {
                  setUpdate({
                    updatedKey: "credit",
                    newCredit: credit,
                    providerID: _id,
                  });
                }}
              >
                {credit ? currency(credit) : "N/A"}
              </h6>
            )}
          </div>
          {isGhost ? (
            <span
              style={{ fontSize: "20px" }}
              className="ml-2"
              role="img"
              aria-label="ghost"
            >
              👻
            </span>
          ) : (
            ""
          )}

          {isPopOver && (
            <div className="d-flex align-items-center h-100 ml-3">
              <PopOver
                handleUntag={handleUntag}
                index={index}
                setActiveId={setActiveId}
                providerID={_id}
              />
            </div>
          )}
        </div>

        <small
          className="d-flex justify-content-between align-items-center"
          onClick={() => {
            setActiveId((prev) => (prev === index ? -1 : index));
            setSelected({
              branchId: clients?._id,
              providerId: _id,
            });
          }}
        >
          <MDBBtn
            size="sm"
            color="white"
            rounded
            className="m-0 p-0 transition-all "
            onClick={() => {
              if (isGhost) return registerGhostCompany(insource);
            }}
            style={{
              height: "1.3rem",
              width: activeId === index ? "1.5rem" : "2rem",
            }}
          >
            <i
              style={{
                rotate: `${activeId === index ? 0 : 90}deg`,
              }}
              className="fa fa-angle-down transition-all "
            />
          </MDBBtn>
        </small>
      </div>
    </MDBCollapseHeader>
  );
};

export default Header;
