import React, { useEffect, useState } from "react";
import { useDispatch, useSelector } from "react-redux";
import {
  MDBBtn,
  MDBModal,
  MDBModalBody,
  MDBIcon,
  MDBModalHeader,
  MDBRow,
  MDBCol,
  MDBInput,
} from "mdbreact";
import {
  EMPLOYEES,
  RESET,
} from "../../../../../services/redux/slices/assets/persons/personnels";
import {
  SAVE,
  UPDATE,
} from "../../../../../services/redux/slices/assets/persons/heads";
import { capitalize, isEqual } from "lodash";
import { useToasts } from "react-toast-notifications";
import { fullName } from "../../../../../services/utilities";
import { Select } from "../../../../../components/customizable";
// import Templates from "../../../../../components/searchables/templates";
import TemplatetUtils from "../../../../../services/fakeDb/diagnostics/templates";
// declare your expected items
const _form = {
  user: "",
  department: "",
  section: "",
};

export default function Modal({ show, toggle, selected, willCreate }) {
  const { isLoading, collections } = useSelector(
      ({ personnels }) => personnels
    ),
    { formSubmitted, isSuccess } = useSelector(({ heads }) => heads),
    [crews, setCrews] = useState([]),
    { token, activePlatform } = useSelector(({ auth }) => auth),
    [form, setForm] = useState(_form),
    [sections, setSections] = useState([]),
    { addToast } = useToasts(),
    dispatch = useDispatch();

  const { department } = activePlatform;

  useEffect(() => {
    if (show && !formSubmitted && isSuccess) {
      toggle();
      setForm(_form);
    }
  }, [formSubmitted, isSuccess, show, toggle, setForm]);

  useEffect(() => {
    if (activePlatform?.branchId && show)
      dispatch(EMPLOYEES({ token, branch: activePlatform?.branchId }));
    return () => dispatch(RESET());
  }, [activePlatform, show, willCreate, dispatch]);

  useEffect(() => {
    const _sections = TemplatetUtils.getComponents(
      department === "laboratory" ? "LAB" : "RAD"
    );
    _sections.push(department === "laboratory" ? "Pathologist" : "Radiologist");
    setSections(_sections);
  }, [department]);

  useEffect(() => {
    setCrews(collections);
  }, [collections]);

  useEffect(() => {
    if (show && !willCreate && selected._id) return setForm(selected);
    setForm(_form);
  }, [show, willCreate, selected]);

  console.log("form", form);
  console.log("selected", selected);
  const handleUpdate = () => {
    // check if object has changed
    if (isEqual(form, selected))
      return addToast("No changes found, skipping update.", {
        appearance: "info",
      });

    dispatch(
      UPDATE({
        data: { ...form, id: selected._id, department },
        token,
      })
    );
  };
  const handleCreate = () => {
    dispatch(
      SAVE({
        data: { ...form, branch: activePlatform?.branchId, department },
        token,
      })
    );
  };

  const handleSubmit = (e) => {
    e.preventDefault();

    if (willCreate) {
      return handleCreate();
    }

    handleUpdate();
  };

  // use for direct values like strings and numbers

  const handleSectionChange = (section) => {
    setForm({
      ...form,
      section,
    });
  };

  const handleStaffChange = (user) => {
    setForm({
      ...form,
      user,
    });
  };

  const { user = {} } =
    [...crews].find(({ user }) => user._id === form?.user) || {};
  const { prc = {} } = user || {};

  return (
    <MDBModal isOpen={show} toggle={toggle} backdrop disableFocusTrap={false}>
      <MDBModalHeader
        toggle={toggle}
        className="light-blue darken-3 white-text"
      >
        <MDBIcon icon="user" className="mr-2" />
        {willCreate ? "Create" : "Update"} {selected.name || " a Tag Staff"}
      </MDBModalHeader>
      <MDBModalBody className="mb-0">
        <form onSubmit={handleSubmit}>
          <MDBRow>
            <MDBCol md="12">
              <Select
                collections={
                  department === "laboratory" ? ["Laboratory"] : ["Radiology"]
                }
                preValue={capitalize(activePlatform.department)}
                label={"Department"}
                multiple={false}
              />
            </MDBCol>
          </MDBRow>
          <MDBRow>
            <MDBCol md={"12"} className="mb-3">
              <Select
                collections={sections}
                onChange={handleSectionChange}
                preValue={form?.section}
                label={"Sections"}
                multiple={false}
              />
            </MDBCol>
          </MDBRow>

          <MDBRow>
            <MDBCol md="12">
              <Select
                collections={crews.map((crew) => ({
                  _id: crew?.user?._id,
                  fullName: fullName(crew?.user?.fullName),
                }))}
                onChange={handleStaffChange}
                preValue={willCreate ? form.user : form?.user?._id}
                label={"Staff"}
                keys={"_id"}
                values={"fullName"}
              />
            </MDBCol>
          </MDBRow>

          {form.user && (
            <MDBRow>
              <MDBCol md="4">
                <MDBInput
                  label="PRC ID"
                  value={form?.prc?.id || prc?.id}
                  onChange={({ target }) =>
                    setForm({ ...form, prc: { ...form.prc, id: target.value } })
                  }
                />
              </MDBCol>
              <MDBCol md="4">
                <MDBInput
                  label="Register"
                  type="date"
                  value={form?.prc?.from || prc?.from}
                  onChange={({ target }) =>
                    setForm({
                      ...form,
                      prc: { ...form.prc, from: target.value },
                    })
                  }
                />
              </MDBCol>
              <MDBCol md="4">
                <MDBInput
                  label="Expiration"
                  type="date"
                  value={form?.prc?.to || prc?.to}
                  onChange={({ target }) =>
                    setForm({ ...form, prc: { ...form.prc, to: target.value } })
                  }
                />
              </MDBCol>
            </MDBRow>
          )}
          <div className="text-center mb-1-half">
            <MDBBtn
              type="submit"
              disabled={isLoading || formSubmitted}
              color="info"
              className="mb-2"
              rounded
            >
              {willCreate ? "submit" : "update"}{" "}
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
