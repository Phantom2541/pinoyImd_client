import React, { useState, useEffect } from "react";
import { useDispatch, useSelector } from "react-redux";
import {
  DESTROY,
  UPDATE,
} from "../../../../../services/redux/slices/assets/persons/heads";
import { useToasts } from "react-toast-notifications";
import { fullName, ENDPOINT } from "../../../../../services/utilities";
import Swal from "sweetalert2";
import { MDBIcon } from "mdbreact";
import "./style.css";
import ImageDragAndDrop from "../../../../templates/imageDragAndDrop/dragNdropimg";
import { isEqual } from "lodash";
import { Input } from "../../../../../components/customizable";

export default function Body() {
  const { token } = useSelector(({ auth }) => auth),
    { collections, message, isSuccess } = useSelector(({ heads }) => heads),
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
    if (collections.length > 0) {
      const newArray = collections.map((collection) => ({
        ...collection,
        user: {
          ...collection?.user,
          department: collection?.department,
          section: collection?.section,
        },
      }));
      setHeads(newArray || []);
    }
  }, [collections]);

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

    // Simulate upload success (replace with actual upload logic)
    setTimeout(() => {
      // Clear error state and force image refresh
      setImageErrors((prev) => ({ ...prev, [email]: false }));
      setSignatureRefreshKey((prev) => ({
        ...prev,
        [email]: (prev[email] || 0) + 1,
      }));
      addToast("Signature updated!", { appearance: "success" });
    }, 500);

    e.target.value = null;
  };

  const handleDelete = (user) => {
    Swal.fire({
      title: "Are you sure?",
      text: "You won't be able to revert this!",
      icon: "warning",
      showCancelButton: true,
      confirmButtonColor: "#3085d6",
      cancelButtonColor: "#d33",
      confirmButtonText: "Yes, delete it!",
    }).then((result) => {
      if (result.isConfirmed) {
        dispatch(DESTROY({ token, data: { id: user._id } }));
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

  const handleUpdate = (user) => {
    // check if object has changed
    if (isEqual(user, selected))
      return addToast("No changes found, skipping update.", {
        appearance: "info",
      });

    dispatch(
      UPDATE({
        data: { ...user, id: selected._id },
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

  const handleSelected = (data) => {
    const { id, ...val } = data;
    const [key] = Object.keys(val);
    const value = val[key];

    if (selected?.id === id && selected.key === key) {
      setSelected({});
    } else {
      setSelected({ id, key, value, old: value });
    }
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
              {/* Left: Profile Image */}
              <div className="signatories-card-header">
                {/* <img
                  src={`${ENDPOINT}/public/users/${email}/profile.jpg`}
                  alt="Profile"
                  className="signatories-profile-image"
                /> */}
                <ImageDragAndDrop
                  img={`${ENDPOINT}/public/users/${email}/profile.jpg`}
                  savedImg={handleImageChange}
                />
              </div>
              <div className="signatories-card-body">
                <div className="signatories-card-section-department">
                  <span className="signatories-card-section">{section}</span>
                  &nbsp;-&nbsp;
                  <span className="signatories-card-department">
                    {department}
                  </span>
                </div>
                <div className="signatories-card-signature-container">
                  {!imageErrors[email] ? (
                    <img
                      onClick={() =>
                        document.getElementById(`file-upload-${email}`).click()
                      }
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

                <span className="signatories-card-name">
                  {selected?.id === user._id &&
                  selected?.key === "fullName" &&
                  selected?.index === index ? (
                    <div className="d-flex align-items-center">
                      <select
                        className="form-control form-control-sm"
                        style={{ maxWidth: 120 }}
                        value={selected.value}
                        onChange={(e) =>
                          setSelected({
                            ...selected,
                            value: e.target.value,
                          })
                        }
                      >
                        <option value="">Select name</option>
                        {heads.map(({ user }) => (
                          <option
                            key={user._id}
                            value={fullName(user.fullName)}
                          >
                            {fullName(user.fullName)}
                          </option>
                        ))}
                      </select>
                      <button
                        className="btn-icon ml-1 text-success"
                        onClick={() =>
                          handleUpdate({ ...user, fullName: selected.value })
                        }
                      >
                        ✓
                      </button>
                      <button
                        className="btn-icon ml-1 text-danger"
                        onClick={() => setSelected({})}
                      >
                        ✕
                      </button>
                    </div>
                  ) : (
                    <strong
                      onClick={() =>
                        setSelected({
                          id: user._id,
                          key: "fullName",
                          index, // store index to isolate editing
                          value: fullName(user.fullName),
                        })
                      }
                      style={{ cursor: "pointer" }}
                    >
                      {fullName(user.fullName)}
                    </strong>
                  )}
                </span>

                {/* <span className="signatories-card-name"> */}
                {/* {fullName(user.fullName)} */}
                {/* {selected?.key === fullName ? ( */}
                {/* <div style={{ width: "13rem" }}> */}
                {/* lol */}
                {/* <Input
                        _key={"value"}
                        className="mt-2 form-control form-control-sm"
                        type={type}
                        isSuccess={true}
                        selected={selected}
                        onChange={(key, val) =>
                          setSelected({ ...selected, [key]: val })
                        }
                        handleCheck={handleUpdate}
                        handleClose={() => setSelected({})}
                      /> */}
                {/* </div> */}
                {/* ) : ( */}
                {/* <strong */}
                {/* onClick={() => */}
                {/* handleSelected({ */}
                {/* // id: user, */}
                {/* fullName: user.fullName, */}
                {/* })
                      }
                    >
                      {fullName(user.fullName)}
                    </strong>
                  )}
                </span> */}
              </div>

              <div
                className={`signatories-card-footer ${prc || "requiredPRC"}`}
              >
                {prc ? (
                  <div className="signatories-card-expiration d-flex align-items-center">
                    {/* PRC ID */}
                    {selected?.id === user._id &&
                    selected?.key === "prcId" &&
                    selected?.index === index ? (
                      <div className="d-flex align-items-center">
                        <input
                          type="text"
                          className="form-control form-control-sm"
                          style={{ maxWidth: 80 }}
                          value={selected.value}
                          onChange={(e) =>
                            setSelected({ ...selected, value: e.target.value })
                          }
                        />
                        <button
                          className="btn-icon ml-1 text-success"
                          onClick={() =>
                            handleUpdate(user._id, "prcId", selected.value)
                          }
                        >
                          ✓
                        </button>
                        <button
                          className="btn-icon ml-1 text-danger"
                          onClick={() => setSelected({})}
                        >
                          ✕
                        </button>
                      </div>
                    ) : (
                      <strong
                        onClick={() =>
                          setSelected({
                            id: user._id,
                            key: "prcId",
                            index,
                            value: prc.id || "",
                          })
                        }
                        style={{ cursor: "pointer" }}
                      >
                        PRC ID: {prc.id || "—"}
                      </strong>
                    )}

                    <span>&nbsp;|&nbsp;</span>

                    {/* Expiration */}
                    {selected?.id === user._id &&
                    selected?.key === "prcTo" &&
                    selected?.index === index ? (
                      <div className="d-flex align-items-center">
                        <input
                          type="date"
                          className="form-control form-control-sm"
                          style={{ maxWidth: 140 }}
                          value={selected.value}
                          onChange={(e) =>
                            setSelected({ ...selected, value: e.target.value })
                          }
                        />
                        <button
                          className="btn-icon ml-1 text-success"
                          onClick={() =>
                            handleUpdate(user._id, "prcTo", selected.value)
                          }
                        >
                          ✓
                        </button>
                        <button
                          className="btn-icon ml-1 text-danger"
                          onClick={() => setSelected({})}
                        >
                          ✕
                        </button>
                      </div>
                    ) : (
                      <strong
                        onClick={() =>
                          setSelected({
                            id: user._id,
                            key: "prcTo",
                            index,
                            value: prc.to || "",
                          })
                        }
                        style={{ cursor: "pointer" }}
                      >
                        Expiration: {prc.to || "—"}
                      </strong>
                    )}
                  </div>
                ) : (
                  <span className="mt-2 small text-danger">
                    <strong>PRC license is required</strong> for this user to be
                    assigned as a head. This is a&nbsp;
                    <strong>DOH qualification</strong> for publishing laboratory
                    results.
                  </span>
                )}
              </div>

              {/* Optional Delete Button */}
              <div className="signatories-card-actionBtn">
                <button
                  className="signatories-card-btn-delete bg-danger"
                  onClick={() => handleDelete(_id)}
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
