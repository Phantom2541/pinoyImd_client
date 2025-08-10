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
import ImageDragAndDrop from "../../../../../components/images/imageDragAndDrop/dragNdroping";
import EditableField from "../../../../../components/customizable/editableField";
import {
  UPDATE_INFO,
  UPLOAD,
} from "../../../../../services/redux/slices/assets/persons/auth";
import EditableSelect from "../../../../../components/customizable/editableSelect";
import { Templates } from "../../../../../services/fakeDb";

export default function Body() {
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
  const [signatureRefreshKey, setSignatureRefreshKey] = useState({});
  const [emailRefreshKey, setEmailRefreshKey] = useState({});
  const [heads, setHeads] = useState([]);

  useEffect(() => {
    if (message) {
      addToast(message, {
        appearance: isSuccess ? "success" : "error",
      });
    }
  }, [isSuccess, message, addToast]);

  // Load from localStorage (once)
  useEffect(() => {
    const savedSignatureKeys = JSON.parse(
      localStorage.getItem("signatureRefreshKey") || "{}"
    );
    const savedEmailKeys = JSON.parse(
      localStorage.getItem("emailRefreshKey") || "{}"
    );
    setSignatureRefreshKey(savedSignatureKeys);
    setEmailRefreshKey(savedEmailKeys);
  }, []);

  useEffect(() => {
    setHeads(filtered);
  }, [filtered]);

  const handleSignature = (e, email) => {
    const file = e.target.files[0];
    if (!file) return;

    if (file.type === "image/png") {
      const reader = new FileReader();

      reader.onload = () => {
        file.signature = file.name;
        const formData = Cloudinary.buildFileForm(
          reader.result,
          `users/${email}`,
          "signature"
        );

        dispatch(
          UPLOAD({
            data: formData,
            token,
          })
        ).then(() => {
          setImageErrors((prev) => ({ ...prev, [email]: false }));
          const updated = { ...signatureRefreshKey, [email]: Date.now() };
          setSignatureRefreshKey(updated);
          localStorage.setItem("signatureRefreshKey", JSON.stringify(updated));
          addToast("Signature updated!", { appearance: "success" });
        });
      };

      reader.readAsDataURL(file);

      e.target.value = null; // ✅ Reset only after success
    } else {
      addToast("Only PNG files are allowed!", { appearance: "error" });
      e.target.value = null; // ✅ Reset if rejected
    }
  };

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

  const handleUploadProfile = (base64, email) => {
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
    ).then(() => {
      const updated = { ...emailRefreshKey, [email]: Date.now() };
      setEmailRefreshKey(updated);
      localStorage.setItem("emailRefreshKey", JSON.stringify(updated));
      addToast("Profile Successfully uploaded!", { appearance: "success" });
    });
  };

  const totalPages = Math.ceil(heads.length / itemsPerPage);
  const paginatedHeads = heads.slice(
    (currentPage - 1) * itemsPerPage,
    currentPage * itemsPerPage
  );

  return (
    <div className="signatories-section">
      <div className={`signatories-card-container mt-4 ${animateClass}`}>
        {paginatedHeads.map(({ _id, department, section, user }, index) => {
          const { email, prc } = user;

          return (
            <div
              key={_id || index}
              className={`signatories-card ${prc || "requiredPRC"}`}
            >
              <div className="signatories-card-header">
                <ImageDragAndDrop
                  key={emailRefreshKey[email] || email}
                  img={`${Cloudinary.getEndpoint()}/users/${email}/profile.png?refresh=${
                    emailRefreshKey[email] || ""
                  }`}
                  handleUpload={(cropImg) =>
                    handleUploadProfile(cropImg, email)
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
                      key={signatureRefreshKey[email] || email}
                      onClick={() => {
                        document.getElementById(`file-upload-${email}`).click();
                      }}
                      alt="Signature"
                      src={`${Cloudinary.getEndpoint()}/users/${email}/signature.png?v=${
                        signatureRefreshKey[email] || ""
                      }`}
                      onError={() => handleImageError(email)}
                      className="signatories-card-signature"
                    />
                  ) : (
                    <button
                      className="signatories-card-signature-upload-btn"
                      onClick={() =>
                        document.getElementById(`file-upload-${email}`).click()
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
                  onChange={(e) => handleSignature(e, email)}
                  hidden
                />
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
        })}
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
    </div>
  );
}
