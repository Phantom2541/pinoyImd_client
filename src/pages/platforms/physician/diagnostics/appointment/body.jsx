import { useDispatch, useSelector } from "react-redux";
import {
  MDBBadge,
  MDBTable,
  MDBTableHead,
  MDBTableBody,
  MDBIcon,
} from "mdbreact";
import { useHistory } from "react-router-dom";
import { UPDATE } from "../../../../../services/redux/slices/diagnostics/clinic/appointments";
import { fullName } from "../../../../../services/utilities";
import {
  EditableField,
  EditableSelect,
} from "../../../../../components/customizable";
import visitTypes from "./visitTypes.json";
import { Templates } from "../../../../../services/fakeDb";
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
  const paginatedData = filtered.slice(startIndex, endIndex);

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
          <th title="Vital Sign">VS</th>
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
              lab,
              rad,
              qn,
              visitType,
              ehr,
              consultation,
              _id,
            } = item;

            return (
              <tr key={index}>
                <td>{qn}</td>
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
                    preValue={visitType}
                    keyForText="visitType"
                    keyForValue="visitType"
                    isEditable
                    collections={visitTypes}
                    fieldData={{
                      _id,
                      visitType: visitType,
                    }}
                    onSave={handleUpdate}
                    formSubmitted={formSubmitted}
                    isSuccess={isSuccess}
                  />
                </td>
                <td className="text-center">
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
                  />
                </td>
                <td className="text-center">
                  <EditableSelect
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
                  />
                </td>
                <td>{ehr ? "yes" : "no"}</td>
                <td>{consultation ? "yes" : "no"} </td>
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
