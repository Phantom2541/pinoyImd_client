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
      dr = findPhysicianId(task.signatories[1]._id);
    }
    // console.log("dr", dr);

    const data = ["xray", "ultrasound", "miscellaneous"].includes(form)
      ? (() => {
          const { _id, ...rest } = task;
          return {
            ...rest,
            hasDone,
            department,
            signatories: [head, dr, auth._id],
          };
        })()
      : {
          ...task,
          hasDone,
          department,
          signatories: [head, dr, auth._id],
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
