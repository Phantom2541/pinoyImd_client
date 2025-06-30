import React, { useState, useEffect } from "react";
import { useDispatch, useSelector } from "react-redux";
import { DESTROY } from "../../../../../services/redux/slices/assets/persons/heads";
import { useToasts } from "react-toast-notifications";
import { fullName, ENDPOINT } from "../../../../../services/utilities";
import Swal from "sweetalert2";
import { MDBBtn, MDBIcon } from "mdbreact";

export default function Body() {
  const { token } = useSelector(({ auth }) => auth),
    { collections, message, isSuccess } = useSelector(({ heads }) => heads),
    [heads, setHeads] = useState([]),
    { addToast } = useToasts(),
    dispatch = useDispatch();

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

  const handleImageError = (email) =>
    setImageErrors((prev) => ({ ...prev, [email]: true }));

  return (
    <div className="container mt-4">
      {heads.map(({ _id, department, section, user }, index) => {
        const { email } = user;

        return (
          <div
            key={_id || index}
            className="d-flex align-items-center border rounded p-3 mb-3 shadow-sm"
            style={{ backgroundColor: "#fff", maxWidth: 600 }}
          >
            {/* Left: Profile Image */}
            <div className="me-3">
              <img
                src={`${ENDPOINT}/public/users/${email}/profile.jpg`}
                alt="Profile"
                // onError={(e) => {
                //   e.target.onerror = null;
                //   e.target.src =
                //     "https://via.placeholder.com/100x100?text=No+Image";
                // }}
                style={{
                  width: 100,
                  height: 100,
                  objectFit: "cover",
                  borderRadius: "8px",
                  filter: "grayscale(100%)",
                }}
              />
            </div>

            {/* Right: Info */}
            <div className="flex-grow-1">
              <h6 className="text-muted mb-1">
                {section} - {department}
              </h6>

              {/* Signature */}
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
                  style={{ height: 40, cursor: "pointer" }}
                />
              ) : (
                <MDBBtn
                  size="sm"
                  color="warning"
                  rounded
                  onClick={() =>
                    document.getElementById(`file-upload-${email}`).click()
                  }
                >
                  <MDBIcon icon="upload" /> Upload Signature
                </MDBBtn>
              )}
              <input
                id={`file-upload-${email}`}
                type="file"
                accept="image/png"
                style={{ display: "none" }}
                onChange={(e) => handleSignature(e, email)}
              />
              <h5 className="fw-bold text-capitalize mb-2">
                {fullName(user.fullName)}
              </h5>
              {/* PRC Info */}
              {user?.prc && (
                <p className="mt-2 small text-secondary">
                  PRC ID: <strong>{user.prc?.id}</strong> | Expiration:{" "}
                  <strong>{user.prc?.to}</strong>
                </p>
              )}
            </div>

            {/* Optional Delete Button */}
            <div className="ms-2">
              <MDBBtn
                size="sm"
                color="danger"
                onClick={() => handleDelete(_id)}
              >
                <MDBIcon icon="trash" />
              </MDBBtn>
            </div>
          </div>
        );
      })}
    </div>
  );
}
