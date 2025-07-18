import React, { useState, useEffect, useCallback } from "react";
import {
  MDBModal,
  MDBModalBody,
  MDBIcon,
  MDBModalHeader,
  MDBRow,
  MDBCol,
  MDBInput,
  MDBBtn,
} from "mdbreact";
import {
  TOGGLE,
  SAVE,
  RESET,
} from "../../../../../services/redux/slices/assets/companies";
import { useDispatch, useSelector } from "react-redux";
// import AddressSelect from "../../../../../components/searchables/addressSelect";
import Search from "../../../../../components/searchables/ao";
// import { Policy } from "../../../../../services/fakeDb";
import Swal from "sweetalert2";
import AddressSelect from "../../../../../components/searchables/addressSelect";
const _form = {
  ceo: "",
  name: "",
  subName: "",
  tagline: "",
  isHiring: false,
  hasVerified: false,
  approved: true,
};
export default function Modal() {
  const { token, auth } = useSelector(({ auth }) => auth),
    {
      showModal: show,
      selected,
      collections = [],
      formSubmitted,
      isSuccess,
    } = useSelector(({ companies }) => companies),
    [form, setForm] = useState(_form),
    [branch, setBranch] = useState({
      isMain: true,
      address: { region: "REGION III (CENTRAL LUZON)" },
    }),
    [isDuplicate, setIsDuplicate] = useState(false),
    dispatch = useDispatch();

  const toggle = useCallback(() => dispatch(TOGGLE()), [dispatch]);

  useEffect(() => {
    if (show && !formSubmitted && isSuccess) {
      toggle();
      Swal.fire({
        title: "Success!",
        text: "Company has been successfully created.",
        icon: "success",
        confirmButtonColor: "#3085d6",
        confirmButtonText: "OK",
      });
      dispatch(RESET());
    }
  }, [show, dispatch, toggle, formSubmitted, isSuccess]);

  useEffect(() => {
    if (show) {
      setForm((prev) => ({ ...prev, name: selected.name }));
    }
  }, [show, selected]);

  const normalize = (value) =>
    value
      .toLowerCase()
      .trim()
      .normalize("NFD")
      .replace(/[\u0300-\u036f]/g, "")
      .replace(/[^a-zA-Z0-9]/g, "");
  const validateName = (name) => {
    const isExist = [...collections].some(
      (branch) => normalize(branch.name) === normalize(name)
    );

    setIsDuplicate(isExist);
    setForm({ ...form, name });
  };

  const handleSubmit = (e) => {
    e.preventDefault();
    dispatch(
      SAVE({
        token,
        data: { company: form, branch, authID: auth._id },
      })
    );
  };

  return (
    <MDBModal size="lg" isOpen={show} toggle={toggle} backdrop>
      <MDBModalHeader
        toggle={toggle}
        className="light-blue darken-3 white-text"
      >
        <MDBIcon icon="code-branch" className="mr-2" />
        Add a Company
      </MDBModalHeader>
      <MDBModalBody className="mb-0">
        <form onSubmit={handleSubmit}>
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
                required
                value={form.subName}
                onChange={({ target }) =>
                  setForm({ ...form, subName: target.value })
                }
              />
            </MDBCol>
            <MDBCol className="d-flex align-items-center w-100">
              <div className={`w-100 ${form.ceo && "mt-4"}`}>
                <Search
                  label="CEO"
                  setUser={(value) => setForm({ ...form, ceo: value || "" })}
                  className="mt-4"
                />
              </div>
            </MDBCol>
          </MDBRow>

          <MDBRow>
            <MDBCol md="12">
              <MDBInput
                required
                label="Tagline"
                value={form.tagline}
                onChange={({ target }) =>
                  setForm({
                    ...form,
                    tagline: target.value,
                  })
                }
              />
            </MDBCol>
          </MDBRow>
          <MDBRow>
            <MDBCol md="12">
              <MDBInput
                required
                label="Description"
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
                  onChange={() =>
                    setForm({ ...form, isHiring: !form.isHiring })
                  }
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
          <hr />
          <span className="fw-bold">Main Branch</span>

          <MDBRow>
            <MDBCol>
              <MDBInput
                label="Name"
                value={branch.name}
                required
                onChange={({ target }) =>
                  setBranch({ ...branch, name: target.value })
                }
              />
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
          <AddressSelect
            address={branch.address}
            handleChange={(key, value) =>
              setBranch({ ...branch, [key]: value })
            }
          />
          <MDBBtn
            rounded
            className="float-right mt-4"
            type="submit"
            color="primary"
            disabled={isDuplicate || formSubmitted}
          >
            Save {formSubmitted && <MDBIcon icon="spinner" pulse />}
          </MDBBtn>
        </form>
      </MDBModalBody>
    </MDBModal>
  );
}
