import { useDispatch, useSelector } from "react-redux";
import {
  MDBBadge,
  MDBTable,
  MDBTableHead,
  MDBTableBody,
  MDBIcon,
  MDBAvatar,
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
  mobile,
  PresetImage,
} from "../../../../../services/utilities";
import {
  EditableField,
  EditableSelect,
} from "../../../../../components/customizable";
import { Templates, VisityType } from "../../../../../services/fakeDb";
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

  const handleUpdate = (data) => dispatch(UPDATE({ token, data }));
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
          <th>Profile</th>
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
              ehr,
              consultation,
              _id,
            } = item;

            const hasLab = Object.keys(lab).length > 0;
            const hasRad = Object.keys(rad).length > 0;

            return (
              <tr key={index}>
                <td>{qn}</td>
                <td>
                  <img
                    src={`${Cloudinary.getEndpoint()}/${
                      patient?.pid || ""
                    }/users/${patient?.email}/profile`}
                    className="rounded-circle z-depth-1"
                    style={{
                      width: "35px",
                      height: "35px",
                      marginRight: "10px",
                    }}
                    alt=" avatar"
                    onError={(e) =>
                      (e.target.src = PresetImage(patient.isMale))
                    }
                  />

                  {/* <img
                    src={patient?.avatar}
                    alt="avatar"
                    className="rounded-circle"
                    style={{ width: "50px", height: "50px" }}
                  /> */}
                </td>
                <td>
                  <div className="d-flex align-items-center">
                    <div>
                      {fullName(patient?.fullName)}{" "}
                      <MDBBadge
                        color={status === "confirmed" ? "success" : "info"}
                        className="ml-2"
                      >
                        <EditableSelect
                          preValue={status}
                          keyForText="status"
                          animation
                          animationStyle={{
                            width: "10rem",
                            marginLeft: "-.3rem",
                            marginTop: "-.4rem",
                          }}
                          className="mb-n3"
                          keyForValue="status"
                          isEditable
                          collections={["draft", "confirmed", "cancelled"]}
                          fieldData={{
                            _id,
                            status: status,
                          }}
                          onSave={handleUpdate}
                          formSubmitted={formSubmitted}
                          isSuccess={isSuccess}
                        />
                      </MDBBadge>
                    </div>
                    {status === "confirmed" && (
                      <span
                        style={{ fontSize: "22px" }}
                        className="d-block mt-n2 mb-n2 ml-2 cursor-pointer"
                        onClick={() => {
                          history.push(
                            `/physician/diagnostics/consultations?ehrId=${_id}&sched=${activeSched}`
                          );
                        }}
                      >
                        👀
                      </span>
                    )}
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

                  {/* 
                      <EditableSelect
                    collections={Templates.getComponents("LAB")}
                    preValues={Templates.getWordByIndices(lab, "components")}
                    keyForText="lab"
                    keyForValue="lab"
                    onSave={handleIndicesUpdate}
                    isEditable
                    multiple={true}
                    fieldData={{
                      _id,
                      lab: Templates.getWordByIndices(lab, "components"),
                    }}
                  /> */}
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
                  {/* <EditableSelect
                    collections={Templates.getComponents("RAD")}
                    preValues={Templates.getWordByIndices(
                      rad,
                      "components",
                      "RAD"
                    )}
                    keyForText="rad"
                    keyForValue="rad"
                    onSave={handleIndicesUpdate}
                    isEditable
                    multiple={true}
                    fieldData={{
                      _id,
                      rad: Templates.getWordByIndices(rad, "components", "RAD"),
                    }}
                  /> */}
                </td>
                <td
                  style={{ cursor: "pointer" }}
                  className="text-center"
                  onClick={() => {
                    dispatch(setShowModalEhr({ ...ehr, patient: patient }));
                  }}
                >
                  {ehr ? "yes" : "no"}
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
                  {consultation ? "yes" : "no"}{" "}
                </td>
                <td>{mobile(patient?.mobile)}</td>
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
