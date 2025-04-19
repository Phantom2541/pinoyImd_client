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
} from "../../../../../../services/redux/slices/assets/branches";
import { useDispatch, useSelector } from "react-redux";
import AddressSelect from "../../../../../../components/searchables/addressSelect";
import Search from "../../../../../../components/searchables/ao";
import { Policy } from "../../../../../../services/fakeDb";
import Swal from "sweetalert2";
const _form = {
  ao: "",
  name: "",
  displayname: "",
  contact: {
    mobile: "",
    email: "",
  },
  address: {
    region: "REGION III (CENTRAL LUZON)",
    province: "NUEVA ECIJA",
    city: "GENERAL TINIO (PAPAYA)",
    barangay: "Pias",
  },
};
export default function Modal() {
  const { auth, token, activePlatform } = useSelector(({ auth }) => auth),
    {
      showModal: show,
      selected,
      collections = [],
      formSubmitted,
      isSuccess,
    } = useSelector(({ branches }) => branches),
    [form, setForm] = useState(_form),
    [isDuplicate, setIsDuplicate] = useState(false),
    dispatch = useDispatch();

  const toggle = useCallback(() => dispatch(TOGGLE()), [dispatch]);

  useEffect(() => {
    if (show && !formSubmitted && isSuccess) {
      toggle();
      Swal.fire({
        title: "Success!",
        text: "Branch has been successfully created.",
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
        data: {
          branch: {
            ...form,
            companyId: activePlatform?.branch?.companyId?._id,
          },
          authID: auth._id,
        },
      })
    );
  };

  const sortByAscending = (array, key) => {
    return [...array].sort((a, b) =>
      String(a[key]).localeCompare(String(b[key]))
    );
  };
  return (
    <MDBModal size="lg" isOpen={show} toggle={toggle} backdrop>
      <MDBModalHeader
        toggle={toggle}
        className="light-blue darken-3 white-text"
      >
        <MDBIcon icon="code-branch" className="mr-2" />
        Add a Branch
      </MDBModalHeader>
      <MDBModalBody className="mb-0">
        <form onSubmit={handleSubmit}>
          <MDBRow>
            <MDBCol md="6">
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
                label="Display Name"
                required
                value={form.displayname}
                onChange={({ target }) =>
                  setForm({ ...form, displayname: target.value })
                }
              />
            </MDBCol>
          </MDBRow>
          <MDBRow>
            <MDBCol>
              <MDBInput
                required
                label="Mobile"
                value={form.contact?.mobile}
                onChange={({ target }) =>
                  setForm({
                    ...form,
                    contact: { ...form.contact, mobile: target.value },
                  })
                }
              />
            </MDBCol>
            <MDBCol>
              <MDBInput
                required
                label="Email"
                type="email"
                value={form.contact?.email}
                onChange={({ target }) =>
                  setForm({
                    ...form,
                    contact: { ...form.contact, email: target.value },
                  })
                }
              />
            </MDBCol>
          </MDBRow>
          <div className={!form.ao ? "" : "border border-black p-2 mb-3"}>
            <Search
              isRequired={true}
              label="Administrative Officer"
              setUser={(value) => setForm({ ...form, ao: value?._id || "" })}
              className="mt-4"
            />
            {form.ao && (
              <MDBRow className="mb-">
                <MDBCol>
                  <select
                    className="form-control"
                    required
                    value={form.department}
                    onChange={({ target }) =>
                      setForm({
                        ...form,
                        department: target.value,
                        designation: "",
                      })
                    }
                  >
                    <option value="">Select Department</option>
                    {sortByAscending(Policy.collections, "department").map(
                      (p) => (
                        <option value={p.department}>{p.department}</option>
                      )
                    )}
                  </select>
                </MDBCol>
                <MDBCol>
                  <select
                    className="form-control"
                    required
                    value={form.designation}
                    onChange={({ target }) =>
                      setForm({
                        ...form,
                        designation: target.value,
                      })
                    }
                  >
                    <option value={""}>Select Designation</option>
                    {sortByAscending(
                      Policy.getPositionsByDepartmentName(form.department),
                      "display_name"
                    ).map((p) => (
                      <option value={p.id}>{p.display_name}</option>
                    ))}
                  </select>
                </MDBCol>
              </MDBRow>
            )}
          </div>
          <AddressSelect
            address={form.address}
            handleChange={(key, value) => setForm({ ...form, [key]: value })}
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
