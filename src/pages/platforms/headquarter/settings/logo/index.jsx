import { useEffect, useMemo, useState } from "react";
import { MDBBtn, MDBBtnGroup, MDBIcon, MDBMask, MDBView } from "mdbreact";
import { axioKit, Cloudinary } from "./../../../../../services/utilities";
import { useDispatch, useSelector } from "react-redux";
import {
  UPLOAD,
  RESET,
  SetCOMPANY,
} from "./../../../../../services/redux/slices/assets/persons/auth";
import { FailedLogo } from "./../../../../../services/utilities";
import ImageCropper from "../../../../../components/images/cropper";

export default function Logo() {
  const { company, token, isLoading } = useSelector(({ auth }) => auth);
  const dispatch = useDispatch();
  const [preview, setPreview] = useState("");
  const [showImgCropper, setShowImgCropper] = useState(false);
  const cropperInputId = useMemo(
    () => `company-logo-crop-${company?._id || "default"}`,
    [company?._id]
  );
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
    link.download = "logoWithText.png";
    link.click();
  };

  return (
    <>
      <div
        style={{
          width: "230px",
          maxWidth: "100%",
        }}
      >
        <MDBView hover={!showImgCropper}>
          <div
            style={{
              width: "230px",
              maxWidth: "100%",
              height: "80px",
              background: "#ffffff",
              display: "flex",
              alignItems: "center",
              justifyContent: "center",
              borderRadius: "16px",
              overflow: "hidden",
            }}
          >
            <img
              src={
                preview ||
                `${Cloudinary.getEndpoint()}/${company?.lid || ""}/companies/${
                  company.name
                }/logo.png`
              }
              alt={company?.name || "Default Logo"}
              onError={(e) => (e.target.src = FailedLogo)}
              style={{
                display: "block",
                width: "230px",
                height: "80px",
                objectFit: "contain",
                background: "#ffffff",
              }}
            />
          </div>
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
                modalSize="lg"
                cropSize={{ width: 230, height: 80 }}
                setIsShow={(show) => setShowImgCropper(show)}
                isUpload
                inputId={cropperInputId}
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
