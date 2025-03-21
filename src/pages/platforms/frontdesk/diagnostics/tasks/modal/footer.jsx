import React, {  useEffect } from "react";
import { useDispatch, useSelector } from "react-redux";
import { MDBBtn, MDBBtnGroup } from "mdbreact";
import { LABRESULT } from "./../../../../../../services/redux/slices/commerce/pos/services/deals";
import Swal from "sweetalert2";
import {
  SetTASK,
  SetMODAL,
  SetHEALTHY,
} from "./../../../../../../services/redux/slices/diagnostics/laboratory/validator.js";

const Footer = () => {
  const { token, auth } = useSelector(({ auth }) => auth),
   { success, task, heads } = useSelector((validator) => validator),
   dispatch = useDispatch();

  useEffect(() => {
    if (success) {
      dispatch(SetMODAL(false));
      dispatch(SetHEALTHY(false));
    }
  }, [success, dispatch]);
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
    // const { form, department } = task;
    console.log("tasks", task);
    
    // //returns id
    // const findSignatoryId = (indentifier) =>
    //     heads.find(({ section }) => section === indentifier)?.user?._id;

    // const head = findSignatoryId(form.toLowerCase()),
    //   // kulang pa to
    //   //patholist or radiologist
    //   sub = findSignatoryId(
    //     department === "LAB" ? "pathologist" : "radiologist"
    //   );

    // /**
    //  * Automatic generate URL.
    //  */
    // dispatch(
    //   LABRESULT({
    //     token,
    //     data: {
    //       ...task,
    //       //if meant to save, just copy current state in db
    //       hasDone: true,
    //       signatories: [head, sub, auth._id],
    //     },
    //   })
    // );
    // dispatch(SetMODAL(false));
  };
  const generateHealthyStats = () => {
    /**
     * render time too long
     */

    if (task?.form === "Urinalysis") dispatch(SetHEALTHY("urinalysis"));
    else if (task?.form === "Parasitology") dispatch(SetHEALTHY("parasitology"));
  };

  return (
    <div className="text-center mb-1-half border-top pt-2">
    <textarea
      placeholder="Remarks"
      value={task?.remarks}
      onChange={(e) =>
        dispatch(SetTASK({task:{ ...task, remarks: e.target.value }}))
      }
      className="w-100"
    />
    <div className="d-flex justify-content-between my-2">
      <MDBBtn
        className={`${!generateHealthyStats && "invisible"}`}
        onClick={generateHealthyStats}
        color="success"
      >
        Healthy client
      </MDBBtn>
      <MDBBtnGroup>
        <MDBBtn
          onClick={() => {
            if (task?.form === "Hematology") return computeHemaDiff(true);

            handleSave(true);
          }}
          color="success"
        >
          post
        </MDBBtn>
        <MDBBtn
          onClick={() => {
            if (task?.form === "Hematology") return computeHemaDiff(false);

            handleSave(false);
          }}
          color="info"
        >
          save
        </MDBBtn>
      </MDBBtnGroup>
    </div>
  </div>
  );
};

export default Footer;
