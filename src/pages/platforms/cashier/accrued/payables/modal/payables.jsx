import React, { useEffect, useState } from "react";
import { useDispatch, useSelector } from "react-redux";
import {
  SAVE,
  TOGGLE,
  UPDATE,
} from "../../../../../../services/redux/slices/finance/journals/payables";
import {
  MDBModal,
  MDBModalHeader,
  MDBModalBody,
  MDBInput,
  MDBRow,
  MDBCol,
  MDBBtn,
  MDBIcon,
} from "mdbreact";
import { Statements } from "../../../../../../services/fakeDb";
import { Select } from "../../../../../../components/customizable";
import { SearchUser } from "../../../../../../components/searchables";
import util from "../util";

export default function ModalCreate() {
  const dispatch = useDispatch();
  const {
    showPayablesModal,
    selected,
    willCreate = false,
  } = useSelector(({ payables }) => payables);
  const { collections } = useSelector(({ providers }) => providers);
  const { token, activePlatform } = useSelector(({ auth }) => auth);

  const [form, setForm] = useState(selected || { range: ["", ""] }, {
    patient: null,
  });

  useEffect(() => {
    setForm(selected || { range: ["", ""] });
  }, [showPayablesModal, selected]);

  const handleClose = () => {
    dispatch(TOGGLE(false));
  };

  const handleSave = () => {
    const formData = {
      ...form,
      branchId: activePlatform.branchId,
      range: form.range || ["", ""],
    };

    const { supplier, particular } = formData || {};

    if (willCreate) {
      dispatch(SAVE({ data: formData, token }));
    } else {
      dispatch(
        UPDATE({
          data: {
            ...formData,
            supplier: supplier?._id,
            particular: particular?._id,
          },
          token,
        })
      );
    }
    handleClose();
  };

  const { particular = {}, supplier = {} } = form || {};

  console.log("form", form);

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
        {willCreate ? (
          "Payables"
        ) : (
          <>
            <MDBIcon icon="pencil-alt" className="mr-2" />
            {util.getVendorOrParticular(particular, supplier)}
          </>
        )}
      </MDBModalHeader>
      <MDBModalBody className="mb-0">
        <Select
          collections={
            Array.isArray(Statements?.collections)
              ? Statements.collections.filter(
                  (statement) => statement?.category === "expenses"
                )
              : []
          }
          label={"Financial Statement"}
          preValue={form.fsId}
          keys={"id"}
          values={"title"}
          onChange={(value) => setForm({ ...form, fsId: Number(value) })}
        />
        {willCreate && (
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
        )}
        {/* Conditionally render the correct input based on selection */}
        {form.orOption === "Particular" ? (
          <>
            <br />
            <SearchUser
              setPatient={(user) => setForm({ ...form, patient: user })}
            />
          </>
        ) : form.orOption === "Supplier" ? (
          <Select
            collections={
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
            keys="value"
            values="label"
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
        {willCreate && form.fsId === 31 && (
          <>
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
          </>
        )}
        <MDBInput
          label="Due Date"
          type="date"
          value={form.due ? new Date(form.due).toISOString().split("T")[0] : ""}
          onChange={({ target }) => setForm({ ...form, due: target.value })}
        />
        <MDBBtn color="primary" className="float-right" onClick={handleSave}>
          {willCreate ? "Save" : "Update"}
        </MDBBtn>
      </MDBModalBody>
    </MDBModal>
  );
}
