import React, { useEffect, useState, useRef } from "react";
// import {
//   MDBCol,
//   MDBCard,
//   MDBCardBody,
//   MDBAvatar,
//   MDBProgress,
//   MDBBtnGroup,
// } from "mdbreact";
import { useDispatch, useSelector } from "react-redux";
import { isJpegOrJpgFile } from "./../../../../../../../../../services/utilities";
import { useToasts } from "react-toast-notifications";
import {
  IMAGE,
  UPLOAD,
} from "./../../../../../../../../../services/redux/slices/assets/persons/auth";
// import ImageCropper from "../../../../../../../../../components/images/imageCropper";
import FINGERPRINT from "./../../../../../../../../../assets/fingerPrint.png";

export default function FingerPrint({ task, setTask }) {
  const [file, setFile] = useState(null),
    { token, progressBar } = useSelector(({ auth }) => auth),
    dispatch = useDispatch(),
    { addToast } = useToasts();

  useEffect(() => {
    if (file && progressBar === 100) {
      dispatch(IMAGE(URL.createObjectURL(file)));
      setFile(null);
      addToast("Image Updated Successfully.", {
        appearance: "success",
      });
    }
  }, [progressBar, file, dispatch, addToast]);

  const handleError = (message) =>
    addToast(message, {
      appearance: "warning",
    });

  const handleImageChange = (e) => {
    const file = e.target.files[0];

    if (!isJpegOrJpgFile(file))
      return handleError("Please select a JPG image.");

    const reader = new FileReader();

    reader.onload = (e) => {
      const img = new Image();
      img.src = e.target.result;

      img.onload = function () {
        if (this.width !== this.height)
          return handleError("Image must be square.");
        setFile(file);
        setTask({ ...task, image: "profile.jpg" });
        dispatch(
          UPLOAD({
            data: {
              path: `${task.patient.email}`,
              base64: reader.result.split(",")[1],
              name: "profile.jpg",
            },
            token,
          })
        );
      };
    };

    reader.readAsDataURL(file);
  };
  //console.log("task", task);

  return (
    <div
      className="d-flex justify-content-center flex-column"
      style={{ gap: "10px" }}
    >
      <div className="d-flex justify-content-center" style={{ gap: "10px" }}>
        <img
          src={FINGERPRINT}
          alt=""
          width="100"
          height="100"
          style={{
            objectFit: "cover",
          }}
        />
        <img
          src={FINGERPRINT}
          alt=""
          width="100"
          height="100"
          style={{ objectFit: "cover" }}
        />
        <img
          src={FINGERPRINT}
          alt=""
          width="100"
          height="100"
          style={{ objectFit: "cover" }}
        />
        <img
          src={FINGERPRINT}
          alt=""
          width="100"
          height="100"
          style={{ objectFit: "cover" }}
        />
        <img
          src={FINGERPRINT}
          alt=""
          width="100"
          height="100"
          style={{ objectFit: "cover" }}
        />
      </div>
      <div className="d-flex justify-content-center" style={{ gap: "10px" }}>
        <img
          src={FINGERPRINT}
          alt=""
          width="100"
          height="100"
          style={{
            objectFit: "cover",
          }}
        />
        <img
          src={FINGERPRINT}
          alt=""
          width="100"
          height="100"
          style={{ objectFit: "cover" }}
        />
        <img
          src={FINGERPRINT}
          alt=""
          width="100"
          height="100"
          style={{ objectFit: "cover" }}
        />
        <img
          src={FINGERPRINT}
          alt=""
          width="100"
          height="100"
          style={{ objectFit: "cover" }}
        />
        <img
          src={FINGERPRINT}
          alt=""
          width="100"
          height="100"
          style={{ objectFit: "cover" }}
        />
      </div>
    </div>
  );
}
