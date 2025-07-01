import React, { useState, useEffect } from "react";
import { useDispatch, useSelector } from "react-redux";
import { DESTROY } from "../../../../../services/redux/slices/assets/persons/heads";
import { useToasts } from "react-toast-notifications";
import { fullName, ENDPOINT } from "../../../../../services/utilities";
import Swal from "sweetalert2";
import { MDBBtn, MDBIcon } from "mdbreact";
import "./style.css";

export default function Body() {
  const { token } = useSelector(({ auth }) => auth),
    { collections, message, isSuccess } = useSelector(({ heads }) => heads),
    [heads, setHeads] = useState([]),
    { addToast } = useToasts(),
    dispatch = useDispatch(),
    [currentPage, setCurrentPage] = useState(1),
    itemsPerPage = 6,
    [animateClass, setAnimateClass] = useState("");

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
                <img
                  src={`${ENDPOINT}/public/users/${email}/profile.jpg`}
                  alt="Profile"
                  // onError={(e) => {
                  //   e.target.onerror = null;
                  //   e.target.src =
                  //     "https://via.placeholder.com/100x100?text=No+Image";
                  // }}
                  className="signatories-profile-image"
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
                  {fullName(user.fullName)}
                </span>
              </div>

              <div
                className={`signatories-card-footer ${prc || "requiredPRC"}`}
              >
                {prc ? (
                  <span className="signatories-card-expiration">
                    PRC ID: <strong>{prc?.id}</strong>
                    {prc?.to ? (
                      <>
                        <span>&nbsp;|&nbsp;</span>
                        <span
                          className={
                            new Date(prc.to) < new Date() ? "text-danger" : ""
                          }
                        >
                          Expiration: <strong>{prc.to}</strong>
                        </span>
                      </>
                    ) : (
                      <>
                        <span>&nbsp;|&nbsp;</span>
                        <strong className="text-warning">
                          No expiration date set
                        </strong>
                      </>
                    )}
                  </span>
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
                  <MDBIcon icon="trash" />
                </button>
                <button
                  className="signatories-card-btn-edit bg-primary"
                  onClick={() => handleDelete(_id)}
                >
                  <MDBIcon icon="pencil-alt" />
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
