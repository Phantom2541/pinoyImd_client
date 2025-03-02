import React, { useState } from "react";
import {
  MDBBtn,
  MDBCard,
  MDBCardBody,
  MDBCollapse,
  MDBCollapseHeader,
  MDBContainer,
  MDBIcon,
  MDBPopover,
  MDBPopoverBody,
  MDBPopoverHeader,
} from "mdbreact";
import { useDispatch, useSelector } from "react-redux";
import { SearchPhysicians as Search } from "../../../../../../components/searchables";
import { TagPHYSICIAN } from "../../../../../../services/redux/slices/assets/branches";
import {
  SetBRANCHES,
  DESTROY,
} from "../../../../../../services/redux/slices/assets/providers";
import { SAVE } from "../../../../../../services/redux/slices/assets/persons/physicians";
import Swal from "sweetalert2";
import CollapseTable from "./table";

export default function MenuCollapse() {
  /**
   * check who will open
   */
  const { token } = useSelector(({ auth }) => auth),
    { collections } = useSelector(({ providers }) => providers),
    [selected, setSelected] = useState({}),
    [activeId, setActiveId] = useState(-1),
    [didHoverId, setDidHoverId] = useState(-1),
    dispatch = useDispatch();

  // console.log("collections: ", collections);
  console.log("did hover id", didHoverId);
  const handleTag = (physician) => {
    const { isPhysician, physicianId, isGhost = false } = physician;
    const { branchId, providerId } = selected;
    if (isGhost) return;
    if (!isPhysician) return handleRegister(physician);

    dispatch(
      TagPHYSICIAN({
        data: {
          physicianId,
          providerId,
          branchId,
        },
        token,
      })
    ).then(({ payload: response }) => {
      const { payload } = response;
      dispatch(SetBRANCHES(payload));
    });
  };

  const handleRegister = (user) => {
    const { _id } = user;
    const { branchId, providerId } = selected;

    Swal.fire({
      title: "Register as a Physician?",
      text: "Would you like to register as a physician and be associated with this company?",
      icon: "question",
      input: "text",
      inputPlaceholder: "Enter specialization",
      showCancelButton: true,
      confirmButtonText: "Yes, Register",
      cancelButtonText: "No, Cancel",
      preConfirm: (specialization) => {
        if (!specialization) {
          Swal.showValidationMessage("Specialization is required");
          return false; // Prevent proceeding
        }
        return specialization;
      },
    }).then((result) => {
      if (result.isConfirmed) {
        const specialization = result.value;

        dispatch(
          SAVE({ data: { user: _id, specialization, status: "active" }, token }) // for creating a physician
        ).then(({ payload }) => {
          // for tagging a physician
          const { _id: physicianId } = payload;
          dispatch(
            TagPHYSICIAN({
              data: { physicianId, providerId, branchId },
              token,
            })
          ).then(({ payload: response }) => {
            // for updating branches of provider
            const { payload } = response;
            dispatch(SetBRANCHES(payload));
          });
        });
      }
    });
  };

  const handleUntag = (providerId) => {
    Swal.fire({
      title: "Are you sure?",
      text: "You want to untag this company!",
      icon: "warning",
      showCancelButton: true,
      confirmButtonColor: "#3085d6",
      cancelButtonColor: "#d33",
      confirmButtonText: "Yes, untag it!",
    }).then((result) => {
      if (result.isConfirmed) {
        dispatch(DESTROY({ token, data: { providerId } }));
      }
    });
  };

  return (
    <MDBContainer
      style={{
        minHeight: "300px",
      }}
      fluid
    >
      {collections?.map(
        ({ clients, name, subName, _id, membership = "" }, index) => {
          const affiliated = clients?.affiliated || [];
          const textColor =
            activeId !== index
              ? didHoverId === index
                ? "text-primary"
                : "text-black"
              : "text-white";
          const bgBorder =
            activeId === index
              ? " bg-info transition"
              : didHoverId === index
              ? "rounded border border-info bg-transparent ease-out"
              : "bg-transparent ease-out";
          return (
            <MDBCard
              key={`staffs-${index}`}
              style={{ boxShadow: "0px 0px 0px 0px", backgroundColor: "white" }}
            >
              <MDBCollapseHeader
                onMouseLeave={() => setDidHoverId(-1)}
                onMouseEnter={() => setDidHoverId(index)}
                onClick={(event) => event.stopPropagation()}
                className={bgBorder}
                style={{ borderRadius: "50%" }}
              >
                <label
                  className={`d-flex justify-content-between ${textColor} `}
                >
                  <span className="d-flex align-items-center transition-all">
                    {index + 1}. {name} {subName}
                    {membership ? `| ${membership}` : ""}
                    {(activeId === index || didHoverId === index) && (
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
                            <i class="fa fa-ellipsis-h"></i>
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
                      setSelected({ branchId: clients?._id, providerId: _id });
                    }}
                  >
                    <MDBBtn
                      size="sm"
                      color="white"
                      rounded
                      className="m-0 p-0 transition-all "
                      style={{ width: activeId === index ? "1.5rem" : "2rem" }}
                    >
                      <i
                        style={{ rotate: `${activeId === index ? 0 : 90}deg` }}
                        className="fa fa-angle-down transition-all "
                      />
                    </MDBBtn>
                  </small>
                </label>
              </MDBCollapseHeader>
              <MDBCollapse
                id={`collapse-${index}`}
                className="mb-2 border border-black"
                isOpen={index === activeId}
              >
                <div className="mt-2 mr-3 ml-3 d-flex justify-content-between align-items-center">
                  <span>Physician List</span>
                  <div className="d-flex align-items-center">
                    <span>Tag Physician</span>
                    <Search
                      setPhysician={handleTag}
                      setRegister={handleRegister}
                    />
                  </div>
                </div>
                <MDBCardBody className="pt-2">
                  <CollapseTable
                    affiliated={affiliated}
                    providerId={_id}
                    BranchId={clients?._id}
                  />
                </MDBCardBody>
              </MDBCollapse>
            </MDBCard>
          );
        }
      )}
    </MDBContainer>
  );
}
