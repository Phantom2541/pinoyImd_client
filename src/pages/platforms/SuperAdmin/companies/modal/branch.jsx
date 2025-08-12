import { MDBRow, MDBCol, MDBInput } from "mdbreact";
import AddressSelect from "../../../../../components/searchables/addressSelect";
import EditableSelect from "../../../../../components/customizable/editableSelect";

const Branch = ({
  branch,
  isDuplicate = false,
  setBranch = () => {},
  validateName = () => {},
}) => {
  return (
    <>
      <MDBRow>
        <MDBCol>
          <MDBInput
            label="Name"
            value={branch.name}
            required
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
            value={branch.displayname}
            onChange={({ target }) =>
              setBranch({ ...branch, displayname: target.value })
            }
          />
        </MDBCol>
        <MDBCol>
          <EditableSelect
            className="mt-4"
            preValue={branch.category}
            label="Category"
            collections={["laboratory", "radiology", "diagnostics", "supplier"]}
            onChange={(value) => setBranch({ ...branch, category: value })}
          />
        </MDBCol>
      </MDBRow>

      <MDBRow>
        <MDBCol>
          <MDBInput
            label="Email"
            value={branch?.contacts?.email}
            required
            type="email"
            onChange={({ target }) =>
              setBranch({
                ...branch,
                contacts: { ...branch.contacts, email: target.value },
              })
            }
          />
        </MDBCol>
        <MDBCol>
          <MDBInput
            label="Mobile"
            value={branch?.contacts?.mobile}
            required
            onChange={({ target }) =>
              setBranch({
                ...branch,
                contacts: { ...branch.contacts, mobile: target.value },
              })
            }
          />
        </MDBCol>
      </MDBRow>
      <div className="mt-3">
        <AddressSelect
          address={branch.address}
          isPOS={false}
          handleChange={(key, value) => setBranch({ ...branch, [key]: value })}
        />
      </div>
    </>
  );
};

export default Branch;
