import { useEffect, useState } from "react";
import { useDispatch, useSelector } from "react-redux";
import {
  MDBBtn,
  MDBModal,
  MDBModalBody,
  MDBIcon,
  MDBModalHeader,
  MDBTypography,
  MDBInput,
  MDBRow,
  MDBCol,
} from "mdbreact";
import {
  SAVE,
  UPDATE,
  RESET,
  TOGGLE,
} from "../../../../../services/redux/slices/assets/providers";

import { isEqual } from "lodash";
import { useToasts } from "react-toast-notifications";
import AddressSelect from "../../../../../components/searchables/addressSelect";

export default function Modal() {
  const { token, auth, activePlatform } = useSelector(({ auth }) => auth),
    { showModal, selected, willCreate, isSuccess, formSubmitted } = useSelector(
      ({ providers }) => providers
    ),
    { collections } = useSelector(({ branches }) => branches),
    { collections: companies } = useSelector(({ companies }) => companies),
    [branches, setBranches] = useState([]),
    [form, setForm] = useState(selected),
    { addToast } = useToasts(),
    dispatch = useDispatch();

  //Listener
  useEffect(() => {
    if (showModal) {
      setForm({
        ...selected,
        userId: auth._id,
        clients: activePlatform.branchId,
        address: {},
        status: "pending",
        isRegister: true,
      });
    }
  }, [showModal, selected, auth, activePlatform]);

  useEffect(() => {
    if (showModal && !formSubmitted && isSuccess) {
      dispatch(TOGGLE());
      dispatch(RESET());
    }
  }, [dispatch, showModal, isSuccess, formSubmitted]);

  const companyIsGhost = () => {
    const isGhost = companies.find(
      ({ _id }) => _id === form.companyId
    )?.isGhost;
    if (!isGhost && !form.isRegister) return {};
    return { status: "approved", category: "ghost" };
  };
  // Handle update function
  const handleUpdate = () => {
    // Check if object has changed
    if (isEqual(form, selected)) {
      return addToast("No changes found, skipping update.", {
        appearance: "info",
      });
    }

    dispatch(
      UPDATE({
        data: { ...form, _id: selected._id },
        token,
      })
    );
  };

  // Handle create function
  const handleCreate = () => {
    dispatch(
      SAVE({
        data: { ...form, ...companyIsGhost() },
        token,
      })
    );
  };

  // Handle form submit
  const handleSubmit = (e) => {
    e.preventDefault();
    willCreate ? handleCreate() : handleUpdate();
  };

  // Handle change sa inputs
  const handleChange = (key, value) =>
    setForm({
      ...form,
      [key]: value,
    });

  const handleChangeCompany = (company) => {
    const _branches = [...collections].filter(
      ({ companyId }) => companyId === company
    );
    setForm({ ...form, companyId: company });
    setBranches(_branches);
  };

  return (
    <MDBModal
      isOpen={showModal}
      TOGGLE={TOGGLE}
      backdrop
      size="md"
      disableFocusTrap={false}
    >
      <MDBModalHeader
        toggle={() => dispatch(TOGGLE())}
        className="light-blue darken-3 white-text"
      >
        <MDBIcon icon="user" className="mr-2" />
        {willCreate ? "Apply" : "Update"} Outsource
      </MDBModalHeader>
      <MDBModalBody className="mb-0">
        <form onSubmit={handleSubmit}>
          <div className="text-center mb-3 d-flex align-items-center">
            <MDBTypography
              note
              noteTitle="Notice: "
              noteColor="primary"
              className="mr-3 mb-0"
            >
              Registered With Pinoy IMD?
            </MDBTypography>
            <div>
              <input
                className="form-check-input"
                type="checkbox"
                id="Yes"
                onChange={() =>
                  setForm({ ...form, isRegister: !form.isRegister })
                }
                checked={form.isRegister}
              />
              <label htmlFor="Yes" className="form-check-label  pl-4 mr-4">
                Yes
              </label>
              <input
                checked={!form.isRegister}
                onChange={() =>
                  setForm({ ...form, isRegister: !form.isRegister })
                }
                className="form-check-input"
                type="checkbox"
                id="No"
              />
              <label htmlFor="No" className="form-check-label label-table pl-4">
                No
              </label>
            </div>
          </div>
          <MDBTypography
            tag="h4"
            variant="h4-responsive"
            className="text-center"
          ></MDBTypography>
          {form.isRegister ? (
            <>
              <select
                onChange={(e) => handleChangeCompany(e.target.value)}
                className="form-control mb-3"
                required
              >
                <option value="" disabled>
                  Select a company
                </option>
                {Array.isArray(companies) &&
                  companies.map((company, index) => (
                    <option key={index} value={company._id}>
                      {company.isGhost && "👻"} {company.name}
                    </option>
                  ))}
              </select>
              <select
                value={form?.vendors || ""}
                required
                onChange={(e) => handleChange("vendors", e.target.value)}
                className="form-control"
              >
                <option value="" disabled>
                  Select a branch
                </option>
                {Array.isArray(branches) &&
                  branches.map((branch, index) => (
                    <option key={index} value={branch._id}>
                      {branch.displayname || (branch.name && branch.name)}
                    </option>
                  ))}
              </select>
            </>
          ) : (
            <>
              <MDBRow>
                <MDBCol>
                  <MDBInput
                    label="Company name"
                    required
                    value={form.company}
                    onChange={({ target }) =>
                      setForm({ ...form, company: target.value })
                    }
                  />
                </MDBCol>
                <MDBCol>
                  <MDBInput
                    label="Branch name"
                    required
                    value={form.branch}
                    onChange={({ target }) =>
                      setForm({ ...form, branch: target.value })
                    }
                  />
                </MDBCol>
              </MDBRow>
              <MDBRow>
                <MDBCol>
                  <MDBInput
                    label="Email"
                    type="email"
                    required
                    value={form?.contacts?.person}
                    onChange={({ target }) =>
                      setForm({
                        ...form,
                        contacts: { ...form.contacts, person: target.value },
                      })
                    }
                  />
                </MDBCol>
                <MDBCol>
                  <MDBInput
                    label="Contact number"
                    required
                    value={form?.contacts?.mobile}
                    onChange={({ target }) =>
                      setForm({
                        ...form,
                        contacts: { ...form.contacts, mobile: target.value },
                      })
                    }
                  />
                </MDBCol>
              </MDBRow>
              <AddressSelect
                address={form.address}
                required
                handleChange={(key, value) =>
                  setForm({ ...form, [key]: value })
                }
              />
            </>
          )}
          <div className="text-center mb-1-half mt-3">
            <MDBBtn
              type="submit"
              disabled={formSubmitted}
              color="info"
              className="mb-2"
              rounded
            >
              {willCreate ? "Apply" : "Update"}
              {formSubmitted && (
                <MDBIcon icon="spinner" pulse className="ml-2" />
              )}
            </MDBBtn>
          </div>
        </form>
      </MDBModalBody>
    </MDBModal>
  );
}
