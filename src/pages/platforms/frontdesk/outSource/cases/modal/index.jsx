import React, { useState, useEffect } from "react";
import {
  MDBModal,
  MDBModalBody,
  MDBModalHeader,
  MDBInput,
  MDBBtn,
} from "mdbreact";
import { useDispatch } from "react-redux";
import {
  SAVE,
  UPDATE,
} from "../../../../../../services/redux/slices/diagnostics/cases";

const CaseModal = ({ modal, toggle, selected = {} }) => {
  const dispatch = useDispatch();

  const [form, setForm] = useState({
    pId: "",
    caseNumber: "",
    title: "",
    description: "",
    remarks: "",
    assignedAt: "",
    notes: "",
    tag: "",
  });

  const descriptionOptions = [
    "Patient admitted for severe chest pain",
    "Referred case with high fever",
    "General consultation, no complaints",
    "Admitted for abdominal pain",
    "Transferred for observation",
  ];

  const remarksOptions = [
    "Monitored closely due to elevated BP",
    "For follow-up diagnostics",
    "Scheduled for surgery",
    "Patient stable",
    "Needs hydration and monitoring",
  ];

  const notesOptions = [
    "Primary attending",
    "On-call physician",
    "Follow-up recommended",
    "Requires close observation",
    "Special instructions provided",
  ];

  const tagOptions = [
    "Urgent",
    "Emergency",
    "Pedia",
    "Charity",
    "Surgery",
    "Critical",
    "Special Case",
  ];

  useEffect(() => {
    if (selected && selected._id) {
      const attending = selected.ap?.[0] || {};
      setForm({
        ...selected,
        assignedAt: attending.assignedAt || "",
        notes: attending.notes || "",
        tag: attending.tag || "",
      });
    } else {
      setForm({
        pId: "",
        caseNumber: "",
        title: "",
        description: "",
        remarks: "",
        assignedAt: "",
        notes: "",
        tag: "",
      });
    }
  }, [selected]);

  const handleChange = ({ target }) => {
    setForm({ ...form, [target.name]: target.value });
  };

  const handleSubmit = () => {
    const newCase = {
      ...form,
      ap: [
        {
          userId: form.pId,
          assignedAt: form.assignedAt,
          notes: form.notes,
          tag: form.tag,
        },
      ],
    };

    if (form._id) {
      dispatch(UPDATE({ data: newCase, token: "" }));
    } else {
      dispatch(SAVE({ data: newCase, token: "" }));
    }

    toggle();
  };

  return (
    <MDBModal isOpen={modal} toggle={toggle} centered>
      <MDBModalHeader toggle={toggle}>
        {form._id ? "Edit Case" : "New Case"}
      </MDBModalHeader>
      <MDBModalBody>
        <MDBInput
          label="Patient ID"
          name="pId"
          value={form.pId}
          onChange={handleChange}
        />
        <MDBInput
          label="Case Number"
          name="caseNumber"
          value={form?.caseNumber || ""}
          onChange={handleChange}
        />
        <MDBInput
          label="Case Title"
          name="title"
          value={form.title}
          onChange={handleChange}
        />

        <label>Description</label>
        <select
          className="browser-default custom-select mb-3"
          name="description"
          value={form.description}
          onChange={handleChange}
        >
          <option value="">Choose description</option>
          {descriptionOptions.map((desc, i) => (
            <option key={i} value={desc}>
              {desc}
            </option>
          ))}
        </select>

        <label>Remarks</label>
        <select
          className="browser-default custom-select mb-3"
          name="remarks"
          value={form.remarks}
          onChange={handleChange}
        >
          <option value="">Choose remarks</option>
          {remarksOptions.map((rem, i) => (
            <option key={i} value={rem}>
              {rem}
            </option>
          ))}
        </select>

        <MDBInput
          label="Assigned At"
          type="datetime-local"
          name="assignedAt"
          value={form.assignedAt}
          onChange={handleChange}
        />

        <label>Notes</label>
        <select
          className="browser-default custom-select mb-3"
          name="notes"
          value={form.notes}
          onChange={handleChange}
        >
          <option value="">Choose notes</option>
          {notesOptions.map((note, i) => (
            <option key={i} value={note}>
              {note}
            </option>
          ))}
        </select>

        <label>Tag</label>
        <select
          className="browser-default custom-select mb-3"
          name="tag"
          value={form.tag}
          onChange={handleChange}
        >
          <option value="">Choose tag</option>
          {tagOptions.map((tag, i) => (
            <option key={i} value={tag}>
              {tag}
            </option>
          ))}
        </select>

        <MDBBtn color="primary" block onClick={handleSubmit}>
          {form._id ? "Update" : "Save"}
        </MDBBtn>
      </MDBModalBody>
    </MDBModal>
  );
};

export default CaseModal;
