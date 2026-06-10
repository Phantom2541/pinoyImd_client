import { useState } from "react";
import {
  MDBBtn,
  MDBCard,
  MDBCardBody,
  MDBCollapse,
  MDBCollapseHeader,
  MDBContainer,
} from "mdbreact";
import { useDispatch, useSelector } from "react-redux";
import {
  collapse,
  employment,
  fullName,
} from "../../../../../../services/utilities";
import CollapseTable from "./table";
import { Policy } from "../../../../../../services/fakeDb";
import { UPDATE } from "../../../../../../services/redux/slices/assets/persons/personnels";
import { capitalize } from "lodash";
import EditableSelect from "../../../../../../components/customizable/editableSelect";
import Swal from "sweetalert2";
import CharacterHistory from "./characterHistory";
export default function MenuCollapse({ staffs }) {
  const { token } = useSelector(({ auth }) => auth),
    { formSubmitted, isSuccess } = useSelector(({ personnels }) => personnels),
    [activeId, setActiveId] = useState(-1),
    [didHoverId, setDidHoverId] = useState(-1),
    dispatch = useDispatch();

  const onSubmit = (data) => {
    dispatch(
      UPDATE({
        data: {
          _id: data._id,
          contract: {
            hos: data.employmentHor,
            soe: data.employmentSoe,
            pc: data.employmentPc,
            designation: data.employmentDesignation,
          },
          rate: {
            monthly: data.rateMonthly,
            cola: data.rateCola,
            daily: data.rateDaily,
            incentive: data.incentive,
          },
          contribution: {
            ph: data.contributionPh,
            pi: data.contributionPi,
            sss: data.contributionSss,
          },
        },
        token,
      })
    );
  };

  const handleUpdate = (data) => {
    const { abbr, _id, staff, remarks } = data;
    if (employment.needReason(abbr)) {
      const status = employment.getName(abbr);
      Swal.fire({
        html: `Are you sure you want to ${status} <b>${staff}</b>?`,
        input: "textarea",
        inputLabel: "Please provide a reason ",
        inputPlaceholder: "Type your reason here...",
        inputAttributes: {
          "aria-label": "Reason for suspension",
        },
        inputValidator: (value) => {
          if (!value) {
            return "You need to provide a reason before proceeding.";
          }
          return null;
        },
        icon: "warning",
        showCancelButton: true,
        confirmButtonColor: "#e69500",
        cancelButtonColor: "#d33",
        confirmButtonText: `Yes, ${status}`,
      }).then((result) => {
        if (result.isConfirmed) {
          const reason = result.value;
          const _remarks = [...remarks];
          _remarks.push({ title: status, reason, createdAt: new Date() });
          dispatch(
            UPDATE({ token, data: { status: abbr, _id, remarks: _remarks } })
          ).then(() => {
            Swal.fire({
              title: `${status}!`,
              text: `${staff} has been ${status}.`,
              icon: "success",
            });
          });
        }
      });
    } else {
      dispatch(UPDATE({ token, data: { status: abbr, _id } }));
    }
  };

  return (
    <MDBContainer
      style={{
        minHeight: "300px",
      }}
      fluid
    >
      {staffs?.length > 0 ? (
        staffs.map((staff, index) => {
          const {
            user,
            contract,
            status,
            rate,
            contribution,
            _id,
            remarks = [],
          } = staff;
          const department = Policy.getDepartment(
            Number(contract?.designation)
          );
          const { color, border } = collapse.getStyle(
            index,
            activeId,
            didHoverId
          );
          const isOpen = activeId === index;
          const viewHistory = didHoverId === index;
          return (
            <MDBCard
              key={`staffs-${index}`}
              style={{ boxShadow: "0px 0px 0px 0px", backgroundColor: "white" }}
            >
              <MDBCollapseHeader
                onMouseLeave={() => setDidHoverId(-1)}
                onMouseEnter={() => setDidHoverId(index)}
                className={border}
                style={{ borderRadius: "50%" }}
              >
                <div
                  className={`d-flex align-items-center justify-content-between ${color}`}
                >
                  <div className="position-relative ">
                    <span>
                      <small> {index + 1}</small>.{" "}
                      {user && `${fullName(user?.fullName)} | `}
                      {contract?.designation && `${department}`}
                    </span>
                    {viewHistory && (
                      <div
                        className="shadow-sm border border-gray"
                        style={{
                          position: "absolute",
                          top: "100%", // ⬅️ always below the span
                          left: "1rem",
                          marginTop: "0rem", // spacing from the name
                          width: "25rem",
                          zIndex: 10,
                          backgroundColor: "#fff",
                          borderRadius: "0.5rem",
                          padding: "1rem",
                          display: remarks.length > 0 ? "block" : "none",
                        }}
                      >
                        <CharacterHistory remarks={remarks} />
                      </div>
                    )}
                  </div>

                  <div className="d-flex align-items-center">
                    <div
                      className="d-flex align-items-center"
                      style={{ minWidth: "100px" }}
                    >
                      <span
                        className="rounded-circle shadow-sm mr-2 "
                        style={{
                          backgroundColor: employment.isEmployed(status)
                            ? "#ffc107"
                            : "#dc3545", // green or red
                          width: "0.65rem",
                          height: "0.65rem",
                          display: "inline-block",
                          position: "relative",
                          top: "0",
                          boxShadow: "0 0 4px rgba(0, 0, 0, 0.2)",
                        }}
                      />
                      <EditableSelect
                        collections={employment.collections}
                        keyForValue="abbr"
                        keyForText="name"
                        className="m-0 p-0"
                        inputClassName="m-0 p-0"
                        isEditable
                        formSubmitted={formSubmitted}
                        preValue={status}
                        isSuccess={isSuccess}
                        fieldData={{
                          name: capitalize(employment.getName(status)),
                          abbr: status,
                          _id,
                        }}
                        onSave={(data) =>
                          handleUpdate({
                            ...data,
                            staff: fullName(user?.fullName),
                            remarks,
                          })
                        }
                      />
                    </div>
                    <div>
                      <MDBBtn
                        size="sm"
                        color="white"
                        title="View Details"
                        rounded
                        onClick={() =>
                          setActiveId((prev) => (prev === index ? -1 : index))
                        }
                        className="m-0 p-0 transition-all ml-4 "
                        style={{
                          width: isOpen ? "1.5rem" : "2rem",
                          height: "1.4rem",
                        }}
                      >
                        <i
                          style={{ rotate: `${isOpen ? 0 : 90}deg` }}
                          className="fa fa-angle-down transition-all "
                        />
                      </MDBBtn>
                    </div>
                  </div>
                </div>
              </MDBCollapseHeader>
              <MDBCollapse
                id={`collapse-${index}`}
                className="mb-2 border border-black"
                isOpen={index === activeId}
              >
                <MDBCardBody className="pt-2 m-0 p-1 mx-1">
                  <CollapseTable
                    employment={contract}
                    staff={staff}
                    rate={rate}
                    contribution={contribution}
                    _id={_id}
                    onSubmit={onSubmit} // Updated to pass handleSubmit as onSubmit
                  />
                </MDBCardBody>
              </MDBCollapse>
            </MDBCard>
          );
        })
      ) : (
        <h6 className="text-center fw-bold">
          No staffs found. try another keywords
        </h6>
      )}
    </MDBContainer>
  );
}
