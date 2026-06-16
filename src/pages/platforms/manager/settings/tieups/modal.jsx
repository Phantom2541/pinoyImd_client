import React, { useState, useEffect, useMemo } from "react";
import { useDispatch, useSelector } from "react-redux";
import {
  MDBBtn,
  MDBModal,
  MDBModalBody,
  MDBIcon,
  MDBModalHeader,
} from "mdbreact";
import {
  SAVE,
  UPDATE,
} from "../../../../../services/redux/slices/assets/providers";
import { isEqual } from "lodash";
import { useToasts } from "react-toast-notifications";

import {
  BROWSE as COMPANYBROWSE,
  RESET as COMPANYRESET,
} from "../../../../../services/redux/slices/assets/companies";

// declare your expected items
const _form = {
  name: "",
  category: "ctr", // ctr: contractor
};

const getBranchLabel = (branch = {}) => {
  const branchName = branch?.displayname || branch?.name || "";

  if (!branchName) return "";

  return branch?.isMain ? `${branchName} (main branch)` : branchName;
};

export default function Modal({ show, toggle, selected, willCreate }) {
  const { isLoading, collections: companycollect } = useSelector(
      ({ companies }) => companies,
    ),
    { token, activePlatform } = useSelector(({ auth }) => auth),
    [companies, setCompanies] = useState([]),
    [form, setForm] = useState(_form),
    { addToast } = useToasts(),
    dispatch = useDispatch();

  const selectedCompany = useMemo(
    () =>
      companies.find(
        ({ _id }) => String(_id) === String(form?.companyId || form?.vendors),
      ) || null,
    [companies, form?.companyId, form?.vendors],
  );

  const branches = useMemo(
    () => selectedCompany?.branches || [],
    [selectedCompany],
  );

  useEffect(() => {
    if (token && activePlatform?.branchId) {
      dispatch(COMPANYBROWSE({ token }));
    }
    return () => {
      dispatch(COMPANYRESET());
    };
  }, [token, activePlatform, dispatch]);

  useEffect(() => {
    setCompanies(companycollect || []);
  }, [companycollect]);

  useEffect(() => {
    if (!show) return;

    if (willCreate) {
      return setForm(_form);
    }

    const companyId =
      selected?.vendors?.companyId?._id || selected?.companyId || "";
    const branchId = selected?.vendors?._id || selected?.vendors || "";

    setForm({
      ...selected,
      category: selected?.category || "ctr",
      companyId,
      vendors: branchId,
      clients: activePlatform?.branchId,
      ao: activePlatform?.companyId?.ceo,
    });
  }, [show, selected, willCreate, activePlatform]);

  const handleUpdate = () => {
    toggle();

    // check if object has changed
    if (isEqual(form, selected))
      return addToast("No changes found, skipping update.", {
        appearance: "info",
      });

    dispatch(
      UPDATE({
        data: { ...form, _id: selected._id },
        token,
      }),
    );

    setForm(_form);
  };

  const handleCreate = () => {
    dispatch(
      SAVE({
        data: form,
        token,
      }),
    );

    setForm(_form);
    toggle();
  };

  const handleSubmit = (e) => {
    e.preventDefault();

    if (willCreate) {
      return handleCreate();
    }

    handleUpdate();
  };

  const handleCompanyChange = (e) => {
    const { value } = e.target;

    setForm({
      ...form,
      category: form?.category || "ctr",
      companyId: value,
      vendors: "",
      clients: activePlatform?.branchId,
      ao: activePlatform?.companyId?.ceo,
    });
  };

  const handleBranchChange = (e) => {
    const { value } = e.target;
    const branch = branches.find(({ _id }) => String(_id) === String(value));

    setForm({
      ...form,
      category: form?.category || "ctr",
      vendors: value,
      name: selectedCompany?.name || "",
      subName: getBranchLabel(branch),
      clients: activePlatform?.branchId,
      ao: activePlatform?.companyId?.ceo,
    });
  };

  return (
    <MDBModal isOpen={show} toggle={toggle} backdrop disableFocusTrap={false}>
      <MDBModalHeader
        toggle={toggle}
        className="light-blue darken-3 white-text"
      >
        <MDBIcon icon="user" className="mr-2" />
        {willCreate ? "Tag" : "Update"} {selected.name || "New Company Tieup"}
      </MDBModalHeader>
      <MDBModalBody className="mb-0">
        <form onSubmit={handleSubmit}>
          <label htmlFor="company">Companies</label>
          <select
            name="company"
            value={form?.companyId || ""}
            onChange={handleCompanyChange}
            className="form-select form-control"
          >
            <option />
            {companies?.map((company, index) => {
              return (
                <option key={`company-${index}`} value={company._id}>
                  {`${company.name} ${company.subName}`}
                </option>
              );
            })}
          </select>
          <label htmlFor="company">Branch</label>
          <select
            name="vendors"
            value={form?.vendors || ""}
            onChange={handleBranchChange}
            className="form-select form-control"
            disabled={!form?.companyId}
          >
            <option />
            {branches?.map((branch, index) => {
              return (
                <option key={`company-${index}`} value={branch._id}>
                  {getBranchLabel(branch)}
                </option>
              );
            })}
          </select>
          <div className="text-center mb-1-half">
            <MDBBtn
              type="submit"
              disabled={isLoading}
              color="info"
              className="mb-2"
              rounded
            >
              {willCreate ? "submit" : "update"}
            </MDBBtn>
          </div>
        </form>
      </MDBModalBody>
    </MDBModal>
  );
}
