import React, { useEffect, useState } from "react";
import {
  MDBBtn,
  MDBModal,
  MDBModalHeader,
  MDBModalBody,
  MDBModalFooter,
  MDBRow,
  MDBCol,
  MDBIcon,
} from "mdbreact";
import { useDispatch, useSelector } from "react-redux";
import {
  SAVE,
  APPLICATION,
} from "../../../../../../../services/redux/slices/assets/persons/personnels.js";

import { Policy } from "../../../../../../../services/fakeDb/index.js";
import { UPLOAD } from "../../../../../../../services/redux/slices/assets/persons/auth.js";
import Swal from "sweetalert2";

export default function ApplicationModal({
  visibility,
  setVisibility,
  company,
}) {
  const { auth, token } = useSelector(({ auth }) => auth),
    { collections, formSubmitted, isSuccess } = useSelector(
      ({ personnels }) => personnels
    ),
    [application, setApplication] = useState({}),
    [file201Preview, setFile201Preview] = useState({}),
    [department, setDepartment] = useState(),
    [positions, setPositions] = useState([]),
    dispatch = useDispatch();

  useEffect(() => {
    if (isSuccess && !formSubmitted) {
      setVisibility(false);
      Swal.fire({
        icon: "success",
        title: "Application Submitted",
        text: "You have successfully submitted your requirements. Please wait while we review and approve your application.",
        confirmButtonText: "OK",
        confirmButtonColor: "#3085d6",
      });
    }
  }, [isSuccess, formSubmitted]);
  useEffect(() => {
    if (visibility) {
      setApplication({});
      setFile201Preview({});
    }
  }, [visibility]);
  useEffect(() => {
    token &&
      visibility &&
      dispatch(
        APPLICATION({
          data: {
            _id: auth._id,
            key: "",
          },
          token,
        })
      );
  }, [dispatch, token, auth, visibility]);

  //console.log("unused variable setPositions", setPositions);

  const handleToggle = () => setVisibility(!visibility);

  const handleApplication = (e) => {
    e.preventDefault();
    if (!!company.branches.length) {
      // console.log({
      //   userId: auth._id,
      //   ...application,
      // });
    } else {
      // toast.warn("Sorry, there are no available branches for this company.");
      alert("Sorry, there are no available branches for this company.");
    }
  };

  const handleDepartment = ({ value }) => {
    setDepartment(value);
    setPositions(Policy.getPositionsByDepartmentName(value));
  };

  const handleChange = (e) => {
    const { name, value } = e.target;
    setApplication({
      ...application,
      [name]: value,
    });
  };

  const handleFile = (e, name) => {
    const file = e.target.files[0];
    if (!file) return;
    if (
      file.type !== "application/pdf" &&
      !file.name.toLowerCase().endsWith(".pdf")
    ) {
      alert("Only PDF files are allowed.");
      return;
    }
    const reader = new FileReader();

    reader.onload = () => {
      const base64 = reader.result.split(",")[1]; // Get only the base64 part
      setApplication((prev) => ({
        ...prev,
        file201: {
          ...prev.file201,
          [name]: base64,
        },
      }));

      setFile201Preview((prev) => ({ ...prev, [name]: reader.result }));
    };

    reader.readAsDataURL(file);
  };
  const handleSubmit = (e) => {
    e.preventDefault();
    const _company = company?.branches.find(
      (branch) => branch._id === application?.branchId
    );
    const id = `${_company?.displayname
      .split(" ")
      .map((word) => word[0])
      .join("")}-${_company?.name
      .split(" ")
      .map((word) => word[0])
      .join("")}-${Math.floor(Math.random() * 100)}`;

    const { file201 = {} } = application;
    const { DataSheet = "", Resume = "", AppLetter = "" } = file201;
    //save file201 pdfs
    Object.entries(file201)?.forEach(([key, value]) => {
      dispatch(
        UPLOAD({
          data: {
            path: `users/${auth.email}/credentials${
              key !== "dataSheet" ? `/${company.name}` : ""
            }`,
            base64: value,
            name: `${key}.pdf`,
          },
          token,
        })
      );
    });
    dispatch(
      SAVE({
        data: {
          id,
          user: auth._id,
          status: "petition",
          branch: application.branchId,
          file201: {
            hasPds: DataSheet ? true : false,
            hasResume: Resume ? true : false,
            hasLetter: AppLetter ? true : false,
          },
          contract: {
            designation: application.designation,
            hos: 8,
          },
          platform: "Patron",
          message: application.message,
        },
        token,
      })
    );
  };
  const PDF_VIEWER = (path) => {
    if (!file201Preview[path]) return "";

    return (
      <>
        <iframe
          src={file201Preview[path]}
          alt={auth.email}
          className="mx-auto rounded img-max img-fluid mb-1"
          // onError={(e) => (e.target.src = PresetUser)}
          title="Personal Data"
          style={{
            width: "100%",
            height: "300px",
            border: "1px solid #ccc",
            borderRadius: "10px",
            boxShadow: "0 4px 12px rgba(0, 0, 0, 0.1)",
            display: "block",
            margin: "auto",
          }}
        />
      </>
    );
  };

  const sortByAscending = (array, key) => {
    return [...array].sort((a, b) =>
      String(a[key]).localeCompare(String(b[key]))
    );
  };
  return (
    <MDBModal size="xl" isOpen={visibility} toggle={setVisibility} backdrop>
      <MDBModalHeader
        toggle={() => handleToggle()}
        className="light-blue darken-3 white-text"
      >
        <h3 style={{ fontWeight: 200 }}>
          <span style={{ fontWeight: 400 }}>{company.name}'s</span> Application
          Requirements
        </h3>
        {/* <MDBBtn className="btn btn-sm" color="danger" onClick={handleToggle}>
          <MDBIcon icon="times" size="lg" />
        </MDBBtn> */}
      </MDBModalHeader>
      <form onSubmit={handleSubmit}>
        <MDBModalBody className="text-start">
          <MDBRow>
            <MDBCol md="4">
              <select
                required
                className="form-control mb-3"
                value={application?.branchId}
                name="branchId"
                onChange={(e) => handleChange(e)}
              >
                <option value={""}>Select a branch</option>
                {sortByAscending(company.branches, "name")?.map((branch) => {
                  const disabler = collections?.find(
                    (catalog) => catalog?.branch?._id === branch?._id
                  );
                  return (
                    <option
                      value={branch._id}
                      key={branch._id}
                      disabled={disabler}
                      style={{
                        backgroundColor: disabler ? "yellow" : "white",
                      }}
                    >
                      {branch?.name}
                      {disabler ? " (Application on process)" : ""}
                    </option>
                  );
                })}
              </select>
            </MDBCol>
            <MDBCol md="4">
              <select
                required
                className="form-control mb-3"
                value={department}
                name="department"
                onChange={(e) => handleDepartment(e.target)}
              >
                <option value="">Select a department</option>
                {sortByAscending(Policy.collections, "department").map(
                  (collection, i) => (
                    <option
                      value={collection.department}
                      key={`department-${i}`}
                    >
                      {collection.department}
                    </option>
                  )
                )}
                ;
              </select>
            </MDBCol>
            <MDBCol md="4">
              <select
                required
                className="form-control mb-3"
                value={application?.designation}
                name="designation"
                onChange={handleChange}
              >
                <option value="">Select a Designation / Positions</option>
                {sortByAscending(positions, "display_name")?.map(
                  (position, i) => (
                    <option
                      value={position.id}
                      key={`position-${position.id}-${i}`}
                    >
                      {position?.display_name}
                    </option>
                  )
                )}
              </select>
            </MDBCol>
          </MDBRow>
          <MDBRow>
            <MDBCol md="4">
              <label
                htmlFor="upload-personal-data-sheet"
                className="btn btn-primary btn-md mt-3 w-100"
              >
                Personal Data Sheet
              </label>
              <input
                onChange={(e) => handleFile(e, "DataSheet")}
                type="file"
                id="upload-personal-data-sheet"
                className="d-none"
                accept=".pdf"
              />
            </MDBCol>
            <MDBCol md="4">
              <label
                htmlFor="upload-resume"
                className="btn btn-primary btn-md mt-3 w-100"
              >
                Resume
              </label>
              <input
                type="file"
                id="upload-resume"
                className="d-none"
                onChange={(e) => handleFile(e, "Resume")}
                accept=".pdf"
              />
            </MDBCol>
            <MDBCol md="4">
              <label
                htmlFor="upload-application"
                className="btn btn-primary btn-md mt-3 w-100"
              >
                Application Letter
              </label>
              <input
                type="file"
                id="upload-application"
                className="d-none"
                onChange={(e) => handleFile(e, "AppLetter")}
                accept=".pdf"
              />
            </MDBCol>
          </MDBRow>
          <MDBRow>
            <MDBCol md="4" className="w-100">
              {PDF_VIEWER("DataSheet")}
            </MDBCol>
            <MDBCol md="4" className="w-100">
              {PDF_VIEWER("Resume")}
            </MDBCol>
            <MDBCol md="4" className="w-100">
              {PDF_VIEWER("AppLetter")}
            </MDBCol>
          </MDBRow>
          <MDBRow>
            <MDBCol md="12" className="mt-4">
              <textarea
                className="form-control"
                placeholder="Message.."
                value={application?.message}
                name="message"
                onChange={handleChange}
              />
            </MDBCol>
          </MDBRow>
        </MDBModalBody>
        <MDBModalFooter>
          <MDBBtn
            type="submit"
            rounded
            color="success"
            disabled={formSubmitted}
          >
            Submit {formSubmitted && <MDBIcon icon="spinner" pulse />}
          </MDBBtn>
        </MDBModalFooter>
      </form>
    </MDBModal>
  );
}
