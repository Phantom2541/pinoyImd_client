import { useState, useEffect } from "react";
import { useDispatch, useSelector } from "react-redux";
import {
  DESTROY,
  SetPRC,
  UPDATE,
  RESET,
} from "../../../../../services/redux/slices/assets/persons/heads";
import { useToasts } from "react-toast-notifications";
import { fullName, ENDPOINT } from "../../../../../services/utilities";
import Swal from "sweetalert2";
import { MDBIcon } from "mdbreact";
import "./style.css";
import ImageDragAndDrop from "../../../../templates/imageDragAndDrop/dragNdropimg";
import { isEqual } from "lodash";
import EditableField from "../../../../../components/customizable/editableField";
import {
  UPDATE_INFO,
  UPLOAD,
} from "../../../../../services/redux/slices/assets/persons/auth";
import EditableSelect from "../../../../../components/customizable/editableSelect";
import { Templates } from "../../../../../services/fakeDb";

export default function Body() {
  const {
      auth,
      token,
      formSubmitted: fsAuth,
      isSuccess: isAuth,
    } = useSelector(({ auth }) => auth),
    { filtered, message, isSuccess, formSubmitted } = useSelector(
      ({ heads }) => heads
    ),
    { collections: personnels } = useSelector(({ personnels }) => personnels),
    [heads, setHeads] = useState([]),
    { addToast } = useToasts(),
    [currentPage, setCurrentPage] = useState(1),
    itemsPerPage = 6,
    [animateClass, setAnimateClass] = useState(""),
    [savedImage, setSavedImage] = useState(null);
  const [selected, setSelected] = useState({});
  const dispatch = useDispatch();
  const [imageErrors, setImageErrors] = useState({});
  const [signatureRefreshKey, setSignatureRefreshKey] = useState({});

  useEffect(() => {
    if (filtered.length > 0) {
      const newArray = filtered.map((collection) => ({
        ...collection,
        user: {
          ...collection?.user,
          department: collection?.department,
          section: collection?.section,
        },
      }));
      setHeads(newArray || []);
    }
  }, [filtered]);

  useEffect(() => {
    if (message) {
      addToast(message, {
        appearance: isSuccess ? "success" : "error",
      });
    }
  }, [isSuccess, message, addToast]);

  const handleSignature = (e, email) => {
    const file = e.target.files[0];

    if (!file) return;

    if (file.type === "image/png") {
      const reader = new FileReader();

      reader.onload = (e) => {
        file.signature = file.name;

        dispatch(
          UPLOAD({
            data: {
              path: `users/${email}`,
              base64: reader.result.split(",")[1],
              name: "signature.png",
            },
            token,
          })
        );
      };

      reader.readAsDataURL(file);

      setTimeout(() => {
        setImageErrors((prev) => ({ ...prev, [email]: false }));
        setSignatureRefreshKey((prev) => ({
          ...prev,
          [email]: (prev[email] || 0) + 1,
        }));
        addToast("Signature updated!", { appearance: "success" });
      }, 500);

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
  const totalPages = Math.ceil(heads.length / itemsPerPage);
  const paginatedHeads = heads.slice(
    (currentPage - 1) * itemsPerPage,
    currentPage * itemsPerPage
  );

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

  const handleImageError = (email) =>
    setImageErrors((prev) => ({ ...prev, [email]: true }));

  const handleImageChange = (file, imageUrl) => {
    setSavedImage(imageUrl);
    console.log("✅ Cropped image passed to parent:", savedImage);
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
                  img={`${ENDPOINT}/public/users/${email}/profile.jpg`}
                  savedImg={handleImageChange}
                  setImgEmail={email}
                  setImgName="profile"
                  token={token}
                  allowedType="jpg"
                />
              </div>
              <div className="signatories-card-body ">
                <div className="signatories-card-section-department">
                  <span>
                    <EditableSelect
                      classNameTxt="signatories-card-section"
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
                  </span>
                  &nbsp;-&nbsp;
                  <span>
                    <EditableSelect
                      classNameTxt="signatories-card-department"
                      isEditable
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
                      onClick={(e) => {
                        document.getElementById(`file-upload-${email}`).click();
                      }}
                      alt="Signature"
                      src={`${ENDPOINT}/public/users/${email}/signature.png?key=${
                        signatureRefreshKey[email] || 0
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
                <EditableSelect
                  classNameTxt="signatories-card-name"
                  isEditable
                  preValue={user._id}
                  collections={[
                    ...personnels.map(({ user }) => ({
                      userId: user._id,
                      text: fullName(user.fullName),
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

              <div
                className={`signatories-card-footer ${prc || "requiredPRC"}`}
              >
                {prc ? (
                  <div className="signatories-card-expiration-container">
                    <EditableField
                      className="form-control form-control-sm"
                      classNameTxt="signatories-card-expiration"
                      width="8rem"
                      type="string"
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
                    <span className="d-block mt-n2">&nbsp;|&nbsp;</span>
                    <EditableField
                      className="form-control form-control-sm"
                      classNameTxt="signatories-card-expiration"
                      type="date"
                      width="11rem"
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
                  </div>
                ) : (
                  <span className="">
                    <strong>PRC license is required</strong> for this user to be
                    assigned as a head. This is a&nbsp;
                    <strong>DOH qualification</strong> for publishing laboratory
                    results.
                  </span>
                )}
              </div>
              <div className="signatories-card-actionBtn">
                <button
                  className="signatories-card-btn-delete bg-danger"
                  onClick={() => {
                    console.log("handle delete user", _id);
                    handleDelete(_id, user);
                  }}
                >
                  <MDBIcon fas icon="times" />
                </button>
              </div>
            </div>
          );
        })}
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
      </div>
    </div>
  );
}
