import React, { useEffect, useState } from "react";
import { useDispatch, useSelector } from "react-redux";
import {
  SAVE,
  SetCloseModal,
} from "../../../../../../services/redux/slices/finance/journals/payables.js";
import {
  MDBModal,
  MDBModalHeader,
  MDBModalBody,
  MDBInput,
  MDBRow,
  MDBCol,
  MDBBtn,
} from "mdbreact";
import { Statements } from "../../../../../../services/fakeDb";
import CustomSelect from "../../../../../../components/searchables/customSelect";
import { SearchUser } from "../../../../../../components/searchables";

export default function ModalCreate() {
  const dispatch = useDispatch();
  const { showPayablesModal, selected } = useSelector(
    ({ payables }) => payables
  );
  const { collections = [] } = useSelector(({ providers }) => providers);
  const { token, activePlatform } = useSelector(({ auth }) => auth);

  const [form, setForm] = useState(selected || { range: ["", ""] }, {
    patient: null,
  });

  useEffect(() => {
    setForm(selected || { range: ["", ""] });
  }, [showPayablesModal, selected]);

  const handleClose = () => {
    dispatch(SetCloseModal(false));
  };

  const handleSave = () => {
    const formData = {
      ...form,
      branchId: activePlatform.branchId,
      range: form.range || ["", ""],
    };

    dispatch(SAVE({ data: formData, token }));
    handleClose();
  };

  return (
    <MDBModal
      isOpen={showPayablesModal}
      toggle={handleClose}
      backdrop={false}
      size="m"
    >
      <MDBModalHeader
        toggle={handleClose}
        className="light-blue darken-3 white-text"
      >
        Payables
      </MDBModalHeader>
      <MDBModalBody className="mb-0">
        <CustomSelect
          choices={
            Array.isArray(Statements?.collections)
              ? Statements.collections.filter(
                  (statement) => statement?.category === "expenses"
                )
              : []
          }
          label={"Expense Account"}
          values={"id"}
          texts={"title"}
          onChange={(value) => setForm({ ...form, fsId: Number(value) })}
        />
        <select
          className="browser-default custom-select"
          value={form.orOption || ""}
          onChange={(e) => {
            // console.log("New Value Selected:", e.target.value); // Debugging log
            setForm({ ...form, orOption: e.target.value });
          }}
        >
          <option value="" disabled>
            Select
          </option>
          <option value="Particular">Particular</option>
          <option value="Supplier">Supplier</option>
        </select>
        {/* Conditionally render the correct input based on selection */}
        {form.orOption === "Particular" ? (
          <>
            <br />
            <SearchUser
              setPatient={(user) => setForm({ ...form, patient: user })}
            />
          </>
        ) : form.orOption === "Supplier" ? (
          <CustomSelect
            choices={
              Array.isArray(collections)
                ? collections
                    .map((item) => ({
                      value: item._id, // Ensure _id exists
                      label: item.name?.trim(), // Use `name`, trim whitespace
                    }))
                    .filter((item) => item.label) // Remove items with empty or undefined labels
                : []
            }
            label="Supplier"
            values="value"
            texts="label"
            onChange={(e) => setForm({ ...form, supplier: e })}
          />
        ) : null}{" "}
        <MDBInput
          label="Amount"
          type="number"
          value={form.amount || ""}
          onChange={({ target }) =>
            setForm({ ...form, amount: Number(target.value) })
          }
        />
        <h5>
          <b>Range</b>
        </h5>
        <MDBRow>
          <MDBCol>
            <MDBInput
              label="Date From"
              type="date"
              value={form.range?.[0] || ""}
              onChange={({ target }) =>
                setForm({
                  ...form,
                  range: [target.value, form.range?.[1] || ""],
                })
              }
            />
          </MDBCol>
          <MDBCol>
            <MDBInput
              label="Date To"
              type="date"
              value={form.range?.[1] || ""}
              onChange={({ target }) =>
                setForm({
                  ...form,
                  range: [form.range?.[0] || "", target.value],
                })
              }
            />
          </MDBCol>
        </MDBRow>
        <h5>
          <b>Due Date</b>
        </h5>
        <MDBInput
          label="Due Date"
          type="date"
          value={form.due || ""}
          onChange={({ target }) => setForm({ ...form, due: target.value })}
        />
        <MDBBtn color="primary" onClick={handleSave}>
          Save
        </MDBBtn>
      </MDBModalBody>
    </MDBModal>
  );
}
