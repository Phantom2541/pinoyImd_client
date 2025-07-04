import { useState } from "react";
import { useDispatch, useSelector } from "react-redux";
import {
  MDBCard,
  MDBCollapse,
  MDBCollapseHeader,
  MDBContainer,
} from "mdbreact";

import CollapsableBody from "./body";
import CollapsableHeader from "./header";
import { collapse, fullName } from "../../../../../../services/utilities";
import Search from "../../../../../../components/searchables/users";
import Swal from "sweetalert2";
import { Policy } from "../../../../../../services/fakeDb";
import {
  ASSIGN_AO,
  RESET,
} from "../../../../../../services/redux/slices/assets/branches";
import { orderBy } from "lodash";

export default function Body() {
  const { auth, token } = useSelector(({ auth }) => auth),
    { filtered, activePage, maxPage } = useSelector(({ branches }) => branches),
    dispatch = useDispatch();
  /**
   * Pagination: Calculate the start and end index for the current page
   */
  const itemsPerPage = maxPage; // Number of items per page
  const startIndex = (activePage - 1) * itemsPerPage;
  const endIndex = startIndex + itemsPerPage;

  const paginatedData = orderBy(
    filtered,
    [(o) => o.name.toLowerCase().trim()], // field or accessor function
    ["asc"] // sort order
  ).slice(startIndex, endIndex);

  /**
   * Active states
   */
  const [activeId, setActiveId] = useState(-1);
  const [didHoverId, setDidHoverId] = useState(-1);

  const sortByAscending = (array, key) => {
    return [...array].sort((a, b) =>
      String(a[key]).localeCompare(String(b[key]))
    );
  };
  const RegisterNewPersonnel = (selected, branch) => {
    const haveAo = branch.ao ? true : false;
    const { hasPersonnel = false } = selected;
    const name = fullName(selected.fullName);

    var introText = hasPersonnel
      ? `${name} is already registered as personnel in a different branch. If you proceed, they will be registered under your branch and assigned as the Administrative Officer.`
      : `${name} is not yet registered as personnel. If you proceed, they will be registered and assigned as the Administrative Officer.`;
    if (branch.ao) {
      if (haveAo) {
        introText += ` This action will replace the current Administrative Officer assigned to this branch.`;
      }
    }
    Swal.fire({
      title: "Are you sure?",
      text: introText,
      icon: "warning",
      showCancelButton: true,
      confirmButtonText: "Yes, proceed",
      cancelButtonText: "Cancel",
    }).then((res) => {
      if (!res.isConfirmed) return;

      const deptOptions = sortByAscending(Policy.collections, "department")
        .map((p) => `<option value="${p.department}">${p.department}</option>`)
        .join("");

      Swal.fire({
        icon: "info",
        html: `
        <div style="margin-bottom: 1rem;">
          <div style="font-weight: bold; font-size: 20px;">${name}</div>
          <div style="font-size: 16px; color: #666;">
            Please choose department and designation before assigning as Administrative Officer.
          </div>
        </div>
        <select id="select1" class="swal2-input form-control">
          <option value="">Department...</option>${deptOptions}
        </select>
        <select id="select2" class="swal2-input form-control mt-2">
          <option value="">Designation...</option>
        </select>
      `,
        showCancelButton: true,
        confirmButtonText: "Assigned",
        cancelButtonText: "Cancel",
        didOpen: () => {
          const $dept = document.getElementById("select1");
          const $desig = document.getElementById("select2");

          $dept.addEventListener("change", ({ target }) => {
            const positions = sortByAscending(
              Policy.getPositionsByDepartmentName(target.value),
              "display_name"
            );
            $desig.innerHTML = positions.length
              ? `<option value="">Designation...</option>` +
                positions
                  .map(
                    (p) => `<option value="${p.id}">${p.display_name}</option>`
                  )
                  .join("")
              : `<option value="">No designations available</option>`;
          });
        },
        preConfirm: () => {
          const department = document.getElementById("select1").value;
          const designation = document.getElementById("select2").value;
          if (!department || !designation)
            return Swal.showValidationMessage("Both fields are required.");
          return { department, designation };
        },
      }).then(({ isConfirmed, value }) => {
        if (!isConfirmed) return;
        const data = {
          newPersonnel: true,
          authID: auth._id,
          branchId: branch._id,
          existingAo: branch.ao,
          userId: selected._id,
          personnel: {
            branch: branch._id,
            user: selected._id,
            newPersonnel: true,
            platform: "manager",
            status: "active",
            contract: {
              designation: value.designation,
            },
          },
        };

        dispatch(ASSIGN_AO({ data, token }));
        dispatch(RESET());
        Swal.fire({
          title: "Assigned!",
          icon: "success",
          text: hasPersonnel
            ? `${name} has been reassigned to your branch and designated as the Administrative Officer.`
            : `${name} has been registered as personnel and assigned as the Administrative Officer.`,
        });
        // 🔥 Your logic here:
        // registerAndAssignAO(selected._id, value.department, value.designation);
      });
    });
  };

  return (
    <MDBContainer
      style={{
        minHeight: "300px",
      }}
      fluid
    >
      {paginatedData.length > 0 ? (
        <>
          {paginatedData?.map((branch, index) => {
            const actualIndex = startIndex + index; // Get the real index in filtered array
            const { color, border } = collapse.getStyle(
              actualIndex,
              activeId,
              didHoverId
            );
            return (
              <MDBCard
                key={`branch-${actualIndex}-${branch._id}`}
                style={{
                  boxShadow: "0px 0px 0px 0px",
                  backgroundColor: "white",
                }}
              >
                <MDBCollapseHeader
                  className={border}
                  onMouseLeave={() => setDidHoverId(-1)}
                  onMouseEnter={() => setDidHoverId(actualIndex)}
                  style={{ borderRadius: "50%" }}
                >
                  <CollapsableHeader
                    branch={branch}
                    isOpen={activeId === actualIndex}
                    textColor={color}
                    setActiveId={(id) => setActiveId(id)}
                    index={actualIndex}
                  />
                </MDBCollapseHeader>

                <MDBCollapse
                  id={`collapse-${actualIndex}-${branch._id}`}
                  className="  m-0 p-0 border border-black"
                  isOpen={actualIndex === activeId}
                >
                  <div
                    className="mx-1 d-flex align-items-center justify-content-between mt-2"
                    style={{ marginBottom: "-0.2rem" }}
                  >
                    <h6 style={{ fontWeight: 500 }}>Personnel List</h6>
                    <Search
                      excludes={branch.personnels}
                      excludeKey="user._id"
                      setPatient={(user) => RegisterNewPersonnel(user, branch)}
                    />
                  </div>

                  <CollapsableBody
                    branch={branch || {}}
                    key={`${branch._id}-collapse-body`}
                  />
                </MDBCollapse>
              </MDBCard>
            );
          })}
        </>
      ) : (
        <h6 className="text-center fw-bold">No Record.</h6>
      )}
    </MDBContainer>
  );
}
