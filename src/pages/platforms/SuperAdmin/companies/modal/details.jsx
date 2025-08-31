import { MDBRow, MDBCol, MDBInput } from "mdbreact";
import Search from "../../../../../components/searchables/ao";
import AddressSelect from "../../../../../components/searchables/addressSelect";
import EditableSelect from "../../../../../components/customizable/editableSelect";

const Details = ({
  form,
  isDuplicate = false,
  setForm = () => {},
  validateName = () => {},
}) => {
  return (
    <>
      <MDBRow>
        <MDBCol>
          <MDBInput
            label="Name"
            required
            value={form.name}
            onChange={({ target }) => validateName(target.value)}
          />
          {isDuplicate && (
            <h6
              className="text-nowrap text-danger "
              style={{
                marginTop: "-1rem",
                marginBottom: "-0.5rem",
                fontWeight: 500,
              }}
            >
              Ooops. this name is already taken
            </h6>
          )}
        </MDBCol>
        <MDBCol>
          <MDBInput
            label="Subname"
            value={form.subName}
            onChange={({ target }) =>
              setForm({ ...form, subName: target.value, isGhost: false })
            }
          />
        </MDBCol>
      </MDBRow>
      <MDBRow>
        <MDBCol className="d-flex align-items-center w-100">
          <div className={`w-100 ${form?.ceo?._id && "mt-4"}`}>
            <Search
              selectedUser={form.ceo}
              label="CEO"
              setUser={(value) => setForm({ ...form, ceo: value || "" })}
              className="mt-4"
            />
          </div>
        </MDBCol>
        <MDBCol>
          <EditableSelect
            className="mt-4"
            preValue={form.category}
            label="Category"
            collections={["diagnostic", "supplier"]}
            onChange={(value) => setForm({ ...form, category: value })}
          />
        </MDBCol>
      </MDBRow>
      <AddressSelect
        address={form.address}
        isPOS={false}
        handleChange={(key, value) => setForm({ ...form, [key]: value })}
      />
      <MDBRow>
        <MDBCol md="6">
          <MDBInput
            label="Tagline"
            type="textarea"
            value={form.tagline}
            onChange={({ target }) =>
              setForm({
                ...form,
                tagline: target.value,
              })
            }
          />
        </MDBCol>
        <MDBCol md="6">
          <MDBInput
            label="Description"
            type="textarea"
            value={form.description}
            onChange={({ target }) =>
              setForm({
                ...form,
                description: target.value,
              })
            }
          />
        </MDBCol>
      </MDBRow>
    </>
  );
};

export default Details;
