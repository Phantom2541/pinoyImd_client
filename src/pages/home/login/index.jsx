import React, { useEffect, useState } from "react";
import {
  MDBBtn,
  MDBIcon,
  MDBInput,
  MDBModal,
  MDBModalBody,
  MDBModalHeader,
} from "mdbreact";
import { useHistory, useLocation } from "react-router";
import { useDispatch, useSelector } from "react-redux";
import {
  LOGIN,
  RESET,
} from "../../../services/redux/slices/assets/persons/auth";
import { Logo } from "../../../services/utilities";
export default function Login({ show, toggle = null }) {
  const {
      activePlatform,
      auth,
      email,
      isLoading,
      loginSuccess,
      message,
      image,
      isOnline,
    } = useSelector(({ auth }) => auth),
    [isLocked, setIsLocked] = useState(true),
    history = useHistory(),
    location = useLocation(),
    dispatch = useDispatch();

  const handleSubmit = (e) => {
    e.preventDefault();

    const { address, password } = e.target;

    dispatch(
      LOGIN({
        email: email || address.value,
        password: password.value,
      })
    );
  };

  useEffect(() => {
    if (auth._id && loginSuccess) {
      if (activePlatform) {
        history.push(
          `/${activePlatform?.platform?.toLowerCase() || "patron"}/${
            ["manager", "headquarter"].includes(
              activePlatform?.platform?.toLowerCase()
            )
              ? "dashboard"
              : "bulletin"
          }`
        );
      } else {
        history.push(`/patron/bulletin`);
      }
      dispatch(RESET());
    }
  }, [auth, loginSuccess, history, location, dispatch, activePlatform]);

  const handleBody = () => {
    return (
      <>
        {email ? (
          <div className="text-center">{email}</div>
        ) : (
          <MDBInput
            label="E-mail Address"
            type="email"
            icon="envelope"
            name="address"
            disabled={isLoading}
            required
          />
        )}
        {isOnline ? (
          <MDBInput
            disabled={isLoading}
            label="Password"
            name="password"
            minLength={8}
            icon={isLocked ? "lock" : "unlock"}
            onIconMouseEnter={() => setIsLocked(false)}
            onIconMouseLeave={() => setIsLocked(true)}
            type={isLocked ? "password" : "text"}
            required
          />
        ) : (
          <div className="alert alert-warning text-center">
            You have no Internet Connection.
          </div>
        )}
      </>
    );
  };
  return (
    <MDBModal
      size={email ? "sm" : "md"}
      isOpen={show}
      backdrop={true}
      cascading
      toggle={() => {}}
      // disableFocusTrap={false}
      className={`${email && "modal-avatar"}`}
    >
      <MDBModalHeader
        // style={{ width: "100px", height: "100px" }}
        toggle={email ? null : toggle}
        className={`${email ? "mx-auto" : "light-blue darken-3 white-text"}`}
      >
        {auth ? (
          <img
            loading="eager"
            className="rounded-circle"
            src={image}
            style={{
              width: "100px",
              height: "100px",
              objectFit: "contain",
              borderRadius: image === Logo ? "50%" : "0px",
            }}
            onError={(e) => (e.target.src = Logo)}
            alt={`avatar-${auth._id}`}
          />
        ) : (
          "Login"
        )}
      </MDBModalHeader>
      <MDBModalBody className="mb-0">
        <form onSubmit={handleSubmit}>
          {handleBody()}

          {message && (
            <div
              className={`alert alert-${
                loginSuccess ? "success" : "warning"
              } text-center`}
            >
              {message}
            </div>
          )}

          <div
            className={`text-center mb-1-half ${
              email && "d-flex justify-content-between"
            }`}
          >
            {email && (
              <MDBBtn
                disabled={isLoading}
                onClick={() => {
                  localStorage.clear();
                  window.location.reload();
                }}
                size="sm"
                rounded
                type="button"
              >
                logout
              </MDBBtn>
            )}
            <MDBBtn
              disabled={!isOnline || isLoading}
              size={email ? "sm" : "md"}
              type="submit"
              color="info"
              className="mb-2"
              rounded
            >
              {isLoading ? (
                <MDBIcon icon="spinner" pulse />
              ) : email ? (
                "proceed"
              ) : (
                "Sign in"
              )}
            </MDBBtn>
          </div>
        </form>
      </MDBModalBody>
    </MDBModal>
  );
}
