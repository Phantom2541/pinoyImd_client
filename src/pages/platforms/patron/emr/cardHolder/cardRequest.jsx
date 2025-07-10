import React, { useRef, useState } from "react";
import { MDBBtn, MDBCard, MDBCardBody, MDBIcon } from "mdbreact";
import EditableSelect from "../../../../../components/customizable/editableSelect";
import { useSelector } from "react-redux";
import { HMO } from "../../../../../services/fakeDb";

const CardRequest = () => {
  const fileInputRef = useRef(null);
  const [image, setImage] = useState(null);

  const { activePlatform } = useSelector(({ auth }) => auth),
    { branch = {} } = activePlatform,
    { companyId = {} } = branch,
    { hmo = [] } = companyId;

  const handleUploadClick = () => {
    fileInputRef.current.click();
  };

  const handleFileChange = (e) => {
    const file = e.target.files?.[0];
    if (file) {
      const reader = new FileReader();
      reader.onloadend = () => {
        setImage(reader.result);
      };
      reader.readAsDataURL(file);
    }
  };

  return (
    <div className="d-flex align-items-center justify-content-center">
      <div>
        <EditableSelect
          label="Card Type"
          className="m-0 p-0 mb-n2 mt-1"
          isEditable={false}
          keyForValue="code"
          keyForText="label"
          collections={hmo.map(({ code }) => ({
            code,
            label: HMO.getName(code),
          }))}
        />

        <MDBCard
          style={{
            width: "370px",
            height: "214px",
            borderRadius: "8px",
            position: "relative",
            overflow: "hidden",
            backgroundColor: "#f9f9f9",
          }}
        >
          <MDBCardBody className="p-0">
            {image ? (
              <>
                <img
                  src={image}
                  alt="Uploaded Card"
                  style={{
                    width: "100%",
                    height: "100%",
                    objectFit: "cover",
                    borderRadius: "8px",
                  }}
                />
                <div
                  style={{
                    position: "absolute",
                    bottom: "-5px",
                    right: "0",
                    //   transform: "translateX(-50%)",
                  }}
                >
                  <MDBBtn size="sm" color="warning" onClick={handleUploadClick}>
                    <MDBIcon icon="redo" className="mr-2" />
                    Change Image
                  </MDBBtn>
                </div>
              </>
            ) : (
              <div className="d-flex h-100 w-100 align-items-center justify-content-center">
                <MDBBtn size="md" color="warning" onClick={handleUploadClick}>
                  <MDBIcon icon="upload" className="mr-2" />
                  Upload Card
                </MDBBtn>
              </div>
            )}
          </MDBCardBody>
        </MDBCard>

        <input
          type="file"
          accept="image/*"
          ref={fileInputRef}
          style={{ display: "none" }}
          onChange={handleFileChange}
        />
      </div>
    </div>
  );
};

export default CardRequest;
