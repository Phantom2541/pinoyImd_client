import React, { useState, useEffect } from "react";
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
import { SEARCH as BRANCHBROWSE } from "../../../../../services/redux/slices/assets/branches";

import {
  BROWSE as COMPANYBROWSE,
  RESET as COMPANYRESET,
} from "../../../../../services/redux/slices/assets/companies";

// declare your expected items
const _form = {
  name: "",
};

export default function Modal({ show, toggle, selected, willCreate }) {
  const { isLoading, collections: companycollect } = useSelector(
      ({ companies }) => companies
    ),
    { collections: branchcollect } = useSelector(({ branches }) => branches),
    { token, onDuty } = useSelector(({ auth }) => auth),
    [companies, setCompanies] = useState(),
    [branches, setBranches] = useState(),
    [form, setForm] = useState(_form),
    { addToast } = useToasts(),
    dispatch = useDispatch();

  useEffect(() => {
    if (token && onDuty._id) {
      dispatch(COMPANYBROWSE({ token }));
    }
    return () => {
      dispatch(COMPANYRESET());
    };
  }, [token, onDuty, dispatch]);

  useEffect(() => {
    if (companycollect || branchcollect) {
      setCompanies(companycollect);
      setBranches(branchcollect);
    }
  }, [companycollect, branchcollect]);

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
      })
    );

    setForm(_form);
  };

  const handleCreate = () => {
    dispatch(
      SAVE({
        data: form,
        token,
      })
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

  const handleChange = (e) => {
    const { value } = e.target;
    const _val = value.split("-");

    dispatch(BRANCHBROWSE({ token, companyId: value }));
    console.log(onDuty);
    setForm({
      ...form,
      name: _val[1],
      vendors: _val[0],
      clients: onDuty._id,
      ao: onDuty?.companyId?.ceo,
    });
  };
  console.log(form);

  return (
    <MDBModal isOpen={show} toggle={toggle} backdrop disableFocusTrap={false}>
      <MDBModalHeader
        toggle={toggle}
        className="light-blue darken-3 white-text"
      >
        <MDBIcon icon="user" className="mr-2" />
        {willCreate ? "Create" : "Update"} {selected.name || "a Tieup"}
      </MDBModalHeader>
      <MDBModalBody className="mb-0">
        <form onSubmit={handleSubmit}>
          <label htmlFor="company">Companies</label>
          <select
            name="company"
            onChange={(e) => handleChange(e)}
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
            onChange={(e) => handleChange(e)}
            className="form-select form-control"
          >
            <option />
            {branches?.map((branch, index) => {
              return (
                <option
                  key={`company-${index}`}
                  value={`${branch._id}-${branch.companyName}`}
                >
                  {branch.name}
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
