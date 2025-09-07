import {
  // MDBCol,
  MDBCard,
  MDBView,
  MDBCardBody,
  MDBAvatar,
  MDBProgress,
  MDBBtnGroup,
} from "mdbreact";
import { useDispatch, useSelector } from "react-redux";
import { Cloudinary } from "../../services/utilities";
import { useToasts } from "react-toast-notifications";
import {
  IMAGE,
  UPDATE_INFO,
  UPLOAD,
} from "../../services/redux/slices/assets/persons/auth";
import { ImageCropper } from "../images";
import ImageDragAndDrop from "../images/dragAndDrop/dragNdroping";

export default function SignatureImage() {
  const { auth, token, progressBar, image, isSuccess, formSubmitted } =
      useSelector(({ auth }) => auth),
    dispatch = useDispatch(),
    { addToast } = useToasts();
  console.log("auth", auth);

  const handleError = (message) =>
    addToast(message, {
      appearance: "warning",
    });

  const handleImageChange = (e) => {
    const file = e.target.files[0];

    if (!file) return;

    const reader = new FileReader();

    reader.onload = (e) => {
      const img = new Image();
      img.src = e.target.result;

      img.onload = function () {
        if (this.width !== this.height)
          return handleError("Image must be square.");
        const src = e.target.result;
        const formData = Cloudinary.buildFileForm(
          src,
          `users/${auth.email}`,
          "signature"
        );
        dispatch(
          UPLOAD({
            data: formData,
            token,
          })
        ).then((action) => {
          const freshUrl = `${action.payload.url}?v=${Date.now()}`;
          dispatch(IMAGE(freshUrl));
        });
      };
    };

    reader.readAsDataURL(file);
  };

  const handleUpload = (img) => {
    const formData = Cloudinary.buildFileForm(
      img,
      `users/${auth.email}`,
      "signature"
    );
    dispatch(
      UPLOAD({
        data: formData,
        token,
      })
    );
  };

  return (
    // <MDBCol lg="3" className="mb-4">
    <MDBCard narrow>
      <MDBView cascade className="mdb-color lighten-3 card-header">
        <h5 className="mb-0 font-weight-bold text-center text-white">
          Edit Signature
        </h5>
      </MDBView>
      <MDBCardBody className="text-center">
        {/* <ImageDragAndDrop
          img={`${Cloudinary.getEndpoint()}/${auth.pid}/users/${
            auth.email
          }/sinature.png`}
          handleUpload={(cropImg) =>
            handleUploadSignature(cropImg, auth.email, auth._Id)
          }
          formSubmitted={formSubmitted}
          allowedType="jpg"
        /> */}
        {/* <MDBAvatar
          style={{
            height: "100px",
          }}
          tag="img"
          src={image}
          onError={(e) => (e.target.src = PresetImage(auth.isMale))}
          alt={`preview-${auth._id}`}
          className="z-depth-1 mb-3 mx-auto rounded"
        /> */}

        {progressBar >= 0 && <MDBProgress value={progressBar} animated />}
        <p className="text-muted">
          <small>
            {progressBar > -1
              ? "Please wait while we update your Signature photo"
              : "Signature photo will be changed automatically"}
          </small>
        </p>

        <MDBBtnGroup>
          <ImageCropper
            cropSize={{ width: 200, height: 100 }}
            accept="image/jpg, image/png, image/jpeg"
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
          accept="image/jpg, image/png"
        />
      </MDBCardBody>
    </MDBCard>
    // </MDBCol>
  );
}
