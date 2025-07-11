import {
  MDBAnimation,
  MDBBadge,
  MDBBtn,
  MDBBtnGroup,
  MDBIcon,
  MDBTable,
} from "mdbreact";
import {
  dateFormat,
  ENDPOINT,
  fullName,
} from "../../../../../../../../../services/utilities";
import { useState } from "react";
import "./style.css";
import { HMO, Services } from "../../../../../../../../../services/fakeDb";
import Options from "./options";
import { useDispatch, useSelector } from "react-redux";
import {
  SetPROCESS,
  SetSELECTED,
  UPDATE,
} from "../../../../../../../../../services/redux/slices/commerce/pos/services/onBoardings";
import Swal from "sweetalert2";
const Validation = ({ item }) => {
  const { token, auth } = useSelector(({ auth }) => auth);
  const { pid, schedule, services = [], status } = item;
  const { healthCard } = pid;
  const [flipped, setFlipped] = useState(false);
  const dispatch = useDispatch();

  const customer = fullName(item?.pid?.fullName);

  const handleDeny = async () => {
    const { value: reason } = await Swal.fire({
      title: `${customer}`,
      input: "textarea",
      inputLabel: "Reason for denial",
      inputPlaceholder: "Enter your reason here...",
      inputAttributes: {
        "aria-label": "Reason",
      },
      showCancelButton: true,
      reverseButtons: true,
      confirmButtonText: "Submit",
      cancelButtonText: "Cancel",
      inputValidator: (value) => {
        if (!value) {
          return "You must provide a reason!";
        }
      },
    });

    if (reason) {
      dispatch(
        UPDATE({
          token,
          data: { ...item, reason, status: "denied" },
        })
      );
      Swal.fire({
        icon: "success",
        title: "Request Denied",
        html: `The action for <b>${customer}</b> has been saved successfully.`,
      });
    }
  };

  const handleApprove = () => {
    Swal.fire({
      title: "Are you sure?",
      html: `Do you really want to <b>approve</b> the patient <strong>${customer}</strong>?`,
      icon: "question",
      showCancelButton: true,
      confirmButtonColor: "#16a34a", // green-600
      cancelButtonColor: "#d33",
      confirmButtonText: "Yes, approve",
      cancelButtonText: "Cancel",
      reverseButtons: true,
    }).then((result) => {
      if (result.isConfirmed) {
        dispatch(
          UPDATE({
            token,
            data: {
              ...item,
              status: "approved",
              verifiedBy: {
                verifiedAt: new Date().toLocaleDateString(),
                eid: auth._id,
              },
            },
          })
        );
        Swal.fire({
          title: "Approved!",
          html: `The patient <strong>${customer}</strong> has been approved successfully.`,
          icon: "success",
          confirmButtonColor: "#16a34a",
        });
      }
    });
  };
  const isTranslated = services.length > 0;
  const isApproved = status === "approved";
  return (
    <>
      <MDBTable>
        <thead>
          <tr>
            <th>Request Form</th>
            {isTranslated && <th>Services</th>}
            <th>Health Card / Valid ID</th>
          </tr>
        </thead>
        <tbody>
          <tr>
            <td>
              <div style={{ position: "relative", display: "inline-block" }}>
                {/* Orange Badge */}
                {isTranslated && (
                  <div
                    style={{
                      position: "absolute",
                      top: 0,
                      right: 0,
                      width: "35px",
                      height: "35px",
                      backgroundColor: "#f59e0b",
                      color: "white",
                      fontSize: "16px",
                      fontWeight: "bold",
                      borderBottomLeftRadius: "100%",
                      display: "flex",
                      alignItems: "center",
                      justifyContent: "center",
                      boxShadow: "0 2px 4px rgba(0,0,0,0.2)",
                    }}
                  >
                    <MDBIcon
                      icon="check"
                      className="mt-n1 mr-n1"
                      style={{ fontSize: "16px", lineHeight: "1" }}
                    />
                  </div>
                )}

                {/* Image */}
                <img
                  onClick={() => dispatch(SetSELECTED(item))}
                  src={`${ENDPOINT}/public/users/${pid.email}/booking/form-${schedule}.png`}
                  height={"550px"}
                  title="Double click to translate request"
                  className="shadow-sm cursor-pointer"
                  alt="request form"
                />
              </div>
            </td>
            {isTranslated && (
              <td>
                {services?.map((id) => (
                  <MDBBadge color="primary" className="mr-1" key={id}>
                    {Services.getAbbr(id)}
                  </MDBBadge>
                ))}
              </td>
            )}

            <td>
              <div style={{ position: "relative", display: "inline-block" }}>
                {/* Image Flip Container */}
                <div
                  style={{
                    perspective: "1000px",
                    width: "400px",
                    height: "230px",
                    position: "relative",
                    borderRadius: "8px",
                    marginBottom: "10px",
                  }}
                >
                  {/* Flip Wrapper */}
                  <div
                    className={`flip-wrapper ${flipped ? "flipped-id" : ""}`}
                    style={{
                      width: "100%",
                      height: "100%",
                      position: "relative",
                      transition: "transform 0.6s",
                      transformStyle: "preserve-3d",
                    }}
                  >
                    {/* Front Image */}
                    <div
                      style={{
                        position: "absolute",
                        width: "100%",
                        height: "100%",
                        backfaceVisibility: "hidden",
                      }}
                    >
                      <img
                        src={`${ENDPOINT}/public/users/${pid.email}/portfolio/${healthCard.name}-front.png`}
                        alt="Front"
                        className="shadow-lg"
                        style={{
                          width: "100%",
                          height: "100%",
                          borderRadius: "8px",
                        }}
                      />
                    </div>

                    {/* Back Image */}
                    <div
                      style={{
                        position: "absolute",
                        width: "100%",
                        height: "100%",
                        transform: "rotateY(180deg)",
                        backfaceVisibility: "hidden",
                      }}
                    >
                      <img
                        src={`${ENDPOINT}/public/users/${pid.email}/portfolio/${healthCard.name}-back.png`}
                        alt="Back"
                        className="shadow-lg"
                        style={{
                          width: "100%",
                          height: "100%",
                          borderRadius: "8px",
                        }}
                      />
                    </div>
                  </div>

                  {/* Flip Button */}
                  <MDBBtn
                    size="sm"
                    color="light"
                    className="position-absolute"
                    style={{
                      bottom: "-2px",
                      right: "5px",
                      zIndex: 10,
                    }}
                    onClick={() => setFlipped((prev) => !prev)}
                  >
                    <MDBIcon fas icon="exchange-alt" />
                  </MDBBtn>
                  <Options />
                </div>
              </div>

              <div
                className="d-flex justify-content-between"
                style={{
                  width: "400px",
                  fontSize: "0.9rem",
                  lineHeight: "1.4",
                }}
              >
                <div title={HMO.getName(healthCard.name)}>
                  {healthCard?.name?.toUpperCase()}
                </div>
                <div>
                  <strong>{healthCard.id || "N/A"}</strong>
                </div>
                <div>
                  <strong> {dateFormat(healthCard.expiry)}</strong>
                </div>
              </div>
              <div
                className="mt-3"
                style={{ position: "relative", display: "inline-block" }}
              >
                {/* Image Flip Container */}
                <div
                  style={{
                    perspective: "1000px",
                    width: "400px",
                    height: "230px",
                    position: "relative",
                    borderRadius: "8px",
                    marginBottom: "10px",
                  }}
                >
                  {/* Flip Wrapper */}
                  <div
                    className={`flip-wrapper ${flipped ? "flipped-id" : ""}`}
                    style={{
                      width: "100%",
                      height: "100%",
                      position: "relative",
                      transition: "transform 0.6s",
                      transformStyle: "preserve-3d",
                    }}
                  >
                    {/* Front Image */}
                    <div
                      style={{
                        position: "absolute",
                        width: "100%",
                        height: "100%",
                        backfaceVisibility: "hidden",
                      }}
                    >
                      <img
                        src={`${ENDPOINT}/public/users/${pid.email}/portfolio/${healthCard.name}-front.png`}
                        alt="Front"
                        className="shadow-lg"
                        style={{
                          width: "100%",
                          height: "100%",
                          borderRadius: "8px",
                        }}
                      />
                    </div>

                    {/* Back Image */}
                    <div
                      style={{
                        position: "absolute",
                        width: "100%",
                        height: "100%",
                        transform: "rotateY(180deg)",
                        backfaceVisibility: "hidden",
                      }}
                    >
                      <img
                        src={`${ENDPOINT}/public/users/${pid.email}/portfolio/${healthCard.name}-back.png`}
                        alt="Back"
                        className="shadow-lg"
                        style={{
                          width: "100%",
                          height: "100%",
                          borderRadius: "8px",
                        }}
                      />
                    </div>
                  </div>

                  {/* Flip Button */}
                  <MDBBtn
                    size="sm"
                    color="light"
                    className="position-absolute"
                    style={{
                      bottom: "-2px",
                      right: "5px",
                      zIndex: 10,
                    }}
                    onClick={() => setFlipped((prev) => !prev)}
                  >
                    <MDBIcon fas icon="exchange-alt" />
                  </MDBBtn>
                  <Options />
                </div>
              </div>

              <div
                className="d-flex justify-content-between"
                style={{
                  width: "400px",
                  fontSize: "0.9rem",
                  lineHeight: "1.4",
                }}
              >
                <div title={HMO.getName(healthCard.name)}>
                  {healthCard?.name?.toUpperCase()}
                </div>
                <div>
                  <strong>{healthCard.id || "N/A"}</strong>
                </div>
                <div>
                  <strong> {dateFormat(healthCard.expiry)}</strong>
                </div>
              </div>
            </td>
          </tr>
        </tbody>
      </MDBTable>
      <div className="d-flex justify-content-center mt-n4 mb-1">
        <MDBBtnGroup>
          {!isApproved ? (
            <>
              <MDBBtn color="danger" rounded onClick={handleDeny}>
                Deny
              </MDBBtn>
              <MDBBtn color="primary" rounded onClick={handleApprove}>
                Approve
              </MDBBtn>
            </>
          ) : (
            <MDBBtn
              rounded
              color="primary"
              onClick={() => dispatch(SetPROCESS(item))}
            >
              Process
            </MDBBtn>
          )}
        </MDBBtnGroup>
      </div>
    </>
  );
};

export default Validation;
