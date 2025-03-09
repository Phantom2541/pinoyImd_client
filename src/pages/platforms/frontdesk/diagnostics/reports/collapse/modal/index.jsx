import React, { useEffect, useState } from "react";
import {
  MDBModal,
  MDBModalBody,
  MDBModalHeader,
  MDBAlert,
  MDBBtn,
  MDBBtnGroup,
} from "mdbreact";
import Patient from "./patient";
import { formColor } from "../../../../../../../services/utilities";
import BodySwitcher from "./bodySwitcher";
import { useDispatch, useSelector } from "react-redux";
import { LABRESULT } from "../../../../../../../services/redux/slices/commerce/pos/services/deals";
import Swal from "sweetalert2";

export default function Modal({ show, toggle, task, setTask }) {
  const { token, auth } = useSelector(({ auth }) => auth),
    { collections } = useSelector(({ heads }) => heads),
    [rerender, setRerender] = useState(true), //handle rendering for healthy client injection
    dispatch = useDispatch();

  const {
    patient,
    form,
    remarks,
    generateHealthyClient,
    hasDone: dbDone,
  } = task;

  useEffect(() => {
    if (!rerender) {
      setTimeout(() => setRerender(true), 1);
    }
  }, [rerender]);

  const computeHemaDiff = (hasDone) => {
    const { dc = {}, packages } = task;

    const total = Object.values(dc).reduce(
      (total, value) => (total += value),
      0
    );

    if (total !== 100 && packages.includes(58))
      return Swal.fire({
        icon: "warning",
        title: "Invalid Diff Count",
        text: `Your total Diff Count is ${total}.`,
        footer: "<i class='text-info'>Diff Count must always equal to 100</i>",
      });

    handleSave(hasDone);
  };

  const handleSave = (hasDone) => {
    const { form, department } = task;

    //returns id
    const findSignatoryId = (indentifier) =>
      collections.find(({ section }) => section === indentifier)?.user?._id;

    const head = findSignatoryId(form.toLowerCase()),
      // kulang pa to
      //patholist or radiologist
      sub = findSignatoryId(
        department === "LAB" ? "pathologist" : "radiologist"
      );

    // //console.log({
    //   ...task,
    //   //if meant to save, just copy current state in db
    //   hasDone: hasDone || dbDone,
    //   signatories: [head, sub, auth._id],
    // });

    dispatch(
      LABRESULT({
        token,
        data: {
          ...task,
          //if meant to save, just copy current state in db
          hasDone: hasDone || dbDone,
          signatories: [head, sub, auth._id],
        },
      })
    );
    toggle();
  };

  // remove if no error has occured
  // const handleSubmit = () =>
  //   Swal.fire({
  //     title: "Everything complete?",
  //     text: `You can post if its completed.`,
  //     icon: "question",
  //     confirmButtonText: "Post",
  //     confirmButtonColor: "#28a745",
  //     showDenyButton: true,
  //     denyButtonText: "Save",
  //     denyButtonColor: "#007bff",
  //   }).then(({ isConfirmed, isDenied }) => {
  //     if (isConfirmed) {
  //     } else if (isDenied) {
  //       if (task.form === "Hematology") return computeHemaDiff(false);

  //       handleSave(false);
  //     }
  //   });

  const generateHealthyStats = () => {
    setRerender(false);
    if (form === "Urinalysis")
      return setTask({
        ...task,
        pe: [2, 0, 1, 1],
        ce: [0, 0, 0, 0, 0, 0, 0, 0],
        me: [1, 0, 0, 0, 0, 0],
      });

    // Parasitology
    setTask({
      ...task,
      pe: [0, 0],
      me: [0, 0, 0],
      remarks: "NO OVA OR INTESTINAL PARASITE SEEN",
    });
  };

  return (
    <MDBModal size="lg" isOpen={show} toggle={toggle} backdrop>
      <MDBModalHeader
        toggle={toggle}
        className="light-blue darken-3 white-text"
      >
        <Patient patient={patient} />
      </MDBModalHeader>
      <MDBModalBody className="mb-0 text-center">
        <MDBAlert color={formColor(form)} className="text-uppercase fw-bold">
          <h5 style={{ letterSpacing: "30px" }} className="mb-0">
            {form}
          </h5>
        </MDBAlert>
        {console.log("task", task)}
        {rerender && <BodySwitcher task={task} setTask={setTask} />}
        <div className="text-center mb-1-half border-top pt-2">
          <textarea
            placeholder="Remarks"
            value={remarks}
            onChange={(e) => setTask({ ...task, remarks: e.target.value })}
            className="w-100"
          />
          <div className="d-flex justify-content-between my-2">
            <MDBBtn
              className={`${!generateHealthyClient && "invisible"}`}
              onClick={generateHealthyStats}
              color="success"
            >
              Healthy client
            </MDBBtn>
            <MDBBtnGroup>
              <MDBBtn
                onClick={() => {
                  if (task.form === "Hematology") return computeHemaDiff(true);

                  handleSave(true);
                }}
                color="success"
              >
                post
              </MDBBtn>
              <MDBBtn
                onClick={() => {
                  if (task.form === "Hematology") return computeHemaDiff(false);

                  handleSave(false);
                }}
                color="info"
              >
                save
              </MDBBtn>
            </MDBBtnGroup>
          </div>
        </div>
      </MDBModalBody>
    </MDBModal>
  );
}
