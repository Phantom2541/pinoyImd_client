import { useEffect, useState } from "react";
import { MDBBtn, MDBBtnGroup, MDBIcon, MDBMask, MDBView } from "mdbreact";
import { axioKit, Cloudinary } from "./../../../../../services/utilities";
import { useDispatch, useSelector } from "react-redux";
import {
  UPLOAD,
  RESET,
  SetCOMPANY,
} from "./../../../../../services/redux/slices/assets/persons/auth";
import { FailedLogo } from "./../../../../../services/utilities";
import ImageCropper from "../../../../../components/images/imageCropper";

export default function Logo() {
  const { company, token, isLoading } = useSelector(({ auth }) => auth);
  const dispatch = useDispatch();
  const [preview, setPreview] = useState("");
  const [showImgCropper, setShowImgCropper] = useState(false);

  useEffect(() => {
    setShowImgCropper(false);
    dispatch(RESET());
  }, [dispatch]);

  const handleUpload = (base64) => {
    const byteString = atob(base64.split(",")[1]);
    const ab = new ArrayBuffer(byteString.length);
    const ia = new Uint8Array(ab);
    for (let i = 0; i < byteString.length; i++) {
      ia[i] = byteString.charCodeAt(i);
    }
    const newBlob = new Blob([ab], { type: "image/png" });
    const objectUrl = URL.createObjectURL(newBlob);
    setPreview(objectUrl);
    const formData = Cloudinary.buildFileForm(
      base64,
      `companies/${company.name}`,
      "logo"
    );
    dispatch(
      UPLOAD({
        data: formData,
        token,
      })
    ).then(async (action) => {
      axioKit
        .update(
          "assets/companies",
          { _id: company._id, lid: action?.payload?.imgId },
          token
        )
        .then(() => {
          dispatch(SetCOMPANY({ ...company, lid: action?.payload?.imgId }));
          setShowImgCropper(false);
        });
    });
  };
  const handleDownload = () => {
    const link = document.createElement("a");
    link.href = FailedLogo;
    link.download = "Preset-Logo.jpg";
    link.click();
  };

  return (
    <>
      <div style={{ minWidth: "150px", width: "150px", aspectRatio: "1/1" }}>
        <MDBView hover={!showImgCropper}>
          <img
            src={
              preview ||
              `${Cloudinary.getEndpoint()}/${company?.lid || ""}/companies/${
                company.name
              }/logo.png`
            }
            className="img-fluid"
            alt={company?.name || "Default Logo"}
            onError={(e) => (e.target.src = FailedLogo)}
            style={{ minWidth: "150px", width: "150px", aspectRatio: "1/1" }}
          />
          <MDBMask overlay="grey-strong d-flex align-items-center">
            <MDBBtnGroup className="mx-auto">
              <MDBBtn
                disabled={isLoading}
                color="warning"
                size="sm"
                title="Download"
                onClick={handleDownload}
              >
                <MDBIcon icon="download" />
              </MDBBtn>
              <ImageCropper
                handleUpload={handleUpload}
                cropSize={{ width: 230, height: 80 }}
                setIsShow={(show) => setShowImgCropper(show)}
                isUpload
                label={
                  <>
                    <MDBIcon icon="upload" />
                  </>
                }
                accept={".png"}
              />
            </MDBBtnGroup>
          </MDBMask>
        </MDBView>
      </div>
    </>
  );
}
