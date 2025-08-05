import { useEffect, useState } from "react";
import {
  MDBAlert,
  MDBAnimation,
  MDBBtn,
  MDBBtnGroup,
  MDBCard,
  MDBCardBody,
  MDBCol,
  MDBIcon,
  MDBMask,
  MDBProgress,
  MDBRow,
  MDBTable,
  MDBTypography,
  MDBView,
} from "mdbreact";
import { useToasts } from "react-toast-notifications";
import {
  buildImageForm,
  CLOUDINARY_ENDPOINT,
  fullName,
  getAge,
} from "../../../../../services/utilities";
import { useDispatch, useSelector } from "react-redux";
import {
  UPLOAD,
  RESET,
} from "../../../../../services/redux/slices/assets/persons/auth";
import { FailedBanner } from "../../../../../services/utilities";
import ImageCropper from "../../../../../components/images/imageCropper";

const array = new Array(5).fill().map((_, index) => index);

const Banner = () => {
  const { auth, message, isSuccess } = useSelector(({ auth }) => auth);
  const { addToast } = useToasts();
  const { activePlatform, company, token } = useSelector(({ auth }) => auth);
  const [dateNow, setDateNow] = useState(Date.now()); //Used to display the banner in real time.
  const [showImgCropper, setShowImgCropper] = useState(false);
  const dispatch = useDispatch();
  const folder = `companies/${company.name}/${activePlatform?.branch?.name}`;
  useEffect(() => {
    setShowImgCropper(false);
    dispatch(RESET());
  }, [dispatch]);
  useEffect(() => {
    if (message) {
      addToast(message, {
        appearance: isSuccess ? "success" : "error",
      });
    }

    return () => dispatch(RESET());
  }, [isSuccess, message, addToast, dispatch]);

  const handleUpload = (base64) => {
    const formData = buildImageForm(base64, folder, "banner");
    dispatch(
      UPLOAD({
        data: formData,
        token,
      })
    ).then(() => {
      setDateNow(Date.now());
    });
  };

  const handleDownload = () => {
    const link = document.createElement("a");
    link.href = FailedBanner;
    link.download = "Preset-Banner.jpg";
    link.click();
  };
  return (
    <div style={{ width: "850px" }} className="mx-auto">
      <MDBTypography
        variant="h6"
        noteColor="warning"
        className="mt-2 "
        note
        noteTitle={"Description: "}
      >
        Hover over the banner to upload or download a new one.
      </MDBTypography>
      <MDBCard>
        <MDBCardBody>
          <MDBView hover={!showImgCropper}>
            <img
              key={dateNow}
              src={`${CLOUDINARY_ENDPOINT}/${folder}/banner.png?v=${dateNow}`}
              className="img-fluid"
              alt={company?.name || "Default Banner"}
              onError={(e) => (e.target.src = FailedBanner)}
            />
            <MDBMask overlay="grey-strong d-flex align-items-center">
              <MDBBtnGroup className="mx-auto">
                <MDBBtn color="warning" size="sm" onClick={handleDownload}>
                  <MDBIcon icon="download" />
                </MDBBtn>

                <ImageCropper
                  handleUpload={handleUpload}
                  cropSize={{ width: 850, height: 85 }}
                  modalSize="xl"
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
          <MDBRow className="my-2">
            <MDBCol md="6">
              <h6>
                Name: <strong>{fullName(auth?.fullName)}</strong>
              </h6>
              <h6>
                Age: {getAge(auth?.dob)} | Gender:&nbsp;
                {auth?.isMale ? "Male" : "Female"}
              </h6>
              <h6>Category: Walkin</h6>
            </MDBCol>
            <MDBCol md="6">
              <h6 className="text-md-end">
                Date: {new Date().toDateString()},&nbsp;
                {new Date().toLocaleTimeString()}
              </h6>
            </MDBCol>
          </MDBRow>
          <MDBAlert
            color="primary"
            className="text-uppercase text-center py-0 mb-1"
          >
            <h5 style={{ letterSpacing: "30px" }} className="mb-0 fw-bold">
              CHEMISTRY
            </h5>
          </MDBAlert>
          <MDBTable hover bordered responsive className="mb-0 text-center">
            <thead>
              <tr>
                <th className="py-0" />
                <th className="text-center py-0" colSpan={2}>
                  Conventional Unit
                </th>
                <th className="text-center py-0" colSpan={2}>
                  System International Unit
                </th>
              </tr>
              <tr>
                <th className="py-0 text-left">Service</th>
                <th className="py-0">Result</th>
                <th className="py-0">Reference</th>
                <th className="py-0">Result</th>
                <th className="py-0">Reference</th>
              </tr>
            </thead>
            <tbody>
              {array
                .sort(() => Math.random() - 0.5)
                .map((num, rI) => (
                  <tr key={`presetRow-${rI}`}>
                    {new Array(5).fill().map((_, cI) => (
                      <td key={`presetCol-${cI}`}>
                        <div
                          style={{
                            width: cI === 0 && `${num * 50 + 100}px`,
                          }}
                        >
                          <MDBAnimation
                            type="fadeIn"
                            infinite
                            delay={`${rI + cI}00ms`}
                            duration="5000ms"
                          >
                            <MDBProgress animated color="light" value={100} />
                          </MDBAnimation>
                        </div>
                      </td>
                    ))}
                  </tr>
                ))}
            </tbody>
          </MDBTable>
        </MDBCardBody>
      </MDBCard>
    </div>
  );
};

export default Banner;
