// File: staffs/collapse/index.jsx
import React, { useState, useEffect } from "react";
import { useSelector, useDispatch } from "react-redux";
import CollapsableBody from "./body";
import { MDBCollapse, MDBCardBody, MDBBtn, MDBRow } from "mdbreact";
import { collapse, properFullname } from "../../../../../../services/utilities";
import { Policy } from "../../../../../../services/fakeDb";
import {
  DESTROY,
  SET_COLLECTIONS,
  UPDATE,
} from "../../../../../../services/redux/slices/assets/persons/physicians";
import Swal from "sweetalert2";

export default function CollapsableIndex() {
  const { filtered, activePage, maxPage, isSuccess, closeModal } = useSelector(
      ({ physicians }) => physicians
    ),
    { filtered: collection } = useSelector(({ applicants }) => applicants);
  const { token } = useSelector(({ auth }) => auth);

  const itemsPerPage = maxPage;
  const startIndex = (activePage - 1) * itemsPerPage;
  const endIndex = startIndex + itemsPerPage;
  const paginatedData = filtered.slice(startIndex, endIndex);

  const [activeId, setActiveId] = useState(-1);
  const [didHoverId] = useState(-1);

  const dispatch = useDispatch(),
    [tieups, setTieups] = useState([]);

  const finalcollection = collection.filter(
    (item) => item.status !== "pending" && item.status !== "banned"
  );

  //Set fetched data for mapping
  useEffect(() => {
    setTieups(filtered);
  }, [filtered, isSuccess, closeModal]);

  const renderStatusBadge = (status) => {
    let className = "badge";
    switch (status?.toLowerCase()) {
      case "active":
        className += " badge-success";
        break;
      case "on leave":
        className += " badge-warning";
        break;
      case "inactive":
        className += " badge-secondary";
        break;
      default:
        className += " badge-light";
    }
    return <span className={className}>{status}</span>;
  };

  const handleDelete = (item) => {
    Swal.fire({
      title: `Are you sure to remove  ${String(
        properFullname(item?.user?.fullName, true)
      ).toUpperCase()}?`,
      text: "You won't be able to revert this!",
      icon: "warning",
      showCancelButton: true,
      confirmButtonColor: "#3085d6",
      cancelButtonColor: "#d33",
      confirmButtonText: "Yes, delete it!",
    }).then((result) => {
      if (result.isConfirmed) {
        dispatch(DESTROY({ token, data: { id: item._id } })).then(() => {
          const updated = tieups.filter((i) => i._id !== item._id);

          // ✅ update local component state
          // setTieups(updated);

          // ✅ update Redux store using the action creator
          dispatch(SET_COLLECTIONS({ tieups: updated }));
        });
      }
    });
  };

  const handleAssign = (_id) => {
    Swal.fire({
      title: "Assign Patient Care Associate",
      input: "select",
      inputOptions: finalcollection.reduce((opts, sec) => {
        opts[sec._id] = properFullname(sec.user.fullName); // label
        return opts;
      }, {}),
      inputPlaceholder: "-- Select PCA --",
      showCancelButton: true,
      confirmButtonText: "Next",
    }).then(({ isConfirmed, value }) => {
      if (isConfirmed && value) {
        const selectedSec = finalcollection.find((sec) => sec._id === value);

        Swal.fire({
          title: `Assign ${properFullname(
            selectedSec.user.fullName
          )} as a Patient Care Associate?`,
          icon: "question",
          showCancelButton: true,
          confirmButtonColor: "#3085d6",
          cancelButtonColor: "#d33",
          confirmButtonText: "Yes, assign",
        }).then(({ isConfirmed }) => {
          if (isConfirmed) {
            dispatch(
              UPDATE({
                token,
                data: {
                  id: _id,
                  secretary: value,
                },
              })
            ).then(({ payload: physician }) => {
              const updated = [
                ...tieups.filter((p) => p._id !== physician._id), // replace the old
                physician, // add new
              ];
              dispatch(SET_COLLECTIONS({ tieups: updated }));
            });
          }
        });
      }
    });
  };

  return (
    <div className="table-responsive">
      <table className="table table-bordered table-hover">
        <thead className="light-blue">
          <tr>
            <th>Name</th>
            <th>Specialization</th>
            <th>Department</th>
            <th>Position</th>
            <th>Status</th>
            <th>Actions</th>
          </tr>
        </thead>
        <tbody>
          {paginatedData?.map((item, index) => {
            const {
              user,
              ghostName,
              specialization,
              position,
              clinic,
              status,
              _id,
              secretary,
            } = item;
            const actualIndex = startIndex + index;
            const { color } = collapse.getStyle(
              actualIndex,
              activeId,
              didHoverId
            );
            const isActive = activeId === actualIndex;
            const textClass = isActive
              ? "font-weight-bold text-dark"
              : "text-dark";

            return (
              <React.Fragment key={`item-${actualIndex}`}>
                <tr className={color}>
                  <td className={textClass}>
                    {user
                      ? properFullname(user.fullName)
                      : properFullname(ghostName)}
                  </td>
                  <td className={textClass}>{specialization}</td>
                  <td style={{ color: "black" }}>
                    {position?.employment &&
                      Policy.getDepartment(position?.employment?.designation)}
                  </td>
                  <td style={{ color: "black" }}>
                    {renderStatusBadge(clinic && clinic?.status)}
                  </td>
                  <td style={{ color: "black" }}>
                    {renderStatusBadge(status)}
                  </td>
                  <td>
                    <button
                      onClick={() =>
                        setActiveId((prev) =>
                          actualIndex === prev ? -1 : actualIndex
                        )
                      }
                      className="btn btn-link p-0"
                    >
                      PCA{" "}
                      <i
                        className="fa fa-angle-left"
                        style={{
                          transform: `rotate(${
                            activeId === actualIndex ? "-90deg" : "0deg"
                          })`,
                          transition: "transform 0.3s ease",
                          marginLeft: "5px",
                        }}
                      />
                    </button>

                    <MDBBtn
                      color="danger"
                      size="sm"
                      onClick={() => handleDelete(item)}
                    >
                      Untag
                    </MDBBtn>
                  </td>
                </tr>

                <tr>
                  <td colSpan="6" className="p-0 m-0">
                    <MDBCollapse isOpen={activeId === actualIndex}>
                      <MDBCardBody className="m-0 p-3">
                        <MDBRow className="d-flex align-items-center justify-content-between m-2">
                          <h6 className="mb-0">Patient Care Associate</h6>

                          <MDBBtn
                            color="primary"
                            size="sm"
                            rounded
                            onClick={() => handleAssign(_id)}
                          >
                            Tag Secretary
                          </MDBBtn>
                        </MDBRow>

                        <CollapsableBody secretary={secretary} />
                      </MDBCardBody>
                    </MDBCollapse>
                  </td>
                </tr>
              </React.Fragment>
            );
          })}
        </tbody>
      </table>
    </div>
  );
}
