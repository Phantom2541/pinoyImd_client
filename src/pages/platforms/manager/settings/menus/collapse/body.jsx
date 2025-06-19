import React, { useEffect, useState } from "react";
import { MDBTable, MDBTableHead, MDBTableBody, MDBBtn } from "mdbreact";
import { useDispatch, useSelector } from "react-redux";
import { capitalize } from "../../../../../../services/utilities";
import { Services, Templates } from "../../../../../../services/fakeDb";
import { UPDATE } from "../../../../../../services/redux/slices/commerce/catalog/menus";
import Swal from "sweetalert2";
import Modal from "./modal";

export default function CollapseTable({
  packages,
  menuId,
  menuDescription,
  setActiveId,
  resetSearch,
  searchKey,
  menuAbbreviation,
}) {
  const [services, setServices] = useState([]);
  const [showModal, setShowModal] = useState(false);
  const { token, activePlatform } = useSelector(({ auth }) => auth);
  const { formSubmitted, isSuccess } = useSelector(({ menus }) => menus);
  const dispatch = useDispatch();

  useEffect(() => {
    setServices(Services.whereIn(packages));
  }, [packages]);

  useEffect(() => {
    if (!formSubmitted && isSuccess) {
      setShowModal(false);
    }
  }, [formSubmitted, isSuccess]);

  const toggleModal = () => setShowModal((prev) => !prev);

  const handlePick = (selected) => {
    const selectedIds = selected.map(({ id }) => id);
    const ids = [...new Set([...selectedIds, ...packages])];

    dispatch(
      UPDATE({
        token,
        data: {
          abbreviation: menuAbbreviation,
          description: menuDescription,
          branchId: activePlatform?.branchId,
          packages: ids,
          _id: menuId,
        },
      })
    );

    // toggleModal();
    if (searchKey) {
      setActiveId(-1);
      resetSearch();
    }
  };

  const handleDestroyOne = (idToRemove) => {
    Swal.fire({
      title: "Remove this service?",
      text: "This will delete the service from the menu.",
      icon: "warning",
      showCancelButton: true,
      confirmButtonText: "Yes, remove it",
    }).then((res) => {
      if (res.isConfirmed) {
        const updatedPackages = packages.filter((id) => id !== idToRemove);

        dispatch(
          UPDATE({
            token,
            data: {
              description: menuDescription,
              abbreviation: menuAbbreviation,
              branchId: activePlatform?.branchId,
              packages: updatedPackages,
              _id: menuId,
            },
          })
        );

        if (searchKey) {
          setActiveId(-1);
          resetSearch();
        }
      }
    });
  };
  console.log("services", services);
  return (
    <>
      <div className="d-flex justify-content-between align-items-center mb-2">
        <h6 className="mb-0">Services Tag/s</h6>
        <MDBBtn size="sm" color="primary" onClick={toggleModal}>
          <i className="fas fa-plus mr-1" /> Add
        </MDBBtn>
      </div>

      <MDBTable bordered responsive small>
        <MDBTableHead>
          <tr>
            <th>Description</th>
            <th>Department</th>
            <th>Template</th>
            <th>Preference</th>
            <th>Preparation</th>
            <th className="text-center">Actions</th>
          </tr>
        </MDBTableHead>
        <MDBTableBody>
          {services?.length ? (
            services.map((service, idx) => {
              const {
                id,
                name,
                abbreviation,
                department,
                template,
                preference,
                preparation,
              } = service;

              const matchedTemplate = Templates.collections?.find(
                (tpl) => tpl.department === department
              );
              const templateLabel =
                matchedTemplate?.components?.[template] || "N/A";

              return (
                <tr key={`service-${idx}`}>
                  <td>
                    <p className="fw-bold mb-1">{capitalize(name)}</p>
                    <p className="mb-0">{abbreviation?.toUpperCase()}</p>
                  </td>
                  <td>{capitalize(department)}</td>
                  <td>{templateLabel}</td>
                  <td>{preference || "—"}</td>
                  <td>{preparation || "—"}</td>
                  <td className="text-center">
                    <MDBBtn
                      size="sm"
                      color="danger"
                      className="m-0"
                      onClick={() => handleDestroyOne(id)}
                    >
                      <i className="fas fa-trash-alt" />
                    </MDBBtn>
                  </td>
                </tr>
              );
            })
          ) : (
            <tr>
              <td colSpan="6" className="text-center text-muted">
                No services tagged.
              </td>
            </tr>
          )}
        </MDBTableBody>
      </MDBTable>

      <Modal show={showModal} toggle={toggleModal} handlePick={handlePick} />
    </>
  );
}
