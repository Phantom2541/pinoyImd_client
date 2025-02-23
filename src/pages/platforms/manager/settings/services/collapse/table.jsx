import React, { useState, useEffect } from "react";
import { MDBBtn, MDBIcon, MDBTable, MDBBtnGroup } from "mdbreact";
import { useDispatch, useSelector } from "react-redux";
import { capitalize } from "../../../../../../services/utilities";
import { References } from "../../../../../../services/fakeDb";
import Modal from "./modal";
import Swal from "sweetalert2";
import { DESTROY } from "../../../../../../services/redux/slices/results/preferences";

export default function CollapseTable({ id, preference }) {
  const [references, setReferences] = useState([]),
    [showButton, setShowButton] = useState(false),
    [showModal, setShowModal] = useState(false),
    [willCreate, setWillCreate] = useState(true),
    [selected, setSelected] = useState({}),
    { token } = useSelector(({ auth }) => auth),
    { collections } = useSelector(({ preferences }) => preferences),
    dispatch = useDispatch();

  const toggleModal = () => setShowModal(!showModal);

  const toggleRemove = (reference) => {
    //console.log("reference", reference);
    Swal.fire({
      title: "Are you sure?",
      text: "You won't be able to revert this!",
      icon: "warning",
      showCancelButton: true,
      confirmButtonColor: "#3085d6",
      cancelButtonColor: "#d33",
      confirmButtonText: "Yes, remove it!",
    }).then((result) => {
      if (result.isConfirmed) {
        dispatch(
          DESTROY({
            token,
            data: { _id: reference },
          })
        );
      }
    });
  };

  useEffect(() => {
    setReferences(collections.filter(({ serviceId }) => serviceId === id));
  }, [collections, id]);

  useEffect(() => {
    const max = {
      development: 9,
      gender: 2,
      equal: 1,
    };

    if (references.length === max[preference]) {
      setShowButton(false);
    } else {
      setShowButton(true);
    }
  }, [preference, references]);

  return (
    <>
      <MDBTable responsive hover className="text-center">
        <thead>
          <tr>
            {preference && preference !== "equal" && (
              <th rowSpan={2}>{capitalize(preference)}</th>
            )}
            <th colSpan={2}>Reference Value</th>
            <th rowSpan={2}>Units</th>
            <th colSpan={3}>Panic Value</th>
            {showButton && (
              <th>
                <MDBBtn
                  onClick={() => {
                    toggleModal();
                    setWillCreate(true);
                  }}
                  color="primary"
                  size="sm"
                  className="py-1 px-2 m-0"
                >
                  <MDBIcon icon="plus" />
                </MDBBtn>
              </th>
            )}
          </tr>
          <tr>
            <th>Minimum</th>
            <th>Maximum</th>
            <th>Mild</th>
            <th>Moderate</th>
            <th>Severe</th>
            <th>Action</th>
          </tr>
        </thead>
        <tbody>
          {references.map((reference, index) => {
            const {
              lo,
              hi,
              warn,
              alert,
              critical,
              units,
              isMale,
              development,
            } = reference;

            return (
              <tr key={`reference-${index}`}>
                {preference && preference !== "equal" && (
                  <td>
                    {preference === "gender"
                      ? isMale
                        ? "Male"
                        : "Female"
                      : References.preferences.development[development]}
                  </td>
                )}
                <td>{lo}</td>
                <td>{hi}</td>
                <td>{units}</td>
                <td>{warn}</td>
                <td>{alert}</td>
                <td>{critical}</td>
                <td>
                  <MDBBtnGroup>
                    <MDBBtn
                      onClick={() => {
                        toggleModal();
                        setWillCreate(false);
                        setSelected(reference);
                      }}
                      color="info"
                      size="sm"
                      className="py-1 px-2 m-0"
                    >
                      <MDBIcon icon="pencil-alt" />
                    </MDBBtn>
                    <MDBBtn
                      onClick={() => {
                        toggleRemove(reference._id);
                      }}
                      color="danger"
                      size="sm"
                      className="py-1 px-2 m-0"
                    >
                      <MDBIcon icon="trash" />
                    </MDBBtn>
                  </MDBBtnGroup>
                </td>
              </tr>
            );
          })}
        </tbody>
      </MDBTable>
      <Modal
        show={showModal}
        toggle={toggleModal}
        serviceId={id}
        preference={preference}
        references={references}
        willCreate={willCreate}
        selected={selected}
      />
    </>
  );
}
