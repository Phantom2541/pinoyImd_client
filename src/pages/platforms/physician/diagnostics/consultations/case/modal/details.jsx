import { MDBBtn, MDBCol, MDBDatePicker, MDBInput, MDBRow } from "mdbreact";
import { EditableSelect } from "../../../../../../../components/customizable";

const Details = ({ form, setForm = () => {} }) => {
  return (
    <>
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
            label="Physician"
            value={form?.physician?.name}
            onChange={({ target }) =>
              setForm({
                ...form,
                physician: { ...form.physician, name: target.value },
              })
            }
          />
        </MDBCol>
        <MDBCol>
          <MDBInput
            label="Specialization"
            value={form?.physician?.specialization}
            onChange={({ target }) =>
              setForm({
                ...form,
                physician: { ...form.physician, specialization: target.value },
              })
            }
          />
        </MDBCol>
        <MDBCol>
          <div className="d-flex">
            <div className="flex-grow-1">
              <MDBInput
                label="Assigned date"
                value={form?.physician?.specialization}
                onChange={({ target }) =>
                  setForm({
                    ...form,
                    physician: {
                      ...form.physician,
                      specialization: target.value,
                    },
                  })
                }
              />
            </div>
            <div className="d-flex align-items-center ms-2">
              <MDBBtn size="sm" className="px-2">
                ADD
              </MDBBtn>
            </div>
          </div>
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
              collections={["active", "resolved", "cancelled", "transferred"]}
            />
          </div>
        </MDBCol>
        <MDBCol>
          <MDBInput
            label="Start Date"
            type="date"
            value={form?.date?.start}
            onChange={({ target }) =>
              setForm({ ...form, date: { ...form.date, start: target.value } })
            }
          />
        </MDBCol>
        <MDBCol>
          <MDBInput
            label="End Date"
            type="date"
            value={form?.date?.end}
            onChange={({ target }) =>
              setForm({ ...form, date: { ...form.date, end: target.value } })
            }
          />
        </MDBCol>
      </MDBRow>

      <MDBRow>
        <MDBCol>
          <MDBInput
            label="Remarks type here..."
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
    </>
  );
};

export default Details;
