import { useState, useEffect } from "react";
import { useDispatch, useSelector } from "react-redux";
import {
  DESTROY,
  SetPRC,
  UPDATE,
  RESET,
} from "../../../.././../services/redux/slices/assets/persons/heads";
import { useToasts } from "react-toast-notifications";
import { fullName, Cloudinary } from "../../../../../services/utilities";
import Swal from "sweetalert2";
import { MDBIcon } from "mdbreact";
import "./style.css";
import { ImageDragAndDrop } from "../../../../../components/images";
import EditableField from "../../../../../components/customizable/editableField";
import {
  UPDATE_INFO,
  UPLOAD,
} from "../../../../../services/redux/slices/assets/persons/auth";
import EditableSelect from "../../../../../components/customizable/editableSelect";
import { Templates } from "../../../../../services/fakeDb";
import Cropper from "react-easy-crop";
import { createPortal } from "react-dom";
import { removeBackground } from "../../../../../components/images/backgroundRemover";

export default function Body() {
  const [showCropper, setShowCropper] = useState(false);
  const [cropperUser, setCropperUser] = useState(null);
  const [selectedImage, setSelectedImage] = useState(null);
  const [croppedAreaPixels, setCroppedAreaPixels] = useState(null);
  const [crop, setCrop] = useState({ x: 0, y: 0 });
  const [zoom, setZoom] = useState(1);
  const [currentUpload, setCurrentUpload] = useState(null); // { email, _id }
  const {
      token,
      formSubmitted: fsAuth,
      isSuccess: isAuth,
    } = useSelector(({ auth }) => auth),
    { filtered, message, isSuccess, formSubmitted } = useSelector(
      ({ heads }) => heads
    ),
    { collections: personnels } = useSelector(({ personnels }) => personnels),
    { addToast } = useToasts(),
    [currentPage, setCurrentPage] = useState(1),
    itemsPerPage = 6,
    [animateClass, setAnimateClass] = useState("");
  const dispatch = useDispatch();
  const [imageErrors, setImageErrors] = useState({});
  const [heads, setHeads] = useState([]);

  useEffect(() => {
    if (message) {
      addToast(message, {
        appearance: isSuccess ? "success" : "error",
      });
    }
  }, [isSuccess, message, addToast]);

  useEffect(() => {
    setHeads(filtered);
  }, [filtered]);

  const handleDelete = (_id, user) => {
    Swal.fire({
      title: `Are you sure you want to delete ${fullName(user.fullName)}?`,
      text: "You won't be able to revert this!",
      icon: "warning",
      showCancelButton: true,
      confirmButtonColor: "#3085d6",
      cancelButtonColor: "#d33",
      confirmButtonText: "Yes, delete it!",
    }).then((result) => {
      if (result.isConfirmed) {
        dispatch(DESTROY({ token, data: { id: _id } })).then(() => {
          dispatch(RESET());
        });
      }
    });
  };

  const handlePageChange = (direction) => {
    setAnimateClass("fade-out");
    setTimeout(() => {
      setCurrentPage((prev) => (direction === "next" ? prev + 1 : prev - 1));
      setAnimateClass("fade-in");
    }, 300); // Delay matches animation duration
  };

  const handleUpdate = (data) => {
    dispatch(
      UPDATE({
        data,
        token,
      })
    );
  };

  const nextPage = () => {
    if (currentPage < totalPages) {
      handlePageChange("next");
    }
  };

  const prevPage = () => {
    if (currentPage > 1) {
      handlePageChange("prev");
    }
  };

  const handleImageError = (email) => {
    if (imageErrors.hasOwnProperty(email))
      return setImageErrors((prev) => ({ ...prev }));
    setImageErrors((prev) => ({ ...prev, [email]: true }));
  };

  const updateAuth = (data) => {
    const { user, prc } = data;
    dispatch(UPDATE_INFO({ token, data: { _id: user, prc } })).then(
      ({ payload }) => {
        const { payload: info } = payload;
        const { _id, prc } = info;
        dispatch(SetPRC({ userId: _id, prc }));
      }
    );
  };

  const handleSections = (_department = "") => {
    const department = _department?.toLowerCase();
    const sections = Templates.getComponents(
      department === "laboratory"
        ? "LAB"
        : department === "radiology"
        ? "RAD"
        : "CLINIC"
    );
    sections.push(department === "laboratory" ? "Pathologist" : "Radiologist");
    return sections;
  };

  const updateHeadsImg = (_id, imgId, keyToUpdate, message = "") => {
    const _heads = [...heads];
    const users = _heads.filter((h) => h.user?._id === _id);
    users.forEach((element) => {
      const index = _heads.findIndex(({ _id: hId }) => hId === element._id);
      _heads[index] = {
        ..._heads[index],
        user: { ..._heads[index]?.user, [keyToUpdate]: imgId },
      };
    });

    setHeads(_heads);
    addToast(message, { appearance: "success" });
  };

  const handleSignature = async (e, email, _id) => {
    const file = e.target.files[0];
    if (!file) return;
    e.target.value = "";

    if (file.type === "image/png") {
      const reader = new FileReader();
      reader.onloadend = async () => {
        try {
          // dito na aalisin background bago ipasa kay Cropper
          const transparentImage = await removeBackground(reader.result, 60);
          setSelectedImage(transparentImage);
          setShowCropper(true);
          setCurrentUpload({ email, _id });
        } catch (err) {
          console.error("Background removal failed:", err);
          addToast("Failed to remove background", { appearance: "error" });
        }
      };
      reader.readAsDataURL(file);
    } else {
      addToast("Only PNG files are allowed!", { appearance: "error" });
    }
  };

  const handleUploadProfile = (base64, email, _id) => {
    const formData = Cloudinary.buildFileForm(
      base64,
      `users/${email}`,
      "profile"
    );
    dispatch(
      UPLOAD({
        data: formData,
        token,
      })
    ).then((action) =>
      dispatch(UPDATE_INFO({ data: { _id, pid: action.payload.imgId } })).then(
        () =>
          updateHeadsImg(
            _id,
            action.payload.imgId,
            "pid",
            "Profile Successfully uploaded!"
          )
      )
    );
  };

  const totalPages = Math.ceil(heads.length / itemsPerPage);
  const paginatedHeads = heads.slice(
    (currentPage - 1) * itemsPerPage,
    currentPage * itemsPerPage
  );

  const handleCloseCropper = () => {
    setShowCropper(false);
    setSelectedImage(null);
    setCroppedAreaPixels(null);
    setCrop({ x: 0, y: 0 });
    setZoom(1);
    setCurrentUpload(null);
  };

  const getCroppedImg = (imageSrc, crop) => {
    return new Promise((resolve, reject) => {
      const image = new Image();
      image.src = imageSrc;
      image.onload = () => {
        const canvas = document.createElement("canvas");
        const ctx = canvas.getContext("2d");
        canvas.width = crop.width;
        canvas.height = crop.height;

        ctx.drawImage(
          image,
          crop.x,
          crop.y,
          crop.width,
          crop.height,
          0,
          0,
          crop.width,
          crop.height
        );

        resolve(canvas.toDataURL("image/png"));
      };
      image.onerror = (err) => reject(err);
    });
  };

  const handleCropConfirm = async () => {
    try {
      const croppedImage = await getCroppedImg(
        selectedImage,
        croppedAreaPixels
      );

      const { email, _id } = currentUpload;
      const formData = Cloudinary.buildFileForm(
        croppedImage,
        `users/${email}`,
        "signature"
      );

      dispatch(UPLOAD({ data: formData, token })).then((action) => {
        dispatch(
          UPDATE_INFO({ data: { _id, sid: action.payload.imgId } })
        ).then(() =>
          updateHeadsImg(_id, action.payload.imgId, "sid", "Signature updated!")
        );
        setImageErrors((prev) => ({ ...prev, [email]: false }));
      });

      handleCloseCropper();
    } catch (err) {
      console.error(err);
      addToast("Failed to crop image!", { appearance: "error" });
    }
  };

  return (
    <div className="signatories-section position-relative">
      <div
        className={`${
          paginatedHeads.length > 0 && "signatories-card-container"
        } mt-4 ${animateClass}`}
      >
        {paginatedHeads.length > 0 ? (
          paginatedHeads.map(({ _id, department, section, user }, index) => {
            const { email, prc, pid = "", _id: userId = "", sid = "" } = user;

            return (
              <div
                key={_id || index}
                className={`signatories-card ${prc || "requiredPRC"}`}
              >
                <div className="signatories-card-header" key={`${_id}-${pid}`}>
                  <ImageDragAndDrop
                    img={`${Cloudinary.getEndpoint()}/${pid}/users/${email}/profile.png`}
                    handleUpload={(cropImg) =>
                      handleUploadProfile(cropImg, email, userId)
                    }
                    formSubmitted={fsAuth}
                    allowedType="jpg"
                  />
                </div>
                <div className="signatories-card-body ">
                  <div className="signatories-card-section-department">
                    <div>
                      <EditableSelect
                        title="Click to edit"
                        classNameTxt="signatories-card-section"
                        animation
                        className="mb-n2 mt-n1"
                        animationStyle={{ width: "14rem" }}
                        isEditable
                        preValue={section}
                        collections={handleSections(department)}
                        fieldData={{
                          _id,
                          section,
                        }}
                        keyForValue="section"
                        selectStyle={{ width: "11rem" }}
                        keyForText="section"
                        formSubmitted={formSubmitted}
                        isSuccess={isSuccess}
                        onSave={(data) =>
                          handleUpdate({ id: data._id, section: data.section })
                        }
                      />
                    </div>
                    &nbsp;-&nbsp;
                    <span>
                      <EditableSelect
                        title="Click to edit"
                        classNameTxt="signatories-card-department"
                        isEditable
                        animation
                        className="mb-n2 mt-n1"
                        animationStyle={{ width: "14rem" }}
                        preValue={department}
                        collections={Templates.collections}
                        fieldData={{
                          _id,
                          label: department,
                        }}
                        keyForValue="label"
                        keyForText="label"
                        formSubmitted={formSubmitted}
                        isSuccess={isSuccess}
                        onSave={(data) =>
                          handleUpdate({
                            id: data._id,
                            department: data.label,
                          })
                        }
                      />
                    </span>
                  </div>
                  <div className="signatories-card-signature-container">
                    {!imageErrors[email] ? (
                      <img
                        key={sid}
                        onClick={() => {
                          setCropperUser(user);
                          document
                            .getElementById(`file-upload-${email}`)
                            .click();
                        }}
                        alt="Signature"
                        src={`${Cloudinary.getEndpoint()}/${sid}/users/${email}/signature.png`}
                        onError={() => handleImageError(email)}
                        className="signatories-card-signature"
                      />
                    ) : (
                      <button
                        className="signatories-card-signature-upload-btn"
                        onClick={() =>
                          document
                            .getElementById(`file-upload-${email}`)
                            .click()
                        }
                      >
                        Upload Signature
                      </button>
                    )}
                  </div>
                  <input
                    id={`file-upload-${email}`}
                    type="file"
                    accept="image/png"
                    onChange={(e) => handleSignature(e, email, userId)}
                    hidden
                  />
                  {showCropper &&
                    createPortal(
                      <div className="signatories-cropper-modal">
                        <div className="signatories-cropper-container">
                          <div className="signatories-cropper-header">
                            ✂️ Crop Signature
                          </div>
                          <div className="signatories-cropper-body">
                            <Cropper
                              image={selectedImage}
                              crop={crop}
                              zoom={zoom}
                              aspect={3 / 1}
                              cropSize={{ width: 200, height: 100 }}
                              showGrid={false}
                              restrictPosition={false}
                              onCropChange={setCrop}
                              onZoomChange={setZoom}
                              onCropComplete={(_, croppedAreaPixels) =>
                                setCroppedAreaPixels(croppedAreaPixels)
                              }
                            />
                            <span className="signatories-cropper-guide">
                              {fullName(cropperUser.fullName)}
                            </span>
                          </div>
                          <div className="signatories-cropper-controls">
                            <input
                              type="range"
                              className="signatories-crop-zoom-slider"
                              min={0.5}
                              max={3}
                              step={0.1}
                              value={zoom}
                              onChange={(e) => setZoom(e.target.value)}
                            />
                            <button
                              className="signatories-cropper-btn cancel"
                              onClick={handleCloseCropper}
                            >
                              Cancel
                            </button>
                            <button
                              className="signatories-cropper-btn confirm"
                              onClick={handleCropConfirm}
                            >
                              Crop & Upload
                            </button>
                          </div>
                        </div>
                      </div>,
                      document.body
                    )}

                  <div
                    className="position-relative d-flex justify-content-center"
                    style={{ height: "1.6rem" }}
                  >
                    <EditableSelect
                      title="Click to edit"
                      classNameTxt="signatories-card-name"
                      isEditable
                      preValue={user._id}
                      animation
                      className="mb-n2 mt-n1"
                      animationStyle={{ width: "100%" }}
                      collections={[
                        ...personnels.map(({ user }) => ({
                          userId: user?._id,
                          text: fullName(user?.fullName),
                        })),
                      ]}
                      fieldData={{
                        _id,
                        userId: user._id,
                        text: fullName(user.fullName),
                      }}
                      keyForValue="userId"
                      keyForText="text"
                      formSubmitted={formSubmitted}
                      isSuccess={isSuccess}
                      onSave={(data) =>
                        handleUpdate({ id: data._id, user: data.userId })
                      }
                    />
                  </div>
                </div>

                <div className={`signatories-card-footer`}>
                  <div className="signatories-card-expiration-container">
                    <span className="signatories-card-prc-label">
                      <strong>PRC ID:&nbsp;</strong>
                      <EditableField
                        title="Click to edit"
                        className="form-control form-control-sm"
                        classNameTxt="signatories-card-prc"
                        type="string"
                        animation
                        animationStyle={{ width: "10rem" }}
                        keyForValue="id"
                        fieldData={{
                          _id: `${_id}-id-${index}`,
                          id: prc?.id,
                          prc,
                          user: user._id,
                        }}
                        onSave={(data) =>
                          updateAuth({
                            ...data,
                            prc: { ...data.prc, id: data.id },
                          })
                        }
                        formSubmitted={fsAuth}
                        isSuccess={isAuth}
                      />
                    </span>
                    <span>&nbsp;|&nbsp;</span>
                    <span
                      className="signatories-card-expiration-label"
                      style={{ width: "9rem" }}
                    >
                      <strong>Expiration:&nbsp;</strong>
                      <EditableField
                        title="Click to edit"
                        className="form-control form-control-sm"
                        classNameTxt="signatories-card-expiration"
                        type="date"
                        width="11rem"
                        animation
                        animationStyle={{ width: "10rem" }}
                        keyForValue="to"
                        fieldData={{
                          _id: `${_id}-to`,
                          to: prc?.to,
                          prc,
                          user: user._id,
                        }}
                        onSave={(data) =>
                          updateAuth({
                            ...data,
                            prc: { ...data.prc, to: data.to },
                          })
                        }
                        formSubmitted={fsAuth}
                        isSuccess={isAuth}
                      />
                    </span>
                  </div>
                </div>
                <span
                  className={`signatories-card-footer-requiredPRC ${
                    prc ? "requiredPRC" : ""
                  }`}
                >
                  <strong>PRC license is required</strong> for this user to be
                  assigned as a head. This is a&nbsp;
                  <strong>DOH qualification</strong> for publishing laboratory
                  results.
                </span>
                <div className="signatories-card-actionBtn">
                  <button
                    className="signatories-card-btn-delete bg-danger"
                    onClick={() => {
                      handleDelete(_id, user);
                    }}
                  >
                    <MDBIcon fas icon="times" />
                  </button>
                </div>
              </div>
            );
          })
        ) : (
          <div
            className="signatories-card empty-card d-flex flex-column align-items-center  justify-content-center p-4"
            style={{
              border: "2px dashed #ccc",
              borderRadius: "0.5rem",
              backgroundColor: "#f9f9f9",
              width: "14rem",
              height: "18rem",
              textAlign: "center",
            }}
          >
            <MDBIcon icon="user-slash" size="3x" className="mb-3 text-muted" />
            <h6 className="text-muted mb-2">No Signatories Yet</h6>
            <p className="text-center text-muted small">
              Add signatories to display them here.
            </p>
          </div>
        )}
      </div>
      {paginatedHeads.length === 0 ? (
        ""
      ) : (
        <>
          <button
            className="signatories-pagination-btnLeft"
            onClick={prevPage}
            disabled={currentPage === 1}
          >
            <MDBIcon icon="angle-left" />
          </button>
          <button
            className="signatories-pagination-btnRight"
            onClick={nextPage}
            disabled={currentPage === totalPages}
          >
            <MDBIcon icon="angle-right" />
          </button>
        </>
      )}
    </div>
  );
}
