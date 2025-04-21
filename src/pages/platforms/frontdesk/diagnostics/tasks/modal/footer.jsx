import React, { useEffect } from "react";
import { useDispatch, useSelector } from "react-redux";
import { MDBBtn, MDBBtnGroup } from "mdbreact";
import { LABRESULT } from "./../../../../../../services/redux/slices/commerce/pos/services/deals";
import Swal from "sweetalert2";
import {
  SetTASK,
  SetMODAL,
  SetHEALTHY,
} from "./../../../../../../services/redux/slices/diagnostics/laboratory/validator";

const Footer = () => {
  const { token, auth, activePlatform } = useSelector(({ auth }) => auth);
  const { success, task, heads } = useSelector(({ validator }) => validator);
  const dispatch = useDispatch();
  const department = activePlatform?.department;
  useEffect(() => {
    if (success) {
      dispatch(SetMODAL(false));
      dispatch(SetHEALTHY(false));
    }
  }, [success, dispatch]);

  const computeHemaDiff = (hasDone) => {
    const { dc = {}, packages } = task;
    const total = Object.values(dc).reduce((total, value) => total + value, 0);

    if (total !== 100 && packages.includes(58)) {
      return Swal.fire({
        icon: "warning",
        title: "Invalid Diff Count",
        text: `Your total Diff Count is ${total}.`,
        footer: "<i class='text-info'>Diff Count must always equal to 100</i>",
      });
    }

    handleSave(hasDone);
  };

  const findSignatoryId = (identifier) =>
    heads.find(
      ({ section }) => section.replace("-", "").toLowerCase() === identifier
    )?.user?._id;

  const handleSave = (hasDone) => {
    const { form } = task;

    const head = findSignatoryId(form.toLowerCase());
    const dr = findSignatoryId(
      department === "laboratory" ? "pathologist" : "radiologist"
    );

    dispatch(
      LABRESULT({
        token,
        data: {
          ...task,
          hasDone,
          department,
          signatories: [head, dr, auth._id],
        },
      })
    );
  };

  const generateHealthyStats = () => {
    if (task?.form === "Urinalysis") dispatch(SetHEALTHY("urinalysis"));
    else if (task?.form === "Parasitology")
      dispatch(SetHEALTHY("parasitology"));
  };

  return (
    <div className="text-center mb-1-half border-top pt-2">
      <textarea
        placeholder="Remarks"
        value={task?.remarks}
        onChange={(e) =>
          dispatch(
            SetTASK({
              form: task?.form,
              task: { ...task, remarks: e.target.value },
            })
          )
        }
        className="w-100"
      />

      {/* Button Layout */}
      <div className="d-flex justify-content-between align-items-center my-2">
        {/* Left: Healthy Client Button (if applicable) */}
        {(task.form === "Urinalysis" || task.form === "Parasitology") && (
          <MDBBtn onClick={generateHealthyStats} color="success">
            Healthy client
          </MDBBtn>
        )}

        {/* Right: Save & Post Buttons */}
        <div className="ml-auto">
          <MDBBtnGroup>
            <MDBBtn
              onClick={() => {
                if (task?.form === "Hematology") return computeHemaDiff(true);
                handleSave(true);
              }}
              color="success"
            >
              Post
            </MDBBtn>
            <MDBBtn
              onClick={() => {
                if (task?.form === "Hematology") return computeHemaDiff(false);
                handleSave(false);
              }}
              color="info"
            >
              Save
            </MDBBtn>
          </MDBBtnGroup>
        </div>
      </div>
    </div>
  );
};

export default Footer;
