import { useDispatch, useSelector } from "react-redux";
import React, { useEffect, useState } from "react";
import {
  MDBBadge,
  MDBTable,
  MDBTableHead,
  MDBTableBody,
  MDBIcon,
  MDBMask,
  MDBView,
} from "mdbreact";
import { useHistory } from "react-router-dom";
import {
  SetRESULT,
  setShowModalEhr,
  setShowModalVs,
  UPDATE,
} from "../../../../../services/redux/slices/diagnostics/clinic/appointments";
import {
  Cloudinary,
  fullName,
  getAge,
  mobile,
  PresetImage,
} from "../../../../../services/utilities";
import {
  EditableField,
  EditableSelect,
} from "../../../../../components/customizable";
import { Templates, VisityType } from "../../../../../services/fakeDb";
import {
  UPLOAD,
  RESET,
} from "../../../../../services/redux/slices/assets/persons/auth";
import { ImageCropper } from "../../../../../components/images";
const Body = () => {
  const {
      filtered,
      activePage,
      maxPage,
      formSubmitted,
      isSuccess,
      activeSched,
    } = useSelector(({ appointments }) => appointments),
    { token } = useSelector(({ auth }) => auth),
    history = useHistory(),
    dispatch = useDispatch();
  const [preview, setPreview] = useState("");
  const [showImgCropper, setShowImgCropper] = useState(false);

  useEffect(() => {
    setShowImgCropper(false);
    dispatch(RESET());
  }, [dispatch]);

  const handleUpdate = (data) => {
    const { _id, ...rest } = data;

    // check if this is a patient field (mobile, email, etc.)
    if (
      "mobile" in rest ||
      "email" in rest ||
      "dob" in rest ||
      "fullName" in rest
    ) {
      dispatch(
        UPDATE({
          token,
          data: {
            _id: data.appointmentId, // appointment id
            patient: {
              _id: data.patientId || data._id, // explicitly pass patientId
              ...rest,
            },
          },
        })
      );
    } else {
      // normal appointment update
      dispatch(UPDATE({ token, data }));
    }
  };

  const handleUpload = (base64, email) => {
    const formData = Cloudinary.buildFileForm(
      base64,
      `users/${email}`,
      "profile"
    );

    setPreview(formData);

    dispatch(
      UPLOAD({
        data: formData,
        token,
      })
    );
  };

  const handleIndicesUpdate = (data) => {
    ["lab", "rad"].forEach((key) => {
      const items = data[key];
      if (!items || items.length === 0) return;

      const indices = Templates.getComponentIndices(items, key.toUpperCase());
      // dispatch(UPDATE({ token, data: { ...data, [key]: indices } }));
    });
  };

  // Pagination
  const itemsPerPage = maxPage;
  const startIndex = (activePage - 1) * itemsPerPage;
  const endIndex = startIndex + itemsPerPage;
  const sortedData = [...filtered].sort((a, b) => {
    const order = { done: 1, confirmed: 2 };
    return (order[a.status] || 99) - (order[b.status] || 99);
  });

  const paginatedData = sortedData.slice(startIndex, endIndex);

  return (
    <MDBTable bordered className="m-0 p-0" small>
      <MDBTableHead>
        <tr>
          <th>No.</th>
          <th>Patient</th>
          <th>Visit Type</th>
          <th className="text-center">Laboratory</th>
          <th className="text-center">Radiology</th>
          <th className="text-center" title="electronic Medical Records">
            eMR
          </th>
          <th className="text-center">VS</th>
          <th>Contact number</th>
          <th>Remarks</th>
        </tr>
      </MDBTableHead>
      <MDBTableBody>
        {paginatedData.length > 0 ? (
          paginatedData.map((item, index) => {
            const {
              patient,
              remarks,
              status,
              qn,
              visitType,
              lab = {},
              rad = {},
              sched = "",
              ehr,
              consultation,
              _id,
            } = item;
            const { fullName: name, email, mobile: cp } = patient;

            const hasLab = Object.keys(lab).length > 0;
            const hasRad = Object.keys(rad).length > 0;

            const photoURL = `${Cloudinary.getEndpoint()}/${
              patient?.pid || ""
            }/users/${patient?.email}/profile`;

            return (
              <tr key={index}>
                <td>{qn}</td>
                <td>
                  <div className="d-flex align-items-center">
                    {/* Avatar */}
                    <div>
                      <MDBView hover={!showImgCropper}>
                        <img
                          src={preview || photoURL}
                          alt="avatar"
                          onError={(e) =>
                            (e.target.src = PresetImage(patient.isMale))
                          }
                          className="rounded-circle"
                          style={{
                            width: "50px",
                            height: "50px",
                            objectFit: "cover",
                          }}
                        />
                        {/* Upload mask over image */}
                        <MDBMask overlay="grey-strong d-flex align-items-center">
                          <ImageCropper
                            key={patient?._id || index}
                            inputId={`cropImage-${patient?._id || index}`}
                            handleUpload={(base64) =>
                              handleUpload(base64, email)
                            }
                            setIsShow={(show) => setShowImgCropper(show)}
                            cropSize={{ width: 200, height: 200 }}
                            modalSize="md"
                            isUpload
                            label={
                              <MDBIcon icon="upload" title="Upload new photo" />
                            }
                            accept={".png,.jpg,.jpeg"}
                          />
                        </MDBMask>
                      </MDBView>
                    </div>

                    {/* Name + Age */}
                    <div className="ml-3 d-flex flex-column">
                      <span className="font-weight-bold">{fullName(name)}</span>
                      <div className="d-flex align-items-center">
                        {/* Age */}
                        <small className="text-muted mr-2">
                          {getAge(patient?.dob)}
                        </small>

                        {/* Status */}
                        <MDBBadge
                          color={status === "confirmed" ? "success" : "info"}
                          className="ml-2"
                        >
                          <EditableSelect
                            // preValue={status}
                            keyForText="status"
                            keyForValue="status"
                            animation
                            animationStyle={{
                              width: "10rem",
                              marginLeft: "-.3rem",
                              marginTop: "-.4rem",
                            }}
                            className="mb-n3"
                            isEditable
                            collections={["draft", "confirmed", "cancelled"]}
                            fieldData={{ _id, status }}
                            onSave={handleUpdate}
                            formSubmitted={formSubmitted}
                            isSuccess={isSuccess}
                          />
                        </MDBBadge>

                        {/* Action */}
                        {status === "confirmed" && (
                          <span
                            style={{ fontSize: "22px" }}
                            className="d-block ml-2 cursor-pointer"
                            onClick={() => {
                              history.push(
                                `/physician/diagnostics/consultations?ehrId=${_id}&sched=${sched}`
                              );
                            }}
                          >
                            👀
                          </span>
                        )}
                      </div>
                    </div>
                  </div>
                </td>

                <td>
                  <EditableSelect
                    animation
                    animationStyle={{
                      width: "15rem",
                      marginLeft: "-.3rem",
                      marginTop: "0.2rem",
                    }}
                    className="mb-n3"
                    preValue={visitType}
                    keyForText="label"
                    keyForValue="value"
                    isEditable
                    collections={VisityType.collections}
                    fieldData={{
                      _id,
                      label: VisityType.getLabel(visitType),
                    }}
                    onSave={(data) =>
                      handleUpdate({ ...data, visitType: data.value })
                    }
                    formSubmitted={formSubmitted}
                    isSuccess={isSuccess}
                  />
                </td>
                <td className="text-center">
                  <MDBIcon
                    size="lg"
                    onClick={() =>
                      dispatch(SetRESULT({ ...item, department: "lab" }))
                    }
                    icon={hasLab ? "eye" : "plus"}
                    title={
                      !hasLab
                        ? "Add Laboratory Result"
                        : "View Laboratory Result"
                    }
                    className={`text-${
                      hasLab ? "warning" : "primary"
                    } shadow-lg cursor-pointer`}
                  />
                </td>
                <td className="text-center">
                  <MDBIcon
                    size="lg"
                    onClick={() =>
                      dispatch(SetRESULT({ ...item, department: "rad" }))
                    }
                    icon={hasRad ? "eye" : "plus"}
                    title={
                      !hasRad ? "Add Radiology Result" : "View Radiology Result"
                    }
                    className={`text-${
                      hasRad ? "warning" : "primary"
                    } shadow-lg cursor-pointer`}
                  />
                </td>
                <td
                  style={{ cursor: "pointer" }}
                  className="text-center"
                  onClick={() => {
                    dispatch(setShowModalEhr({ ...ehr, patient: patient }));
                  }}
                >
                  {ehr ? (
                    <MDBIcon icon="check" className="text-success" />
                  ) : (
                    <MDBIcon icon="times" className="text-danger" />
                  )}
                </td>
                <td
                  style={{ cursor: "pointer" }}
                  className="text-center"
                  onClick={() => {
                    dispatch(
                      setShowModalVs({
                        ...consultation,
                        appointment: _id,
                        patient: patient,
                      })
                    );
                  }}
                >
                  {consultation ? (
                    <MDBIcon icon="check" className="text-success" />
                  ) : (
                    <MDBIcon icon="times" className="text-danger" />
                  )}
                </td>
                <td>
                  <EditableField
                    type="number"
                    fieldData={{
                      _id: patient?._id,
                      mobile: cp,
                      appointmentId: _id,
                    }}
                    onSave={handleUpdate}
                    formSubmitted={formSubmitted}
                    isSuccess={isSuccess}
                    utility={(val) => mobile(val)}
                  />
                </td>
                <td>
                  <EditableField
                    type="text"
                    keyForValue="remarks"
                    fieldData={{ _id, remarks: remarks }}
                    onSave={handleUpdate}
                    formSubmitted={formSubmitted}
                    isSuccess={isSuccess}
                  />
                </td>
              </tr>
            );
          })
        ) : (
          <tr>
            <td colSpan={8} className="text-center py-3">
              <p className="mb-0 text-muted fst-italic">
                <span className="fw-semibold text-dark">
                  No Appointment Record
                </span>{" "}
                found for{" "}
                <span className="fw-bold text-primary">{activeSched}</span>
              </p>
            </td>
          </tr>
        )}
      </MDBTableBody>
    </MDBTable>
  );
};

export default Body;
