import React, { useEffect, useState } from "react";
import { MDBCard, MDBCardBody, MDBCollapse, MDBContainer } from "mdbreact";
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
import { fullName } from "../../../../../../services/utilities";
import Modal from "./modal";
import Header from "./header";

export default function MenuCollapse() {
  const { token } = useSelector(({ auth }) => auth),
    { collections, searchResults, didSearch } = useSelector(
      ({ providers }) => providers
    ),
    [insources, setInsources] = useState([]),
    [selected, setSelected] = useState({}),
    [ghostCompany, setGhostCompany] = useState({}),
    [show, setShow] = useState(false),
    [activeId, setActiveId] = useState(-1),
    [didHoverId, setDidHoverId] = useState(-1),
    dispatch = useDispatch();

  useEffect(() => {
    if (didSearch && searchResults.length > 0) {
      setInsources(searchResults || []);
    } else {
      setInsources(collections || []);
    }
    console.log("search in insource", searchResults, didSearch);
  }, [collections, didSearch, searchResults]);

  const toggle = () => setShow(!show);

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
              })
            ).unwrap();
          })
          .then((branch) => {
            dispatch(SetBRANCHES(branch.payload));
          })
          .catch((_) => {
            Swal.fire(
              "Error",
              "Failed to register physician. Please try again.",
              "error"
            );
          });
      } else if (result.dismiss === Swal.DismissReason.cancel) {
        Swal.fire("Cancelled", "Registration cancelled.", "error");
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
        setGhostCompany(insource);
        toggle();
      }
    });
  };
  // If there is no client, it means a ghost.

  return (
    <MDBContainer
      style={{
        minHeight: "300px",
      }}
      fluid
    >
      {insources?.length > 0 ? (
        insources?.map((insource, index) => {
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
                handleUntag={handleUntag}
                registerGhostCompany={registerGhostCompany}
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
                      clientID={clients._id}
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
        <p>No record</p>
      )}
      <Modal toggle={toggle} show={show} selected={ghostCompany} />
    </MDBContainer>
  );
}
