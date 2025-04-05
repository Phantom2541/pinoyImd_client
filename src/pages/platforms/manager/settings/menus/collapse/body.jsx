import React, { useEffect, useState } from "react";
import { MDBTable, MDBTableHead, MDBTableBody, MDBBtn } from "mdbreact";
import { useDispatch, useSelector } from "react-redux";
import { capitalize, globalSearch } from "../../../../../../services/utilities";
import { Templates } from "../../../../../../services/fakeDb";
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
  const dispatch = useDispatch();

  useEffect(() => {
    setServices(packages || []);
  }, [packages]);

  const toggleModal = () => setShowModal((prev) => !prev);

  const handleSearch = (willSearch, key) => {
    if (willSearch) {
      setServices(globalSearch(packages, key));
    } else {
      setServices(packages || []);
    }
  };

  const handlePick = (selected) => {
    const combined = [...new Set([...selected, ...packages])];
    const ids = combined.map(({ id }) => id);

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

    toggleModal();
    if (searchKey) {
      setActiveId(-1);
      resetSearch();
    }
  };

  const handleDestroy = () => {
    Swal.fire({
      title: "Are you sure?",
      text: `This action is irreversible.`,
      icon: "warning",
      showCancelButton: true,
      confirmButtonText: "Yes, remove them",
    }).then((res) => {
      if (res.isConfirmed) {
        dispatch(
          UPDATE({
            token,
            data: {
              description: menuDescription,
              abbreviation: menuAbbreviation,
              branchId: activePlatform?.branchId,
              packages: [],
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

  return (
    <>
      <div className="d-flex justify-content-between align-items-center mb-2">
        <h6 className="mb-0">Services Tag/s</h6>
        <div>
          <MDBBtn size="sm" color="primary" onClick={toggleModal}>
            <i className="fas fa-plus mr-1" /> Add
          </MDBBtn>
          <MDBBtn size="sm" color="danger" onClick={handleDestroy}>
            <i className="fas fa-trash-alt mr-1" /> Remove All
          </MDBBtn>
        </div>
      </div>

      <MDBTable bordered responsive small>
        <MDBTableHead>
          <tr>
            <th>Description</th>
            <th>Department</th>
            <th>Template</th>
            <th>Preference</th>
            <th>Preparation</th>
          </tr>
        </MDBTableHead>
        <MDBTableBody>
          {services?.length ? (
            services.map((service, idx) => {
              const {
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
                </tr>
              );
            })
          ) : (
            <tr>
              <td colSpan="5" className="text-center text-muted">
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
