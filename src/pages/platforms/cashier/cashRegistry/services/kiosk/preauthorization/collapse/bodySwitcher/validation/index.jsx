import { MDBBadge, MDBBtn, MDBBtnGroup, MDBTable } from "mdbreact";
import {
  Cloudinary,
  fullName,
} from "../../../../../../../../../../services/utilities";
import "./style.css";
import { HMO, Services } from "../../../../../../../../../../services/fakeDb";
import { useDispatch, useSelector } from "react-redux";
import {
  SetPROCESS,
  SetSELECTED,
  SetVALIDATE_ID,
  UPDATE,
  RESET,
} from "../../../../../../../../../../services/redux/slices/commerce/pos/services/onBoardings";
import { SetSELECTED as SetKIOSK } from "../../../../../../../../../../services/redux/slices/commerce/pos/services/kiosk";
import Swal from "sweetalert2";
import Badge from "../../../../ID/badge";
import { VALIDATE_ID } from "../../../../../../../../../../services/redux/slices/assets/persons/users";
import ID from "../../../../ID";
const Validation = ({ item }) => {
  const { token, auth } = useSelector(({ auth }) => auth);
  const {
    pid,
    schedule,
    requirements = {},
    services = [],
    status,
    cancelled = [],
    haveCard = null,
    isWalkin = false,
  } = item;
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
        ).then(() => dispatch(RESET()));
        Swal.fire({
          title: "Approved!",
          html: `The patient <strong>${customer}</strong> has been approved successfully.`,
          icon: "success",
          confirmButtonColor: "#16a34a",
        });
      }
    });
  };

  const handleValidateID = (isValid, cardType) => {
    const customer = fullName(pid.fullName);
    const cardLabel = cardType === "healthCard" ? "Health Card" : "Valid ID";
    const statusText = isValid ? "VALID" : "INVALID";
    const statusColor = isValid ? "green" : "red";

    Swal.fire({
      title: `<span style="font-size: 1.1rem">Confirm ID Validation</span>`,
      html: `
      <p style="margin-top: 10px; font-size: 0.95rem;">
        Are you sure you want to mark the ID of 
        <strong style="color: #3b82f6;">${customer}</strong> 
        as <strong style="color: ${statusColor};">${statusText}</strong>?
      </p>
      <p style="margin-top: 6px; font-size: 0.9rem;">
        This will update the status of their <strong>${cardLabel}</strong> accordingly.
      </p>
    `,
      icon: "question",
      showCancelButton: true,
      confirmButtonColor: "#16a34a",
      cancelButtonColor: "#d33",
      confirmButtonText: `Yes, mark as ${statusText}`,
      cancelButtonText: "Cancel",
    }).then((result) => {
      if (result.isConfirmed) {
        dispatch(
          VALIDATE_ID({ data: { cardType, isValid, _id: pid?._id } })
        ).then((action) => {
          const { payload } = action.payload;
          dispatch(SetVALIDATE_ID(payload));
        });

        Swal.fire({
          icon: "success",
          title: "ID Status Updated",
          html: `
          <p style="font-size: 0.95rem;">
            The <strong>${cardLabel}</strong> of 
            <strong style="color: #3b82f6;">${customer}</strong> 
            has been marked as 
            <strong style="color: ${statusColor};">${statusText}</strong>.
          </p>
        `,
          confirmButtonColor: "#16a34a",
        });
      }
    });
  };

  const isTranslated = services.length > 0;
  const isApproved = status === "approved";
  const isDone = status === "done";

  return (
    <div>
      <MDBTable>
        <thead>
          <tr>
            {!isWalkin && <th className="text-center">Request Form</th>}
            {isWalkin && <th>Health Card</th>}
            {isTranslated && <th className="text-center">Services</th>}
            {haveCard && !isWalkin && (
              <th className="text-center">Health Card / Valid ID</th>
            )}
          </tr>
        </thead>
        <tbody>
          <tr>
            {!isWalkin && (
              <td className="text-center">
                <div style={{ position: "relative", display: "inline-block" }}>
                  <Badge isCompleted={isTranslated} radius={false} />
                  {/* Image */}
                  <img
                    onClick={
                      !isDone
                        ? () => dispatch(SetSELECTED(item))
                        : () => console.log("done")
                    }
                    src={`${Cloudinary.getEndpoint()}/${
                      requirements?.rfId
                    }/users/${pid.email}/booking/form-${schedule}.png`}
                    height={"550px"}
                    title="Double click to translate request"
                    className="shadow-sm cursor-pointer"
                    alt="request form"
                  />
                </div>
              </td>
            )}
            {isWalkin && (
              <td>
                <div className="mb-2" style={{ fontSize: "1rem" }}>
                  <span className="font-weight-bold text-muted mr-2">
                    Company:
                  </span>
                  <span>{HMO.getName(requirements?.hmo)}</span>
                </div>
                <div style={{ fontSize: "1rem" }}>
                  <span className="font-weight-bold text-muted mr-2">
                    Card ID:
                  </span>
                  <span>{requirements?.cardId}</span>
                </div>
              </td>
            )}
            {isTranslated && (
              <td className="text-center">
                {services?.map((id) => {
                  const notProcess = cancelled.includes(id);
                  return (
                    <MDBBadge
                      color={
                        !notProcess && status === "done" ? "light" : "primary"
                      }
                      className="mr-2"
                      key={id}
                    >
                      <span
                        title={
                          status === "done" &&
                          `${
                            notProcess ? "Not Approved" : "Completed"
                          } \n ${Services.getName(id)}`
                        }
                        style={{
                          fontSize: "0.8rem",
                          ...(!notProcess &&
                            status === "done" && {
                              textDecoration: "line-through",
                              textDecorationThickness: "3px", // thicker line
                              textDecorationColor: "gray",
                            }),
                        }}
                      >
                        {Services.getAbbr(id)}
                      </span>
                    </MDBBadge>
                  );
                })}
              </td>
            )}

            {haveCard && !isWalkin && (
              <td>
                <div
                  className="d-flex flex-column align-items-center justify-content-center"
                  style={{ width: "100%" }}
                >
                  <ID
                    handleValidateID={handleValidateID}
                    cardType={"healthCard"}
                    pid={pid}
                  />
                  <ID
                    handleValidateID={handleValidateID}
                    cardType={"validID"}
                    className="mt-3"
                    pid={pid}
                  />
                </div>
              </td>
            )}
          </tr>
        </tbody>
      </MDBTable>
      {!isDone && (
        <div className="d-flex justify-content-center mt-n4 mb-1">
          <MDBBtnGroup>
            {!isApproved ? (
              <>
                <MDBBtn color="danger" rounded onClick={handleDeny} size="sm">
                  Deny
                </MDBBtn>
                <MDBBtn
                  color="primary"
                  rounded
                  // onClick={handleApprove}
                  onClick={() =>
                    dispatch(
                      SetKIOSK({
                        data: item,
                        isSendOut: false,
                        isAuthorization: true,
                      })
                    )
                  }
                  size="sm"
                >
                  For Process
                </MDBBtn>
              </>
            ) : (
              <MDBBtn
                size="sm"
                rounded
                color="primary"
                onClick={() =>
                  dispatch(SetPROCESS({ ...item, isValidation: true }))
                }
              >
                Process
              </MDBBtn>
            )}
          </MDBBtnGroup>
        </div>
      )}
    </div>
  );
};

export default Validation;
