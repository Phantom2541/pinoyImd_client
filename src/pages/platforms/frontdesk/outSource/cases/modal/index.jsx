import React, { useState, useEffect } from "react";
import {
  MDBModal,
  MDBModalBody,
  MDBModalHeader,
  MDBInput,
  MDBBtn,
} from "mdbreact";
import { useDispatch } from "react-redux";
import { SAVE, UPDATE } from "../../../../../../services/redux/slices/commerce/pos/services/cases";

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
  });

  useEffect(() => {
    if (selected && selected._id) {
      const attending = selected.ap?.[0] || {};
      setForm({
        ...selected,
        assignedAt: attending.assignedAt || "",
        notes: attending.notes || "",
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
          userId: form.pId, // assuming pId is userId for attending physician
          assignedAt: form.assignedAt,
          notes: form.notes,
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
          value={form.caseNumber}
          onChange={handleChange}
        />
        <MDBInput
          label="Case Title"
          name="title"
          value={form.title}
          onChange={handleChange}
        />
        <MDBInput
          label="Description"
          name="description"
          value={form.description}
          onChange={handleChange}
        />
        <MDBInput
          label="Remarks"
          name="remarks"
          value={form.remarks}
          onChange={handleChange}
        />
        <MDBInput
          label="Assigned At"
          type="datetime-local"
          name="assignedAt"
          value={form.assignedAt}
          onChange={handleChange}
        />
        <MDBInput
          label="Notes"
          name="notes"
          value={form.notes}
          onChange={handleChange}
        />
        <MDBBtn color="primary" block onClick={handleSubmit}>
          {form._id ? "Update" : "Save"}
        </MDBBtn>
      </MDBModalBody>
    </MDBModal>
  );
};

export default CaseModal;
