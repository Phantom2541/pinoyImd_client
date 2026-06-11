import React, { useEffect, useState } from "react";
import { MDBCard, MDBCardBody, MDBCollapse, MDBContainer } from "mdbreact";
import { useDispatch, useSelector } from "react-redux";
import { SearchPhysicians as Search } from "../../../../../../../components/searchables";
import {
  TagPHYSICIAN,
  UPDATE,
  RESET as RESET_BRANCH,
} from "../../../../../../../services/redux/slices/assets/branches";

import {
  SetBRANCHES,
  SPECIFIC_UPDATE,
  SetREGISTER,
} from "../../../../../../../services/redux/slices/assets/providers";
import { fullName } from "../../../../../../../services/utilities";
import { SAVE } from "../../../../../../../services/redux/slices/assets/persons/physicians";
import { useToasts } from "react-toast-notifications";
import Swal from "sweetalert2";
import CollapseTable from "./table";
import Header from "./header";

export default function HMOCollapse() {
  const { token, maxPage } = useSelector(({ auth }) => auth),
    {
      filtered,
      searchResults,
      didSearch,
      formSubmitted,
      isSuccess,
      message,
      activePage,
    } = useSelector(({ providers }) => providers),
    { formSubmitted: formSubmittedBranch, isSuccess: isSuccessBranch } =
      useSelector(({ branches }) => branches),
    [insources, setInsources] = useState([]),
    [selected, setSelected] = useState({}),
    [update, setUpdate] = useState({}),
    [activeId, setActiveId] = useState(-1),
    [didHoverId, setDidHoverId] = useState(-1),
    { addToast } = useToasts(),
    dispatch = useDispatch();

  useEffect(() => {
    if (didSearch && searchResults.length > 0) {
      setInsources(searchResults || []);
    } else {
      setInsources(filtered || []);
    }
  }, [filtered, didSearch, searchResults]);

  useEffect(() => {
    if (message) {
      addToast(message, {
        appearance: isSuccess ? "success" : "error",
      });
    }
    // return () => dispatch(RESET());
  }, [isSuccess, message, addToast, dispatch]);

  useEffect(() => {
    if (!formSubmittedBranch && isSuccessBranch) {
      dispatch(RESET_BRANCH());
    }
  }, [dispatch, formSubmittedBranch, isSuccessBranch]);

  useEffect(() => {
    if (!formSubmitted && isSuccess) {
      setUpdate({});
      dispatch(RESET_BRANCH());
    }
  }, [dispatch, formSubmitted, isSuccess]);

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
      }),
    ).then(({ payload: response }) => {
      const { payload } = response;
      dispatch(SetBRANCHES(payload));
    });
  };

  const handleRegister = (user) => {
    const { fullName: name } = user;
    const { branchId, providerId } = selected;

    Swal.fire({
      html: `
      <h4 class="font-weight-bold">${fullName(name)}</h4>
       <p>Not Register as a physician</p>
      <div>
        <input id="specialization" class=" form-control mt-3" placeholder="Specialization" >
      </div>
    `,
      showCancelButton: true,
      reverseButtons: true,
      confirmButtonText: "Register it",
      cancelButtonText: "No, Cancel",
      preConfirm: () => {
        const specialization = document
          .getElementById("specialization")
          ?.value.trim();

        if (!specialization) {
          Swal.showValidationMessage("Specialization are required.");
          return false;
        }

        return specialization;
      },
    }).then((result) => {
      if (result.isConfirmed) {
        const specialization = result.value;

        dispatch(SAVE({ data: { user: user._id, specialization }, token }))
          .unwrap()
          .then((physician) => {
            const { _id: physicianId } = physician;
            // Dispatch TagPHYSICIAN action
            return dispatch(
              TagPHYSICIAN({
                data: { physicianId, providerId, branchId },
                token,
              }),
            ).unwrap();
          })
          .then((branch) => {
            dispatch(SetBRANCHES(branch.payload));
          })
          .catch((_) => {
            Swal.fire(
              "Error",
              "Failed to register physician. Please try again.",
              "error",
            );
          });
      } else if (result.dismiss === Swal.DismissReason.cancel) {
        Swal.fire("Cancelled", "Registration cancelled.", "error");
      }
    });
  };

  const registerGhostCompany = (insource) => {
    const { name } = insource;
    Swal.fire({
      title: name,
      text: "This company is not registered. Would you like to register it and assign it as your client?",
      icon: "warning",
      showCancelButton: true,
      confirmButtonColor: "#3085d6",
      cancelButtonColor: "#d33",
      confirmButtonText: "Yes, Register it!",
      cancelButtonText: "Cancel",
    }).then((result) => {
      if (result.isConfirmed) {
        dispatch(SetREGISTER(insource));
      }
    });
  };

  const handleUpdateClient = (data) => {
    const { providerID } = data;

    dispatch(UPDATE({ data, token }))
      .then(({ payload: branch }) => {
        dispatch(
          SetBRANCHES({
            branch,
            providerId: providerID,
            isUpdateBranch: true,
          }),
        );
      })
      .catch((error) => console.error("Update Error:", error));
  };

  const handleUpdate = (editedData) => {
    dispatch(
      SPECIFIC_UPDATE({
        data: editedData,
        token,
      }),
    );
  };
  const itemsPerPage = maxPage; // Number of items per page
  const startIndex = (activePage - 1) * itemsPerPage;
  const endIndex = startIndex + itemsPerPage;
  const paginatedData = insources?.slice(startIndex, endIndex); // Get only items for the active page

  return (
    <MDBContainer
      style={{
        minHeight: "300px",
      }}
      fluid
    >
      {paginatedData?.length > 0 ? (
        paginatedData?.map((insource, index) => {
          const { clients, _id } = insource;
          const isGhost = clients?._id ? false : true;
          const affiliated = clients?.affiliated || [];

          return (
            <MDBCard
              key={`staffs-${index}`}
              style={{
                boxShadow: "0px 0px 0px 0px",
                backgroundColor: "white",
              }}
            >
              <Header
                index={index}
                setActiveId={setActiveId}
                activeId={activeId}
                didHoverId={didHoverId}
                setDidHoverId={setDidHoverId}
                setSelected={setSelected}
                update={update}
                setUpdate={setUpdate}
                handleUpdate={(data, isSpecific = true) =>
                  isSpecific ? handleUpdate(data) : handleUpdateClient(data)
                }
                registerGhostCompany={registerGhostCompany}
                formSubmitted={formSubmitted || formSubmittedBranch}
                isSucess={isSuccess || isSuccessBranch}
                insource={insource}
              />
              <MDBCollapse
                id={`collapse-${index}`}
                className="mb-2 border border-black"
                isOpen={index === activeId && !isGhost}
              >
                <div className="mt-2 mr-3 ml-3 d-flex justify-content-between align-items-center">
                  <span>Physician List</span>
                  <div className="d-flex align-items-center">
                    <span>Tag Physician</span>
                    <Search
                      clientID={clients?._id}
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
        })
      ) : (
        <p className="text-center">No record.</p>
      )}
      {/* <Modal toggle={toggle} show={show} selected={ghostCompany} /> */}
    </MDBContainer>
  );
}
