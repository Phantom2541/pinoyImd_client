import React, { useEffect, useState } from "react";
import {
  MDBCollapseHeader,
  MDBIcon,
  MDBPopover,
  MDBPopoverBody,
  MDBPopoverHeader,
  MDBBtn,
} from "mdbreact";
import { collapse } from "../../../../../../services/utilities";
import { Input } from "../../../../../../components/customizable";
import { useDispatch, useSelector } from "react-redux";
import {
  UPDATE,
  RESET,
} from "../../../../../../services/redux/slices/assets/branches";
import { useToasts } from "react-toast-notifications";

import { SetBRANCHES } from "../../../../../../services/redux/slices/assets/providers";

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
  const { token } = useSelector(({ auth }) => auth),
    { formSubmitted, isSuccess } = useSelector(({ branches }) => branches),
    [update, setUpdate] = useState({}),
    { addToast } = useToasts(),
    dispatch = useDispatch();

  useEffect(() => {
    if (!formSubmitted && isSuccess) {
      dispatch(RESET());
    }
  }, [dispatch, formSubmitted, isSuccess]);

  const {
    clients,
    _id,
    membership = "",
    name: ghostName,
    subName: ghostSubName,
  } = insource;
  const isGhost = clients?._id ? false : true;

  const { name, displayname } = clients || "";
  const baseName = isGhost ? ghostName : name;
  const baseSubname = isGhost ? ghostSubName : displayname;

  const { color, border } = collapse.getStyle(index, activeId, didHoverId);

  const isPopOver = (activeId === index || didHoverId === index) && !isGhost;

  const isEditable = !clients?.companyId && !clients?.isVerified && !isGhost;

  const handleUpdateClient = () => {
    const { newName, name } = update;
    if (name.toLowerCase() === newName.toLowerCase()) {
      setUpdate({});
      return addToast("No changes found, skipping update.", {
        appearance: "info",
      });
    }
    dispatch(UPDATE({ data: { ...update, name: newName }, token }))
      .then(({ payload: branch }) => {
        dispatch(
          SetBRANCHES({
            branch,
            providerId: _id,
            isUpdateBranch: true,
          })
        );

        setUpdate({}); // Reset state after update
      })
      .catch((error) => console.error("Update Error:", error));
  };

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
        {update._id !== clients._id ? (
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
                      {isEditable && (
                        <MDBBtn
                          size="sm"
                          color="primary"
                          onClick={() =>
                            setUpdate({ ...clients, newName: clients.name })
                          }
                        >
                          <MDBIcon icon="pencil-alt" className="mr-2" />
                          Update
                        </MDBBtn>
                      )}
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
        ) : (
          <Input
            className="mt-2 form-control form-control-sm"
            _key={"newName"}
            selected={update}
            formSubmitted={formSubmitted}
            isSuccess={isSuccess}
            onChange={(value) => setUpdate({ ...update, newName: value })}
            handleCheck={handleUpdateClient}
            handleClose={() => setUpdate({})}
          />
        )}
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
