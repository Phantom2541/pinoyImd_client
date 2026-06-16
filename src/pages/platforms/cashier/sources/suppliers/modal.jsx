import { useCallback, useEffect, useMemo, useState } from "react";
import { useDispatch, useSelector } from "react-redux";
import {
  MDBBtn,
  MDBModal,
  MDBModalBody,
  MDBIcon,
  MDBModalHeader,
  MDBInput,
  MDBCol,
  MDBRow,
  MDBBadge,
} from "mdbreact";
import {
  SAVE,
  UPDATE,
  TOGGLE,
} from "../../../../../services/redux/slices/assets/providers";

import { isEqual } from "lodash";
import { useToasts } from "react-toast-notifications";
import Spinner from "../../../../../components/spinner";
import AddressSelect from "../../../../../components/searchables/addressSelect";

export default function Modal() {
  const { token, auth, activePlatform } = useSelector(({ auth }) => auth),
    { showModal, selected, willCreate, isSuccess, formSubmitted } = useSelector(
      ({ providers }) => providers
    ),
    { collections: companies = [] } = useSelector(({ companies }) => companies),
    [form, setForm] = useState(selected),
    [branches, setBranches] = useState([]),
    { addToast } = useToasts(),
    dispatch = useDispatch();

  const toggle = useCallback(() => dispatch(TOGGLE()), [dispatch]);

  const supplierCompanies = useMemo(
    () => companies.filter(({ category }) => category === "supplier"),
    [companies]
  );

  useEffect(() => {
    if (!formSubmitted && isSuccess && showModal) {
      toggle();
    }
  }, [formSubmitted, isSuccess, showModal, toggle]);

  //Listener
  useEffect(() => {
    if (showModal) {
      const vendorBranch = selected?.vendors || {};
      const vendorCompany = vendorBranch?.companyId || {};
      const isRegisteredSupplier = Boolean(vendorBranch?._id);

      setForm({
        ...selected,
        userId: auth._id,
        clients: activePlatform.branchId,
        category: "supplier",
        status: selected?.status || "pending",
        address: isRegisteredSupplier
          ? vendorBranch?.address || {}
          : selected?.address || {},
        contacts: isRegisteredSupplier
          ? vendorBranch?.contacts || {}
          : selected?.contacts || {},
        isRegister:
          typeof selected?.isRegister === "boolean"
            ? selected.isRegister
            : isRegisteredSupplier,
        companyId: vendorCompany?._id || "",
        branchId: vendorBranch?._id || "",
        company: vendorCompany?.name || selected?.company || "",
        branch:
          vendorBranch?.displayname || vendorBranch?.name || selected?.branch || "",
      });
    }
  }, [showModal, selected, auth, activePlatform]);

  useEffect(() => {
    if (!showModal) return;

    const selectedCompany = supplierCompanies.find(
      ({ _id }) => String(_id) === String(form?.companyId || "")
    );

    setBranches(selectedCompany?.branches || []);
  }, [showModal, supplierCompanies, form?.companyId]);

  const formatAddress = (address = {}) =>
    [address?.street, address?.barangay, address?.city, address?.province]
      .filter(Boolean)
      .join(", ");

  const buildRegisteredPayload = () => {
    const selectedCompany = supplierCompanies.find(
      ({ _id }) => String(_id) === String(form.companyId)
    );
    const selectedBranch = branches.find(
      ({ _id }) => String(_id) === String(form.branchId)
    );

    if (!selectedCompany || !selectedBranch) {
      addToast("Select a registered supplier company and branch.", {
        appearance: "warning",
      });
      return null;
    }

    return {
      ...form,
      vendors: selectedBranch._id,
      name: selectedCompany.name,
      subName: selectedCompany.subName || "",
      displayname: selectedBranch.displayname || selectedBranch.name,
      abbr: selectedBranch.abbr || selectedCompany.abbr || "",
      number:
        selectedBranch?.contacts?.mobile || selectedCompany?.contacts?.mobile || "",
      address: formatAddress(selectedBranch.address),
      status: selectedCompany.isGhost ? "approved" : form.status,
    };
  };

  // Handle update function
  const handleUpdate = () => {
    const payload = form.isRegister ? buildRegisteredPayload() : form;

    if (!payload) return;

    if (isEqual(payload, selected)) {
      return addToast("No changes found, skipping update.", {
        appearance: "info",
      });
    }

    dispatch(
      UPDATE({
        data: { ...payload, _id: selected._id },
        token,
      })
    );
  };

  const handleCreate = () => {
    if (form.isRegister) {
      const payload = buildRegisteredPayload();
      if (!payload) return;

      return dispatch(
        SAVE({
          data: payload,
          token,
        })
      );
    }

    dispatch(
      SAVE({
        data: form,
        token,
      })
    );
  };

  const handleSubmit = (e) => {
    e.preventDefault();
    willCreate ? handleCreate() : handleUpdate();
  };

  // Handle change sa inputs
  const handleChange = (key, value) => {
    setForm({
      ...form,
      [key]: value,
    });
  };

  const handleChangeCompany = (companyId) => {
    if (companyId === "__register__") {
      setBranches([]);
      return setForm({
        ...form,
        isRegister: false,
        companyId: "",
        branchId: "",
        vendors: "",
      });
    }

    const selectedCompany = supplierCompanies.find(
      ({ _id }) => String(_id) === String(companyId)
    );
    const companyBranches = selectedCompany?.branches || [];

    setBranches(companyBranches);
    setForm({
      ...form,
      companyId,
      branchId: "",
      vendors: "",
    });
  };

  return (
    <MDBModal
      isOpen={showModal}
      toggle={toggle}
      backdrop
      size="md"
      disableFocusTrap={false}
    >
      <MDBModalHeader
        toggle={() => toggle()}
        className="light-blue darken-3 white-text"
      >
        <MDBIcon icon="user" className="mr-2" />
        {willCreate ? "Create" : "Update"} Supplier
      </MDBModalHeader>
      <MDBModalBody className="mb-0">
        <form onSubmit={handleSubmit}>
          <div
            className="mb-4 p-3"
            style={{
              background: "#f4f8fc",
              border: "1px solid #d8e7f5",
              borderRadius: "12px",
            }}
          >
            <div className="d-flex justify-content-between align-items-start flex-wrap">
              <div className="pr-3">
                <div
                  className="font-weight-bold text-dark mb-1"
                  style={{ fontSize: "0.95rem" }}
                >
                  Supplier Source
                </div>
                <div className="text-muted" style={{ fontSize: "0.85rem" }}>
                  Select an existing supplier company, or use the register
                  option below if it is not in the list yet.
                </div>
              </div>
              <MDBBadge color={form.isRegister ? "primary" : "warning"}>
                {form.isRegister ? "Registered" : "Register New"}
              </MDBBadge>
            </div>
            <div className="d-flex align-items-center mt-3">
              <button
                type="button"
                className={`btn btn-sm mr-2 ${
                  form.isRegister ? "btn-primary" : "btn-outline-primary"
                }`}
                onClick={() => setForm({ ...form, isRegister: true })}
              >
                <MDBIcon icon="database" className="mr-1" />
                Registered
              </button>
              <button
                type="button"
                className={`btn btn-sm ${
                  !form.isRegister ? "btn-warning" : "btn-outline-warning"
                }`}
                onClick={() => {
                  setForm({
                    ...form,
                    isRegister: false,
                    companyId: "",
                    branchId: "",
                    vendors: "",
                  });
                }}
              >
                <MDBIcon icon="plus" className="mr-1" />
                Register Company
              </button>
            </div>
          </div>

          {form.isRegister ? (
            <>
              <div className="mb-2 font-weight-bold text-dark">
                Select Registered Supplier
              </div>
              <select
                value={form?.companyId || ""}
                onChange={(e) => handleChangeCompany(e.target.value)}
                className="form-control mb-3"
                required
              >
                <option value="" disabled>
                  Select a company
                </option>
                {supplierCompanies.map((company) => (
                  <option key={company._id} value={company._id}>
                    {company.name}
                  </option>
                ))}
                <option value="__register__">+ Register company</option>
              </select>
              <label className="font-weight-bold text-muted mb-1">
                Branch
              </label>
              <select
                value={form?.branchId || ""}
                required={Boolean(form.companyId)}
                onChange={(e) => handleChange("branchId", e.target.value)}
                className="form-control mb-3"
                disabled={!form.companyId}
              >
                <option value="" disabled>
                  Select a branch
                </option>
                {branches.map((branch) => (
                  <option key={branch._id} value={branch._id}>
                    {branch.displayname || branch.name}
                    {branch.isMain ? " (main branch)" : ""}
                  </option>
                ))}
              </select>
            </>
          ) : (
            <>
              {!form.isRegister && (
                <div className="mb-2 font-weight-bold text-dark">
                  Manual Supplier Details
                </div>
              )}
              <MDBInput
                label="Name"
                value={form?.displayname}
                required
                onChange={(e) => handleChange("displayname", e.target.value)}
              />
              <MDBInput
                label="Abbreviation"
                value={form?.abbr}
                required
                onChange={(e) => handleChange("abbr", e.target.value)}
              />
              <MDBInput
                label="Number"
                value={form?.number}
                onChange={(e) => handleChange("number", e.target.value)}
              />
              {!form.isRegister ? (
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
                        value={form?.contacts?.email}
                        onChange={({ target }) =>
                          setForm({
                            ...form,
                            contacts: {
                              ...form.contacts,
                              email: target.value,
                            },
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
                            contacts: {
                              ...form.contacts,
                              mobile: target.value,
                            },
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
              ) : (
                <MDBInput
                  label="Address"
                  value={form?.address}
                  onChange={(e) => handleChange("address", e.target.value)}
                />
              )}
            </>
          )}
          <div className="mt-3">
            <label
              className="font-weight-bold text-muted mb-1"
              style={{ display: "block", fontSize: "0.8rem" }}
            >
              Status
            </label>
            <select
              value={form?.status}
              onChange={(e) => handleChange("status", e.target.value)}
              className="form-control"
            >
              <option value="pending">Pending</option>
              <option value="approved">Approved</option>
              <option value="denied">Denied</option>
            </select>
          </div>

          <div className="d-flex justify-content-end mt-4">
            <MDBBtn
              type="submit"
              disabled={formSubmitted}
              color="info"
              className="mb-0 px-4"
              rounded
            >
              {willCreate ? "Save Supplier" : "Update Supplier"}
              <Spinner formSubmitted={formSubmitted} />
            </MDBBtn>
          </div>
        </form>
      </MDBModalBody>
    </MDBModal>
  );
}
