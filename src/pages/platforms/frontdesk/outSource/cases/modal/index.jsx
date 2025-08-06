import React, { useState, useEffect } from "react";
import { MDBModal, MDBModalBody, MDBModalHeader, MDBInput, MDBBtn } from "mdbreact";
import { useDispatch } from "react-redux";
import { SAVE, UPDATE } from "../../../../../../services/redux/slices/commerce/pos/services/cases";

const CaseModal = ({ modal, toggle, selected = {} }) => {
  const dispatch = useDispatch();
  const [form, setForm] = useState({
    pId: "",
    caseNumber: "",
    title: "",
    reason: "",
  });

  useEffect(() => {
    if (selected && selected._id) {
      setForm(selected);
    } else {
      setForm({
        pId: "",
        caseNumber: "",
        title: "",
        reason: "",
      });
    }
  }, [selected]);

  const handleChange = ({ target }) => {
    setForm({ ...form, [target.name]: target.value });
  };

  const handleSubmit = () => {
    if (form._id) {
      dispatch(UPDATE({ data: form, token: "" }));
    } else {
      dispatch(SAVE({ data: form, token: "" }));
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
          label="Reason for Admission"
          name="reason"
          value={form.reason}
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
