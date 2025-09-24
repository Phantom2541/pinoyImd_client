import { useDispatch, useSelector } from "react-redux";
import {
  MDBBadge,
  MDBIcon,
  MDBTable,
  MDBTableHead,
  MDBTableBody,
} from "mdbreact";
import {
  UPDATE,
  setShowModalEhr,
  setShowModalVs,
  SetRESULT,
  SetTRANSAC,
} from "../../../../services/redux/slices/diagnostics/clinic/appointments";
import { fullName } from "../../../../services/utilities";
import {
  EditableField,
  EditableSelect,
} from "../../../../components/customizable";
import visitTypes from "./visitTypes";
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
    dispatch = useDispatch();

  const handleUpdate = (data) => {
    dispatch(UPDATE({ token, data }));
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

  const statusColors = {
    draft: "info",
    confirmed: "primary",
    cancelled: "danger",
  };

  return (
    <MDBTable bordered className="m-0 p-0" small>
      <MDBTableHead>
        <tr>
          {!activeSched && <th>Schedule</th>}
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
              qn,
              visitType,
              ehr,
              consultation,
              _id,
              sched,
              lab = {},
              rad = {},
            } = item;
            const hasLab = Object.keys(lab).length > 0;
            const hasRad = Object.keys(rad).length > 0;
            return (
              <tr key={index}>
                {!activeSched && <td>{sched}</td>}
                <td>{qn}</td>
                <td>
                  {fullName(patient?.fullName)}
                  <MDBBadge
                    color={statusColors[status] || "info"}
                    className="ml-2"
                  >
                    <EditableSelect
                      animation
                      animationStyle={{
                        width: "10rem",
                        marginLeft: "-.3rem",
                        marginTop: "-.4rem",
                      }}
                      className="mb-n3"
                      preValue={status}
                      keyForText="status"
                      keyForValue="status"
                      isEditable
                      collections={Object.keys(statusColors)}
                      fieldData={{ _id, status }}
                      onSave={handleUpdate}
                      formSubmitted={formSubmitted}
                      isSuccess={isSuccess}
                    />
                  </MDBBadge>

                  {status === "done" && (
                    <MDBIcon
                      icon="cash-register"
                      onClick={() => dispatch(SetTRANSAC(item))}
                      size="lg"
                      className="ml-3 cursor-pointer"
                      title="Transaction"
                    />
                  )}
                </td>
                <td>
                  <EditableSelect
                    animation
                    animationStyle={{
                      width: "15rem",
                      marginLeft: "-.3rem",
                      marginTop: "0.2rem",
                    }}
                    preValue={visitType}
                    keyForText="visitType"
                    keyForValue="visitType"
                    className="mb-n3"
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
                  onClick={() => {
                    dispatch(setShowModalEhr({ ...ehr, patient: patient }));
                  }}
                >
                  {ehr ? "yes" : "no"}
                </td>

                <td
                  style={{ cursor: "pointer" }}
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
                <td className="position-relative">
                  <EditableField
                    type="text"
                    animation
                    animationStyle={{
                      width: "15rem",
                      marginTop: "-0.4rem",
                    }}
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
            <td colSpan={8} className="text-center">
              <MDBIcon icon="user-injured" className="mr-2" /> No Patient Record
            </td>
          </tr>
        )}
      </MDBTableBody>
    </MDBTable>
  );
};

export default Body;
