import React, { useEffect, useState } from "react";
import {
  MDBCol,
  MDBCard,
  MDBCardBody,
  MDBAvatar,
  MDBProgress,
  MDBBtnGroup,
} from "mdbreact";
import { useDispatch, useSelector } from "react-redux";
import {
  PresetImage,
  isJpegOrJpgFile,
} from "../../../../../../../../../../services/utilities";
import { useToasts } from "react-toast-notifications";
import {
  IMAGE,
  UPLOAD,
} from "../../../../../../../../../../services/redux/slices/assets/persons/auth";
import ImageCropper from "../../../../../../../../../../components/imageCropper";

export default function ProfileImage({ task, setTask }) {
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
    <MDBCol lg="3" className="mb-4">
      <MDBCard>
        <MDBCardBody className="text-center">
          <MDBAvatar
            style={{
              height: "200px",
              width: "200px",
              objectFit: "cover", // Ensure the image is square and covers the entire area
            }}
            tag="img"
            src={task.image}
            onError={(e) => (e.target.src = PresetImage(task.patient.isMale))}
            alt={`preview-${task.patient._id}`}
            className="z-depth-1 mb-3 mx-auto"
          />

          <img
            src={task.image}
            alt={`preview-${task.patient._id}`}
            onError={(e) =>
              e.target.src ? e.target.src : PresetImage(task.patient.isMale)
            }
          />

          {progressBar >= 0 && <MDBProgress value={progressBar} animated />}
          <p className="text-muted">
            <small>
              {progressBar > -1
                ? "Please wait while we update your profile photo"
                : "Profile photo will be changed automatically"}
            </small>
          </p>
          <MDBBtnGroup>
            <ImageCropper accept="image/jpeg, image/jpg" />
            <label
              htmlFor="changeImage"
              className="btn btn-info btn-sm btn-rounded"
            >
              Upload
            </label>
          </MDBBtnGroup>
          <input
            id="changeImage"
            onChange={handleImageChange}
            type="file"
            className="d-none"
            accept="image/jpeg, image/jpg"
          />
        </MDBCardBody>
      </MDBCard>
    </MDBCol>
  );
}
