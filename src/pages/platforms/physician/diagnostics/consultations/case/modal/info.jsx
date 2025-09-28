import { MDBRow, MDBCol, MDBInput } from "mdbreact";
import { EditableSelect } from "../../../../../../../components/customizable";

export default function Information({
  setForm = () => {},
  isDuplicate = false,
  form,
}) {
  return (
    <div>
      <MDBRow>
        <MDBCol>
          <MDBInput
            label="Title"
            value={form?.title || ""}
            required
            onChange={({ target }) => setForm({ ...form, title: target.value })}
          />
          {isDuplicate && (
            <p
              className="text-danger d-block "
              style={{
                marginTop: "-1.5rem",
                marginBottom: "-0.05rem",
                fontWeight: 400,
              }}
            >
              Oopsss. this case is already existing.
            </p>
          )}
        </MDBCol>

        <MDBCol md="4">
          <EditableSelect
            collections={["medical", "surgical", "obgyne"]}
            label="Category"
            value={form.category}
            preValue={form.category}
            onChange={(e) => setForm({ ...form, category: e })}
            className="mt-4"
          />
        </MDBCol>
      </MDBRow>

      <MDBRow>
        <MDBCol>
          <MDBInput
            type="textarea"
            label="Case Summary"
            required
            value={form.caseSummary}
            onChange={({ target }) =>
              setForm({ ...form, caseSummary: target.value })
            }
          />
        </MDBCol>
        <MDBCol>
          <MDBInput
            type="textarea"
            label="Description"
            required
            value={form.description}
            onChange={({ target }) =>
              setForm({ ...form, description: target.value })
            }
          />
        </MDBCol>
      </MDBRow>
    </div>
  );
}
