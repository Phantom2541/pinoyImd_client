import React, { useEffect, useState } from "react";
import {
  MDBBtn,
  MDBModal,
  MDBModalHeader,
  MDBModalBody,
  MDBModalFooter,
  MDBRow,
  MDBCol,
} from "mdbreact";
import { useDispatch, useSelector } from "react-redux";
import {
  SAVE,
  APPLICATION,
} from "../../../../../../../services/redux/slices/assets/persons/personnels.js";

import { Policy } from "../../../../../../../services/fakeDb/index.js";
import { UPLOAD } from "../../../../../../../services/redux/slices/assets/persons/auth.js";

export default function ApplicationModal({
  visibility,
  setVisibility,
  company,
}) {
  const { auth, token } = useSelector(({ auth }) => auth),
    { collections } = useSelector(({ personnels }) => personnels),
    [application, setApplication] = useState({}),
    [department, setDepartment] = useState(),
    [positions, setPositions] = useState([]),
    dispatch = useDispatch();
  useEffect(() => {
    token &&
      dispatch(
        APPLICATION({
          data: {
            _id: auth._id,
            key: "",
          },
          token,
        })
      );
  }, [dispatch, token, auth]);

  //console.log("unused variable setPositions", setPositions);
  console.log("application", application);

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
    setPositions(Policy.getPositions(value));
  };

  const handleChange = (e) => {
    const { name, value } = e.target;
    setApplication({
      ...application,
      [name]: value,
    });
  };

  const handleFile = (e, name) => {
    const reader = new FileReader();
    reader.onload = (e) => {
      let image = new Image();
      image.src = e.target.result;
      image.onload = function () {
        if (this.width === this.height) {
          if (this.width <= 300) {
            dispatch(
              UPLOAD({
                data: {
                  path: `users/${auth.email}/credentials/${company.name}`,
                  base64: reader.result.split(",")[1],
                  name,
                },
                token,
              })
            );
          } else {
            // toast.warn("Maximum size is 300 pixels and below.");
            alert("Maximum size is 300 pixels and below.");
          }
        } else {
          // toast.warn("Proportion must be 1:1");
          alert("Proportion must be 1:1");
        }
      };
    };
    reader.readAsDataURL(e.target.files[0]);
  };

  const handleSubmit = () => {
    const _company = company?.branches.find(
      (branch) => branch._id === application.branchId
    );
    const id = `${_company.displayname
      .split(" ")
      .map((word) => word[0])
      .join("")}-${_company.name
      .split(" ")
      .map((word) => word[0])
      .join("")}-${Math.floor(Math.random() * 100)}`;
    dispatch(
      SAVE({
        data: {
          id,
          user: auth._id,
          status: "petition",
          branch: application.branchId,
          file201: {
            hasPds: application.pds ? true : false,
            hasResume: application.resume ? true : false,
            hasLetter: application.letter ? true : false,
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
    setVisibility(!visibility);
  };

  const handleReadDataSheet = () => {
    // return (
    //   <>
    //     <iframe
    //       src={`${ENDPOINT}/public/users/${auth.email}/Smart Care/General Tinio Branch/Applications/Resume.pdf`}
    //       alt={auth.email}
    //       className="mx-auto rounded img-max img-fluid mb-1"
    //       onError={(e) => (e.target.src = PresetUser)}
    //       title="Personal Data"
    //       style={{ width: "750px", height: "400px" }}
    //     />
    //   </>
    // );
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
      <form onSubmit={handleApplication}>
        <MDBModalBody className="text-start">
          <MDBRow>
            <MDBCol md="4">
              <select
                required
                className="form-control mb-3"
                value={application?.branchId}
                name="branchId"
                onChange={handleChange}
              >
                <option value="" selected>
                  Select a branch
                </option>
                {company.branches?.map((branch) => {
                  const disabler = collections?.find(
                    (catalog) => catalog.branch._id === branch._id
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
                      {disabler ? "Application on process" : ""}
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
                <option value="" selected>
                  Select a department
                </option>
                {Policy.collections.map((collections, i) => (
                  <option value={collections.code} key={`department-${i}`}>
                    {collections.department}
                  </option>
                ))}
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
                <option value="" selected>
                  Select a Designation / Positions
                </option>
                {positions?.map((position, i) => (
                  <option
                    value={position.id}
                    key={`position-${position.id}-${i}`}
                  >
                    {position?.display_name}
                  </option>
                ))}
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
                onChange={(e) => handleFile(e, "dataSheet.docx")}
                type="file"
                id="upload-personal-data-sheet"
                className="d-none"
                accept="image/*"
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
                onChange={(e) => handleFile(e, "Resume.pdf")}
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
                onChange={(e) => handleFile(e, "AppLetter.docx")}
                accept="image/*"
              />
            </MDBCol>
          </MDBRow>
          <MDBRow className="d-flex justify-content-center">
            <MDBCol md="8" className=" d-flex justify-content-center mt-3">
              {handleReadDataSheet()}
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
          <MDBBtn type="submit" rounded color="success" onClick={handleSubmit}>
            Submit
          </MDBBtn>
        </MDBModalFooter>
      </form>
    </MDBModal>
  );
}
