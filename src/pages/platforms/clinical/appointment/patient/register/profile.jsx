import {
  // MDBCol,
  MDBCard,
  MDBView,
  MDBCardBody,
  MDBAvatar,
  MDBProgress,
  MDBBtnGroup,
} from "mdbreact";
import { useSelector } from "react-redux";
import { PresetImage } from "../../../../../../services/utilities";
import { useToasts } from "react-toast-notifications";

import { ImageCropper } from "../../../../../../components/images";

export default function Profile({ form, setForm = () => {} }) {
  const { auth, token } = useSelector(({ auth }) => auth),
    { addToast } = useToasts();

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
        setForm({
          ...form,
          patient: { ...form?.patient, image: src },
        });
      };
    };

    reader.readAsDataURL(file);
  };

  const handleUpload = (img) => {
    setForm({
      ...form,
      patient: { ...form?.patient, image: img },
    });
  };
  return (
    <div className="d-flex justify-content-center">
      <MDBCard narrow style={{ width: "300px" }}>
        <MDBView cascade className="mdb-color lighten-3 py-2 ">
          <h6
            className="mb-0 text-center text-white"
            style={{ fontWeight: 500 }}
          >
            Profile Picture
          </h6>
        </MDBView>
        <MDBCardBody className="text-center">
          <MDBAvatar
            style={{
              height: "100px",
            }}
            tag="img"
            src={form?.patient?.image || ""}
            onError={(e) => (e.target.src = PresetImage(form?.patient?.isMale))}
            alt={`preview-${auth._id}`}
            className="z-depth-1  mx-auto rounded mt-n2"
          />

          <MDBBtnGroup className="mb-n4 mt ">
            <ImageCropper
              accept="image/jpg, image/png, image/jpeg"
              handleUpload={handleUpload}
              isUpload={true}
              isStatic={true}
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
    </div>
  );
}
