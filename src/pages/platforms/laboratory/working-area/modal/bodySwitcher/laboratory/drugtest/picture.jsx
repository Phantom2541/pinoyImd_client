import { useEffect, useState, useRef, useCallback } from "react";
import { MDBBtn, MDBIcon } from "mdbreact";
import { useDispatch, useSelector } from "react-redux";
import Cropper from "react-easy-crop";

import { UPLOAD } from "../../../../../../../../services/redux/slices/assets/persons/auth";
import { Cloudinary } from "../../../../../../../../services/utilities";
import Spinner from "../../../../../../../../components/spinner";

export default function ProfileImage() {
  const dispatch = useDispatch();
  const { token, formSubmitted } = useSelector(({ auth }) => auth);
  const { task } = useSelector(({ validator }) => validator);

  const videoRef = useRef(null);
  const canvasRef = useRef(null);
  const streamRef = useRef(null);

  const [capturedImage, setCapturedImage] = useState(null);
  const [croppedAreaPixels, setCroppedAreaPixels] = useState(null);
  const [finalImage, setFinalImage] = useState(null);
  const [crop, setCrop] = useState({ x: 0, y: 0 });
  const [zoom, setZoom] = useState(1);

  const aspect = 1;
  const cropSize = { width: 250, height: 250 };

  const checkCloudinaryImage = useCallback(() => {
    const imgUrl = `${Cloudinary.getEndpoint()}/users/${
      task.patient.email
    }/profile.png?v=${Date.now()}`;

    fetch(imgUrl, { method: "HEAD" })
      .then((res) => {
        if (res.ok) {
          setFinalImage(imgUrl);
          setCapturedImage(null);
        } else {
          setFinalImage(null);
          setCapturedImage(null);
        }
      })
      .catch(() => setFinalImage(null));
  }, [task]);

  useEffect(() => {
    checkCloudinaryImage();
  }, [checkCloudinaryImage]);

  useEffect(() => {
    if (!capturedImage && !finalImage) {
      navigator.mediaDevices
        .getUserMedia({ video: true, audio: false })
        .then((stream) => {
          streamRef.current = stream;
          if (videoRef.current) {
            videoRef.current.srcObject = stream;
            videoRef.current.play();
          }
        })
        .catch((err) => console.error("Webcam access error:", err));
    }
    return () => {
      streamRef.current?.getTracks().forEach((track) => track.stop());
      streamRef.current = null;
    };
  }, [capturedImage, finalImage]);

  const capturePhoto = () => {
    const canvas = canvasRef.current;
    const context = canvas.getContext("2d");
    context.drawImage(videoRef.current, 0, 0, 640, 480);
    setCapturedImage(canvas.toDataURL("image/png"));
  };

  const onCropComplete = (_, croppedPixels) => {
    setCroppedAreaPixels(croppedPixels);
  };

  const getCroppedImg = async () => {
    const image = new Image();
    image.src = capturedImage;
    await new Promise((res) => (image.onload = res));

    const canvas = document.createElement("canvas");
    canvas.width = canvas.height = 250;

    const ctx = canvas.getContext("2d");
    ctx.drawImage(
      image,
      croppedAreaPixels.x,
      croppedAreaPixels.y,
      croppedAreaPixels.width,
      croppedAreaPixels.height,
      0,
      0,
      250,
      250
    );

    const formData = Cloudinary.buildFileForm(
      canvas.toDataURL("image/png"),
      `users/${task.patient.email}`,
      "profile"
    );

    dispatch(UPLOAD({ data: formData, token })).then(() => {
      setFinalImage(canvas.toDataURL("image/png"));
      setCapturedImage(null);
    });
  };

  const handleRetake = () => {
    setFinalImage(null);
    setCapturedImage(null);
    setCrop({ x: 0, y: 0 });
    setZoom(1);
  };

  return (
    <div className="d-flex justify-content-center">
      <div>
        {!capturedImage && !finalImage && (
          <div style={{ position: "relative", width: "100%", height: "100%" }}>
            <video
              ref={videoRef}
              width="100%"
              height="350"
              autoPlay
              style={{
                borderRadius: 6,
                boxShadow: "0 0 7px rgba(0, 0, 0, 0.2)",
              }}
            />
            <canvas
              ref={canvasRef}
              width="640"
              height="480"
              style={{ display: "none" }}
            />
            <MDBBtn
              size="sm"
              color="primary"
              onClick={capturePhoto}
              style={{
                position: "absolute",
                bottom: 10,
                left: "50%",
                transform: "translateX(-50%)",
                padding: "4px 12px",
                fontSize: "0.75rem",
              }}
            >
              Capture
            </MDBBtn>
          </div>
        )}

        {capturedImage && (
          <div
            style={{
              position: "relative",
              width: 250,
              height: 250,
              boxShadow: "0 0 7px rgba(0, 0, 0, 0.2)",
            }}
          >
            <Cropper
              image={capturedImage}
              crop={crop}
              zoom={zoom}
              aspect={aspect}
              cropSize={cropSize}
              onCropChange={setCrop}
              onZoomChange={setZoom}
              onCropComplete={onCropComplete}
              objectFit="cover"
            />
            <div
              style={{
                position: "absolute",
                bottom: 10,
                left: 0,
                right: 0,
                display: "flex",
                justifyContent: "center",
                gap: 10,
              }}
            >
              <MDBBtn size="sm" color="success" onClick={getCroppedImg}>
                {formSubmitted ? (
                  <Spinner formSubmitted={formSubmitted} />
                ) : (
                  <MDBIcon icon="check" />
                )}
              </MDBBtn>
              <MDBBtn
                size="sm"
                color="danger"
                onClick={() => checkCloudinaryImage()}
                disabled={formSubmitted}
              >
                <MDBIcon icon="times" />
              </MDBBtn>
            </div>
          </div>
        )}

        {finalImage && (
          <div className="mt-3 d-flex flex-column align-items-center">
            <img
              src={finalImage}
              alt="Final Cropped"
              width="250"
              height="250"
              style={{ boxShadow: "0 0 7px rgba(0,0,0,0.2)" }}
            />
            <MDBBtn
              size="sm"
              color="secondary"
              onClick={handleRetake}
              className="mt-2"
            >
              Retake
            </MDBBtn>
          </div>
        )}
      </div>
    </div>
  );
}
