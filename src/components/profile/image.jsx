import React, { useEffect, useState } from "react";
import {
  MDBCol,
  MDBCard,
  MDBView,
  MDBCardBody,
  MDBAvatar,
  MDBProgress,
  MDBBtnGroup,
} from "mdbreact";
import { useDispatch, useSelector } from "react-redux";
import { PresetImage, isJpegOrJpgFile } from "../../services/utilities";
import { useToasts } from "react-toast-notifications";
import { IMAGE, UPLOAD } from "../../services/redux/slices/assets/persons/auth";
import ImageCropper from "../imageCropper";

export default function ProfileImage() {
  const [file, setFile] = useState(null),
    { auth, token, progressBar, image } = useSelector(({ auth }) => auth),
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

  const handleError = message =>
    addToast(message, {
      appearance: "warning",
    });

  const handleImageChange = e => {
    const file = e.target.files[0];

    if (!isJpegOrJpgFile(file))
      return handleError("Please select a JPG image.");

    const reader = new FileReader();

    reader.onload = e => {
      const img = new Image();
      img.src = e.target.result;

      img.onload = function () {
        if (this.width !== this.height)
          return handleError("Image must be square.");

        setFile(file);

        dispatch(
          UPLOAD({
            data: {
              path: `${auth.email}`,
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

  const handleUpload = base64 => {
    const byteString = atob(base64.split(",")[1]);
    const ab = new ArrayBuffer(byteString.length);
    const ia = new Uint8Array(ab);
    for (let i = 0; i < byteString.length; i++) {
      ia[i] = byteString.charCodeAt(i);
    }
    const newBlob = new Blob([ab], { type: "image/jpeg" });
    setFile(newBlob);
    dispatch(
      UPLOAD({
        data: {
          path: `${auth.email}`,
          base64: base64.split(",")[1],
          name: "profile.jpg",
        },
        token,
      })
    );
  };

  return (
    <MDBCol lg="3" className="mb-4">
      <MDBCard narrow>
        <MDBView cascade className="mdb-color lighten-3 card-header">
          <h5 className="mb-0 font-weight-bold text-center text-white">
            Edit Photo
          </h5>
        </MDBView>
        <MDBCardBody className="text-center">
          <MDBAvatar
            style={{
              height: "100px",
            }}
            tag="img"
            src={image}
            onError={e => (e.target.src = PresetImage(auth.isMale))}
            alt={`preview-${auth._id}`}
            className="z-depth-1 mb-3 mx-auto rounded"
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
            <ImageCropper
              accept="image/jpeg, image/jpg"
              handleUpload={handleUpload}
              isUpload={true}
            />
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
