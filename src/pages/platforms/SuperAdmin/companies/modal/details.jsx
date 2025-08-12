import { MDBRow, MDBCol, MDBInput } from "mdbreact";
import Search from "../../../../../components/searchables/ao";
import AddressSelect from "../../../../../components/searchables/addressSelect";

const Details = ({
  form,
  branch,
  isDuplicate = false,
  setBranch = () => {},
  setForm = () => {},
  validateName = () => {},
}) => {
  return (
    <>
      <MDBRow>
        <MDBCol md="4">
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
        <MDBCol md="3">
          <MDBInput
            label="Subname"
            value={form.subName}
            onChange={({ target }) =>
              setForm({ ...form, subName: target.value })
            }
          />
        </MDBCol>
        <MDBCol className="d-flex align-items-center w-100">
          <div className={`w-100 ${form?.ceo?._id && "mt-4"}`}>
            <Search
              label="CEO"
              setUser={(value) => setForm({ ...form, ceo: value || "" })}
              className="mt-4"
            />
          </div>
        </MDBCol>
      </MDBRow>
      <AddressSelect
        address={form.address}
        isPOS={false}
        label="Address"
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

      <MDBRow>
        <MDBCol>
          <div>
            <span className="mr-2 " style={{ fontWeight: 500 }}>
              Is Hiring ?
            </span>
            <input
              className="form-check-input"
              type="checkbox"
              onChange={() => setForm({ ...form, isHiring: !form.isHiring })}
              checked={form.isHiring}
              id={"hiring-yes"}
            />
            <label
              htmlFor={"hiring-yes"}
              className="form-check-label label-table"
              style={{ fontWeight: 300 }}
            >
              Yes
            </label>

            <input
              className="form-check-input"
              type="checkbox"
              onChange={() => {
                setForm({ ...form, isHiring: !form.isHiring });
                setBranch({ ...branch, isHiring: !branch.isHiring });
              }}
              checked={!form.isHiring}
              id={"hiring-no"}
            />
            <label
              htmlFor={"hiring-no"}
              className="form-check-label label-table ml-3"
              style={{ fontWeight: 300 }}
            >
              No
            </label>
          </div>
        </MDBCol>
        <MDBCol>
          <div>
            <span className="mr-2" style={{ fontWeight: 500 }}>
              Is Verify ?
            </span>
            <input
              className="form-check-input"
              type="checkbox"
              onChange={() =>
                setForm({ ...form, hasVerified: !form.hasVerified })
              }
              checked={form.hasVerified}
              id={"verified-yes"}
            />
            <label
              htmlFor={"verified-yes"}
              className="form-check-label label-table"
              style={{ fontWeight: 300 }}
            >
              Yes
            </label>

            <input
              className="form-check-input"
              type="checkbox"
              onChange={() =>
                setForm({ ...form, hasVerified: !form.hasVerified })
              }
              checked={!form.hasVerified}
              id={"verified-no"}
            />
            <label
              htmlFor={"verified-no"}
              className="form-check-label label-table ml-3"
              style={{ fontWeight: 300 }}
            >
              No
            </label>
          </div>
        </MDBCol>
      </MDBRow>
    </>
  );
};

export default Details;
