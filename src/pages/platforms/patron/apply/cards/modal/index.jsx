import React, { useState } from "react";
import {
  MDBBtn,
  MDBModal,
  MDBModalHeader,
  MDBModalBody,
  MDBModalFooter,
  MDBRow,
  MDBCol,
} from "mdbreact";
import { useSelector } from "react-redux";
// import { UPLOAD } from "../../../../../../redux/slices/assets/persons/auth.js";
// import { toast } from "react-toastify";
// import {
//   SAVE,
//   APPLICATION,
// } from "../../../../../../services/redux/slices/assets/persons/personnels";

import { Policy } from "../../../../../../services/fakeDb";
// import { PresetUser, ENDPOINT } from "../../../../../../services/utilities";

// import { Collection } from "mongoose";

export default function ApplicationModal({
  visibility,
  setVisibility,
  company,
}) {
  const { auth } = useSelector(({ auth }) => auth),
    { collections } = useSelector(({ personnels }) => personnels),
    [application, setApplication] = useState({}),
    [department, setDepartment] = useState(),
    [positions, setPositions] = useState([]);
  // dispatch = useDispatch();
  // useEffect(() => {
  //   token &&
  //     dispatch(
  //       APPLICATION({
  //         data: {
  //           _id: auth._id,
  //           key: "",
  //         },
  //         token,
  //       })
  //     );
  // }, [dispatch, token, auth]);

  //console.log("unused variable setPositions", setPositions);

  const handleToggle = () => setVisibility(!visibility);

  const handleApplication = (e) => {
    e.preventDefault();
    if (!!company.branches.length) {
      //console.log({
        userId: auth._id,
        ...application,
      });
    } else {
      // toast.warn("Sorry, there are no available branches for this company.");
      alert("Sorry, there are no available branches for this company.");
    }
  };

  const handleDepartment = (e) => {
    const { value } = e.target;
    setDepartment(value);
    // setPositions(Policy.positions(value));
    //.positions
  };

  const handleChange = (e) => {
    const { name, value } = e.target;
    setApplication({
      ...application,
      [name]: value,
    });
  };

  const handleFile = (e, name) => {
    // const reader = new FileReader();
    // reader.onload = (e) => {
    //   let image = new Image();
    //   image.src = e.target.result;
    //   image.onload = function () {
    //     if (this.width === this.height) {
    //       if (this.width <= 300) {
    //         dispatch(
    //           UPLOAD({
    //             data: {
    //               path: `patron/${auth.email}/Smart Care/General Tinio Branch/Applications`,
    //               base64: reader.result.split(",")[1],
    //               name,
    //             },
    //             token,
    //           })
    //         );
    //       } else {
    //         // toast.warn("Maximum size is 300 pixels and below.");
    //         alert("Maximum size is 300 pixels and below.");
    //       }
    //     } else {
    //       // toast.warn("Proportion must be 1:1");
    //       alert("Proportion must be 1:1");
    //     }
    //   };
    // };
    // reader.readAsDataURL(e.target.files[0]);
  };

  const handleSubmit = () => {
    // dispatch(
    //   SAVE({
    //     form: {
    //       user: auth._id,
    //       status: "petition",
    //       branch: application.branchId,
    //       hasPds: application.pds ? true : false,
    //       hasResume: application.resume ? true : false,
    //       hasLetter: application.letter ? true : false,
    //       designation: Number(application.designation),
    //       hos: 8,
    //       message: application.message,
    //     },
    //     token,
    //   })
    // );
    // setVisibility(!visibility);
  };

  const handleReadDataSheet = () => {
    // return (
    //   <>
    //     <iframe
    //       src={`${ENDPOINT}/public/patron/${auth.email}/Smart Care/General Tinio Branch/Applications/Resume.pdf`}
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
    <MDBModal
      size="fluid"
      staticBackdrop
      tabIndex="-1"
      show={visibility}
      setShow={setVisibility}
    >
      <MDBModalHeader>
        <h3>{company.name}'s Application Requirements</h3>
        <MDBBtn className="btn-close" color="none" onClick={handleToggle} />
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
                onChange={handleDepartment}
              >
                <option value="" selected>
                  Select a department
                </option>
                {Object.entries(Policy.departments())?.map(
                  ([index, collections]) => (
                    <option value={collections.department} key={index}>
                      {collections.department.toLocaleUpperCase()}
                    </option>
                  )
                )}
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
                {Object.entries(positions)?.map((collections, i) => {
                  collections.map((collection) => {
                    //console.log("collection", collection);
                    return (
                      <option
                        value={collections.id}
                        key={`position-${collections.id}-${i}`}
                      >
                        {collections?.display_name}
                      </option>
                    );
                  });
                })}
              </select>
            </MDBCol>
          </MDBRow>
          <MDBRow>
            <MDBCol md="4">
              <label
                htmlFor="upload-personal-data-sheet"
                className="btn btn-primary btn-xl mt-3"
                style={{ width: "485px" }}
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
                className="btn btn-primary btn-xl mt-3"
                style={{ width: "485px" }}
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
                className="btn btn-primary btn-xl mt-3"
                style={{ width: "485px" }}
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
                label="Message"
                value={application?.message}
                name="message"
                onChange={handleChange}
              />
            </MDBCol>
          </MDBRow>
        </MDBModalBody>
        <MDBModalFooter>
          <MDBBtn type="button" color="secondary" onClick={handleToggle}>
            Close
          </MDBBtn>
          <MDBBtn type="submit" color="success" onClick={handleSubmit}>
            Submit application
          </MDBBtn>
        </MDBModalFooter>
      </form>
    </MDBModal>
  );
}
