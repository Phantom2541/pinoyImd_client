import { MDBCol, MDBInput, MDBRow } from "mdbreact";

const Information = ({ form, setForm = () => {} }) => {
  return (
    <MDBCol md="12">
      <MDBRow>
        <MDBCol>
          <MDBInput
            label="Title"
            required
            value={form?.title}
            onChange={(e) => setForm({ ...form, title: e.target.value })}
          />
        </MDBCol>
        <MDBCol>
          <MDBInput
            label="Code"
            value={form?.code}
            onChange={(e) => setForm({ ...form, code: e.target.value })}
          />
        </MDBCol>
      </MDBRow>
      <MDBRow>
        <MDBCol>
          <MDBInput
            label="Specialization"
            value={form?.specialization}
            onChange={(e) =>
              setForm({ ...form, specialization: e.target.value })
            }
          />
        </MDBCol>
        <MDBCol>
          <label className="grey-text mt-3">Status</label>
          <select
            className="browser-default custom-select"
            value={form?.status || "draft"}
            onChange={(e) => setForm({ ...form, status: e.target.value })}
          >
            <option value="draft">Draft</option>
            <option value="posted">Posted</option>
            <option value="cancelled">Cancelled</option>
            <option value="done">Done</option>
          </select>
        </MDBCol>
      </MDBRow>
      <MDBRow>
        <MDBCol>
          <MDBInput
            label="Description"
            type="textarea"
            required
            value={form?.description}
            onChange={(e) => setForm({ ...form, description: e.target.value })}
            style={{ minHeight: "11.6rem" }}
          />
        </MDBCol>
        <MDBCol>
          <MDBInput
            label="Remarks"
            type="textarea"
            required
            value={form?.remarks}
            onChange={(e) => setForm({ ...form, remarks: e.target.value })}
            style={{ minHeight: "11.6rem" }}
          />
        </MDBCol>
      </MDBRow>
    </MDBCol>
  );
};

export default Information;
