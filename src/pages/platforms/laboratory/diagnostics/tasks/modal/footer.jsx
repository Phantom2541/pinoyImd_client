import React, { useEffect, useState } from "react";
import { useDispatch, useSelector } from "react-redux";
import { MDBBtn, MDBBtnGroup } from "mdbreact";
import { LABRESULT } from "./../../../../../../services/redux/slices/commerce/pos/services/deals";
import Swal from "sweetalert2";
import {
  SetTASK,
  SetMODAL,
  SetHEALTHY,
  SetVALIDATOR,
} from "./../../../../../../services/redux/slices/diagnostics/laboratory/validator";

const Footer = () => {
  const { token, auth, activePlatform } = useSelector(({ auth }) => auth);
  const { success, task, heads } = useSelector(({ validator }) => validator);
  const [isLoading, setIsLoading] = useState(false);
  const { collections: physicians } = useSelector(
    ({ physicians }) => physicians
  );
  const dispatch = useDispatch();
  const department = activePlatform?.department;
  useEffect(() => {
    if (success) {
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

  const findPhysicianId = (_user) =>
    console.log(
      "physicians",
      physicians.find(({ user }) => user === _user)
    );

  const missingSignatoriesChecker = (head, dr) => {
    const { form } = task;

    if (!head || !dr) {
      let message = "";

      if (!head && !dr) {
        message = `
      <span style="font-size:16px;">⚠️ <strong style="color:#d9534f;">No Medical Laboratory Scientist 👩‍⚕️ and Pathologist 🧑‍⚕️ have been assigned</strong> for the <em>${form}</em> section.</span><br><br>
      <span style="color:#555;">🧾 <strong>Results have been saved</strong>, but you need to <strong>declare both signatories in the Signatories section</strong> before printing.</span><br><br>
      <span style="color:#555;">🔹 Once assigned in Signatories, return to this patient and click the <strong style="color:#3085d6;">Post</strong> button again to print.</span>
      `;
      } else if (!head) {
        message = `
      <span style="font-size:16px;">⚠️ <strong style="color:#d9534f;">No Medical Laboratory Scientist 👩‍⚕️ has been assigned</strong> for the <em>${form}</em> section.</span><br><br>
      <span style="color:#555;">🧾 <strong>Results have been saved</strong>, but you need to <strong>declare a Medical Laboratory Scientist in the Signatories section</strong> before printing.</span><br><br>
      <span style="color:#555;">🔹 Once assigned in Signatories, return to this patient and click the <strong style="color:#3085d6;">Post</strong> button again to print.</span>
      `;
      } else if (!dr) {
        message = `
      <span style="font-size:16px;">⚠️ <strong style="color:#d9534f;">No Pathologist 🧑‍⚕️ has been assigned</strong> for the <em>${form}</em> section.</span><br><br>
      <span style="color:#555;">🧾 <strong>Results have been saved</strong>, but you need to <strong>declare a Pathologist in the Signatories section</strong> before printing.</span><br><br>
      <span style="color:#555;">🔹 Once assigned in Signatories, return to this patient and click the <strong style="color:#3085d6;">Post</strong> button again to print.</span>
      `;
      }

      return Swal.fire({
        icon: "warning",
        title: `<span style="color:#d9534f; font-family:'Segoe UI', sans-serif; font-weight:600;">Incomplete Signatories</span>`,
        html: `<div style="text-align:left; line-height:1.6; font-size:15px; font-family:'Segoe UI', sans-serif; color:#333;">${message}</div>`,
        confirmButtonText: "OK",
        confirmButtonColor: "#3085d6",
        background: "#ffffff",
        iconColor: "#f0ad4e",
        width: 480,
        padding: "1.75rem",
        showCloseButton: true,
      });
    }
  };

  const handleSave = (hasDone) => {
    const { form } = task;

    // if laboratory =pathogist
    // if radiologist  and xray = radiologist
    // if radiologist  and ultrasound = sonographer
    // if radiologist  and ecg   = cardiologist

    const head = findSignatoryId(form.toLowerCase());
    let dr;
    if (form !== "Ecg") {
      dr = findSignatoryId(
        department === "Laboratory" ? "pathologist" : "radiologist"
      );
    } else {
      dr = findPhysicianId(task.signatories[1]?._id);
    }

    const data = ["xray", "ultrasound", "miscellaneous"].includes(form)
      ? (() => {
          const { _id, ...rest } = task;
          return {
            ...rest,
            hasDone,
            department,
            signatories: [head || null, dr || null, auth._id || null],
          };
        })()
      : {
          ...task,
          hasDone,
          department,
          signatories: [head || null, dr || null, auth._id || null],
        };
    setIsLoading(true);

    dispatch(
      LABRESULT({
        token,
        data,
      })
    ).then(({ payload }) => {
      setIsLoading(false);
      dispatch(SetVALIDATOR(payload?.item || payload?.payload));
      dispatch(SetMODAL(false));
      missingSignatoriesChecker(head, dr);
    });
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
              disabled={isLoading}
              id="task-post-btn"
              onClick={() => {
                if (task?.form === "Hematology") return computeHemaDiff(true);
                handleSave(true);
              }}
              color="success"
            >
              Post
            </MDBBtn>
            <MDBBtn
              disabled={isLoading}
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
