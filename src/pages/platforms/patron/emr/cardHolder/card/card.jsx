import { MDBCard, MDBCardBody, MDBBtn, MDBIcon } from "mdbreact";

const Card = ({ isValid, handleUploadClick, isFront = false, src }) => {
  return (
    <div>
      <span style={{ fontWeight: 500 }}>{isFront ? "Front" : "Back"}</span>

      <MDBCard
        style={{
          width: "400px",
          height: "230px",
          borderRadius: "8px",
          position: "relative",
          overflow: "hidden",
          backgroundColor: "#f9f9f9",
          border: !src && "1.7px dashed black",
        }}
      >
        <MDBCardBody className="p-0 d-flex flex-wrap">
          {!isValid && (
            <div
              className="alert alert-danger mb-0 d-flex align-items-center justify-content-center mb-n5"
              style={{
                borderRadius: "0",
                fontWeight: "500",
                textAlign: "center",
                padding: "12px 16px",
                backgroundColor: "#f8d7da",
                color: "#721c24",
              }}
            >
              Card {isFront ? "front" : "back"} is required. Please upload it
              before proceeding to the next step.
            </div>
          )}
          {src ? (
            <>
              <img
                src={`data:image/png;base64,${src}`}
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
                }}
              >
                <MDBBtn
                  size="sm"
                  color="warning"
                  onClick={() => handleUploadClick(isFront)}
                >
                  <MDBIcon icon="redo" className="mr-2" />
                  Change Image
                </MDBBtn>
              </div>
            </>
          ) : (
            <div className="d-flex h-100 w-100 align-items-center justify-content-center">
              <MDBBtn
                size="md"
                color="warning"
                onClick={() => handleUploadClick(isFront)}
              >
                <MDBIcon icon="upload" className="mr-2" />
                Upload Card
              </MDBBtn>
            </div>
          )}
        </MDBCardBody>
      </MDBCard>
    </div>
  );
};

export default Card;
