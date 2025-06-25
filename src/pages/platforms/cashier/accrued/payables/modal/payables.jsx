import { useCallback, useEffect, useState } from "react";
import { useDispatch, useSelector } from "react-redux";
import {
  SAVE,
  TOGGLE,
  UPDATE,
  RESET,
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
import { SelectUser } from "../../../../../../components/searchables";
import util from "../util";
import Swal from "sweetalert2";

export default function ModalCreate() {
  const dispatch = useDispatch();
  const {
      showPayablesModal,
      selected,
      formSubmitted,
      isSuccess,
      willCreate = false,
    } = useSelector(({ payables }) => payables),
    { collections } = useSelector(({ providers }) => providers),
    { token, activePlatform } = useSelector(({ auth }) => auth),
    [form, setForm] = useState(selected || { patient: null });

  useEffect(() => {
    setForm(selected);
  }, [showPayablesModal, selected]);

  const handleClose = useCallback(() => {
    dispatch(TOGGLE(false));
  }, [dispatch]);

  useEffect(() => {
    if (!formSubmitted && isSuccess) {
      handleClose();
      dispatch(RESET());
    }
  }, [formSubmitted, isSuccess, dispatch, handleClose]);

  const handleSave = () => {
    if (willCreate && !form.fsId) {
      return Swal.fire({
        title: "Payee Required",
        text: "You need to select a payee before proceeding.",
        icon: "warning",
        confirmButtonColor: "#3085d6",
        cancelButtonColor: "#d33",
        confirmButtonText: "OK",
      });
    }
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
  };

  const { particular = {}, supplier = {} } = form || {};

  const handleSuppliers = () => {
    return [...collections].map((supplier) => {
      const { vendors = null, displayname } = supplier;

      return {
        value: supplier._id,
        label: vendors ? vendors.name : displayname,
      };
    });
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
          className="m-0 p-0"
          preValue={form.fsId}
          keys={"id"}
          values={"title"}
          onChange={(value) => setForm({ ...form, fsId: Number(value) })}
        />
        {willCreate && (
          <div className="d-flex align-item-center w-100">
            <div style={{ width: form.orOption ? "35%" : "100%" }}>
              <select
                className="browser-default custom-select"
                value={form.orOption || ""}
                onChange={(e) => {
                  setForm({ ...form, orOption: e.target.value });
                }}
              >
                <option value="" disabled>
                  Select a payee
                </option>
                <option value="Particular">Particular</option>
                <option value="Supplier">Supplier</option>
              </select>
            </div>
            {form.orOption && (
              <div style={{ marginBottom: "-1rem" }} className="w-100">
                {form.orOption === "Particular" ? (
                  <div
                    className="w-100 ml-3"
                    style={{
                      marginTop: !form.particular ? "-1.4rem" : "0.8rem",
                    }}
                  >
                    <SelectUser
                      setUser={(user) =>
                        setForm({ ...form, particular: user?._id })
                      }
                      label="Search Particular"
                      displayWithLabel={false}
                      // setPatient={(user) => console.log("user", user)}
                    />
                  </div>
                ) : form.orOption === "Supplier" ? (
                  <Select
                    collections={handleSuppliers()}
                    label="Supplier"
                    className="m-0 p-0 ml-3"
                    keys="value"
                    values="label"
                    onChange={(e) => setForm({ ...form, supplier: e })}
                  />
                ) : null}{" "}
              </div>
            )}
          </div>
        )}

        <MDBInput
          label="Amount"
          style={{ marginTop: "-0.5rem" }}
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
        <MDBInput
          label="Remarks"
          type="string"
          value={form?.remarks}
          onChange={({ target }) => setForm({ ...form, remarks: target.value })}
        />
        <MDBBtn
          color="primary"
          className="float-right"
          onClick={handleSave}
          disabled={formSubmitted}
        >
          {willCreate ? "Save" : "Update"}
          {formSubmitted && <MDBIcon icon="spinner" pulse className="ml-2" />}
        </MDBBtn>
      </MDBModalBody>
    </MDBModal>
  );
}
