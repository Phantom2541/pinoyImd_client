import React from "react";
import {
  MDBCollapseHeader,
  MDBIcon,
  MDBPopover,
  MDBPopoverBody,
  MDBPopoverHeader,
  MDBBtn,
} from "mdbreact";
import { collapse } from "../../../../../../services/utilities";

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
}) => {
  const {
    clients,
    _id,
    membership = "",
    name: ghostName,
    subName: ghostSubName,
  } = insource;
  const isGhost = clients?._id ? false : true;

  const { name, companyName } = clients || "";

  const baseName = isGhost ? ghostName : name;
  const baseSubname = isGhost ? ghostSubName : companyName;

  const { color, border } = collapse.getStyle(index, activeId, didHoverId);

  const isPopOver = (activeId === index || didHoverId === index) && !isGhost;
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
      className={border}
      title={isGhost && "Unregistered company"}
      style={{ borderRadius: "50%" }}
    >
      <label className={`d-flex justify-content-between ${color} `}>
        <span className="d-flex align-items-center transition-all">
          {index + 1}. {baseName} {baseSubname}{" "}
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
          {membership ? ` | ${membership}` : ""}
          {isPopOver && (
            <>
              <MDBPopover
                placement="bottom"
                popover
                clickable
                id={`popover-${index}`}
              >
                <MDBBtn
                  className="m-0 p-0 ml-2"
                  rounded
                  color="light"
                  onClick={() => setActiveId(index)}
                  style={{
                    width: "1.8rem",
                    boxShadow: "0px 0px 0px 0px",
                  }}
                >
                  <i className="fa fa-ellipsis-h"></i>
                </MDBBtn>
                <div>
                  <MDBPopoverHeader className="text-center">
                    Actions
                  </MDBPopoverHeader>
                  <MDBPopoverBody className="d-flex flex-column m-0 p-0">
                    <MDBBtn size="sm" color="primary">
                      <MDBIcon icon="pencil-alt" className="mr-2" />
                      Update
                    </MDBBtn>
                    <MDBBtn
                      size="sm"
                      color="danger"
                      onClick={() => handleUntag(_id)}
                    >
                      <MDBIcon icon="unlink" className="mr-2" />
                      Untag
                    </MDBBtn>
                  </MDBPopoverBody>
                </div>
              </MDBPopover>
            </>
          )}
        </span>
        <small
          className="d-flex justify-content-between"
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
      </label>
    </MDBCollapseHeader>
  );
};

export default Header;
