import {
  MDBBtn,
  MDBCol,
  MDBDatePicker,
  MDBIcon,
  MDBInput,
  MDBRow,
  MDBTable,
} from "mdbreact";
import { EditableSelect } from "../../../../../../../components/customizable";
import { useEffect, useState } from "react";
import Swal from "sweetalert2";

const _physician = { name: "", specialization: "" };
const Details = ({ form, setForm = () => {} }) => {
  const [physician, setPhysician] = useState(_physician);

  useEffect(() => {
    setPhysician(_physician);
  }, []);
  const handleAddPhysician = () => {
    if (!physician.name) {
      Swal.fire({
        icon: "warning",
        title: "Required Field",
        text: "Physician name is required.",
        confirmButtonColor: "#3085d6",
      });
      return;
    }
    const _ap = [...(form.ap || [])];
    _ap.unshift(physician);
    setForm({ ...form, ap: _ap });
    setPhysician(_physician);
  };
  const handleRemove = (index) => {
    const _ap = [...(form.ap || [])];
    _ap.splice(index, 1);
    setForm({ ...form, ap: _ap });
  };
  return (
    <>
      <MDBRow>
        <MDBCol md="6">
          <MDBRow>
            <MDBCol>
              <MDBInput
                label="Hospital"
                required
                value={form?.hospital}
                onChange={({ target }) =>
                  setForm({ ...form, hospital: target.value })
                }
              />
            </MDBCol>
          </MDBRow>

          <MDBRow>
            <MDBCol>
              <MDBInput
                label="Diagnosis"
                required
                value={form?.diagnosis}
                onChange={({ target }) =>
                  setForm({ ...form, diagnosis: target.value })
                }
              />
            </MDBCol>
          </MDBRow>
          <MDBRow>
            <MDBCol>
              <div style={{ marginTop: "3px" }}>
                <EditableSelect
                  label="Status"
                  preValue={form?.status}
                  onChange={(e) => setForm({ ...form, status: e })}
                  className="mt-4"
                  collections={[
                    "active",
                    "resolved",
                    "cancelled",
                    "transferred",
                  ]}
                />
              </div>
            </MDBCol>
            <MDBCol>
              <MDBInput
                label="Date Confined"
                type="date"
                value={form?.date?.start}
                required
                onChange={({ target }) =>
                  setForm({
                    ...form,
                    date: { ...form.date, start: target.value },
                  })
                }
              />
            </MDBCol>
            <MDBCol>
              <MDBInput
                label="Date Discharged"
                type="date"
                value={form?.date?.end}
                onChange={({ target }) =>
                  setForm({
                    ...form,
                    date: { ...form.date, end: target.value },
                  })
                }
              />
            </MDBCol>
          </MDBRow>

          <MDBRow>
            <MDBCol>
              <MDBInput
                label="Remarks"
                type="textarea"
                value={form?.remarks}
                onChange={({ target }) =>
                  setForm({
                    ...form,
                    remarks: target.value,
                  })
                }
              />
            </MDBCol>
          </MDBRow>
        </MDBCol>
        <MDBCol>
          <MDBRow>
            <MDBCol>
              <MDBInput
                label="Physician"
                value={physician?.name}
                onChange={({ target }) =>
                  setPhysician({
                    ...physician,
                    name: target.value,
                  })
                }
              />
            </MDBCol>
            <MDBCol>
              <MDBInput
                label="Specialization"
                value={physician?.specialization}
                onChange={({ target }) =>
                  setPhysician({
                    ...physician,
                    specialization: target.value,
                  })
                }
              />
            </MDBCol>
            <MDBCol>
              <div className="d-flex">
                <div className="flex-grow-1">
                  <MDBInput
                    label="Assigned date"
                    type="date"
                    value={physician?.assignedDate}
                    onChange={({ target }) =>
                      setPhysician({
                        ...physician,
                        assignedDate: target.value,
                      })
                    }
                  />
                </div>
                <div className="d-flex align-items-center ms-2">
                  <button
                    size="sm"
                    style={{
                      marginRight: "-5px",
                    }}
                    onClick={handleAddPhysician}
                    // color="white"
                    type="button"
                    className="search-add-btn ml-2 py-1 "
                  >
                    <MDBIcon icon="plus" size="sm" />
                  </button>
                </div>
              </div>
            </MDBCol>
          </MDBRow>

          <span style={{ fontWeight: 500 }}>Attending Physician</span>
          <MDBTable small>
            <thead>
              <tr>
                <th>Name</th>
                <th>Specialization</th>
                <th>Assigned Date</th>
              </tr>
            </thead>
            <tbody>
              {form?.ap?.length > 0 ? (
                form?.ap?.map((ap, index) => (
                  <tr key={index}>
                    <td>{ap?.name}</td>
                    <td>{ap?.specialization}</td>
                    <td>{ap?.assignedDate}</td>
                    <td>
                      <button
                        size="sm"
                        style={{
                          marginRight: "-5px",
                        }}
                        // color="white"
                        type="button"
                        className="search-add-btn ml-2 py-1 "
                        onClick={() => handleRemove(index)}
                      >
                        <MDBIcon icon="minus" size="sm" />
                      </button>
                    </td>
                  </tr>
                ))
              ) : (
                <tr>
                  <td colSpan={3} className="text-center">
                    No Attending Physician Record.
                  </td>
                </tr>
              )}
            </tbody>
          </MDBTable>
        </MDBCol>
      </MDBRow>
    </>
  );
};

export default Details;
