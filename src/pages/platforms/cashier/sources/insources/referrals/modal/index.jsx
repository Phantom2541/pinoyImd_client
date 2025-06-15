import React, { useCallback, useEffect, useState } from "react";
import { useDispatch, useSelector } from "react-redux";
import {
  MDBBtn,
  MDBModal,
  MDBModalBody,
  MDBIcon,
  MDBModalHeader,
  MDBInput,
  MDBRow,
  MDBCol,
} from "mdbreact";
import { useToasts } from "react-toast-notifications";

import {
  TOGGLE,
  ToggleDidSearch,
  RESET,
  UPDATE,
  SetCATEGORY,
} from "../../../../../../../services/redux/slices/assets/providers";
import { Select } from "../../../../../../../components/customizable";
import Swal from "sweetalert2";

// declare your expected items
const _form = {
  contract: "",
  credit: 0,
};

export default function Modal() {
  const {
      showModal,
      selected,
      contractCategories: categories,
      category: defaultCategory,
      formSubmitted,
      isSuccess,
    } = useSelector(({ providers }) => providers),
    { token } = useSelector(({ auth }) => auth),
    [category, setCategory] = useState(""),
    [form, setForm] = useState(_form),
    [isDenied, setIsDenied] = useState(false),
    { addToast } = useToasts(),
    dispatch = useDispatch();

  const toggle = useCallback(() => dispatch(TOGGLE()), [dispatch]);

  useEffect(() => {
    if (showModal && !formSubmitted && isSuccess) {
      addToast(`${isDenied ? "Denied" : "Approved"} successfully.`, {
        appearance: "success",
      });
      setIsDenied(false);
      dispatch(RESET());
      toggle();
    }
  }, [
    showModal,
    formSubmitted,
    isSuccess,
    dispatch,
    toggle,
    addToast,
    isDenied,
  ]);

  useEffect(() => {
    if (showModal) {
      setForm(_form);
      setCategory(defaultCategory);
    }
  }, [showModal, defaultCategory]);

  const handleSubmit = (e) => {
    e.preventDefault();
    if (!category)
      return Swal.fire({
        icon: "warning",
        title: "Category is required!",
        text: "Please select a category before proceeding.",
        confirmButtonText: "OK",
        confirmButtonColor: "#d33",
      });

    dispatch(
      UPDATE({
        token,
        data: {
          ...form,
          _id: selected.providerId,
          status: "approved",
          contract: category,
        },
      })
    );
    dispatch(ToggleDidSearch(false));
    dispatch(SetCATEGORY(category));
  };

  const handleDeny = () => {
    dispatch(
      UPDATE({
        token,
        data: {
          ...form,
          _id: selected.providerId,
          status: "denied",
        },
      })
    );
    dispatch(ToggleDidSearch(false));
    dispatch(SetCATEGORY("denied"));
    setIsDenied(true);
  };

  // use for direct values like strings and numbers
  const { name = "", companyId } = selected || {};
  return (
    <MDBModal isOpen={showModal} toggle={toggle} size="md" backdrop>
      <MDBModalHeader
        toggle={toggle}
        className="light-blue darken-3 white-text"
      >
        <h5>
          <MDBIcon className="mr-2" icon="tag" />
          Accept {`${companyId?.name} - ${name}`}
        </h5>
      </MDBModalHeader>
      <form onSubmit={handleSubmit}>
        <MDBModalBody className="mb-0">
          <MDBRow>
            <MDBCol>
              <Select
                label="Contract"
                preValue={category}
                onChange={(e) => setCategory(e)}
                keys={"value"}
                values={"text"}
                collections={categories}
              />
            </MDBCol>
          </MDBRow>
          <MDBRow>
            <MDBCol>
              <Select
                label={"Monthly Cut off"}
                collections={new Array(30).fill("").map((_, i) => i + 1)}
                onChange={(value) =>
                  setForm({ ...form, cutoff: Number(value) })
                }
                preValue={form.cutoff}
              />
            </MDBCol>
            <MDBCol>
              <MDBInput
                type="number"
                label="Credit Limit"
                value={String(form.credit)}
                onChange={(e) => setForm({ ...form, credit: e.target.value })}
              />
            </MDBCol>
          </MDBRow>

          <div className="d-flex justify-content-end ">
            <MDBBtn
              type="button"
              onClick={handleDeny}
              disabled={formSubmitted}
              color="danger"
              className="mb-2"
              rounded
            >
              Deny
              {formSubmitted && isDenied && <MDBIcon icon="spinner" pulse />}
            </MDBBtn>
            <MDBBtn
              type="submit"
              disabled={formSubmitted}
              color="success"
              className="mb-2"
              rounded
            >
              Approve
              {formSubmitted && !isDenied && <MDBIcon icon="spinner" pulse />}
            </MDBBtn>
          </div>
        </MDBModalBody>
      </form>
    </MDBModal>
  );
}
