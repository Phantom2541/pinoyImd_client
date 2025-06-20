import { useCallback, useEffect, useState } from "react";
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
  SAVE,
  SetCATEGORY,
} from "../../../../../../../services/redux/slices/assets/providers";
import { Select } from "../../../../../../../components/customizable";
import Search from "../../../../../../../components/searchables/ao";
import { Memberships } from "../../../../../../../services/fakeDb";
import Checkbox from "./checkbox";

// declare your expected items
const _form = {
  name: "",
  category: "insource",
  ao: "",
  membership: "",
  cutoff: 10,
  credit: 0,
  voucher_approval_status: false,
  invoice: false,
};

export default function Modal() {
  const {
      showModal,
      selected,
      category: defaultCategory,
      formSubmitted,
      isSuccess,
    } = useSelector(({ providers }) => providers),
    { token, activePlatform } = useSelector(({ auth }) => auth),
    [category, setCategory] = useState(""),
    [form, setForm] = useState(_form),
    { addToast } = useToasts(),
    dispatch = useDispatch();

  const toggle = useCallback(() => dispatch(TOGGLE()), [dispatch]);

  useEffect(() => {
    if (showModal && !formSubmitted && isSuccess) {
      addToast("New provider added successfully.", {
        appearance: "success",
      });
      dispatch(RESET());
      toggle();
    }
  }, [showModal, formSubmitted, isSuccess, dispatch, toggle, addToast]);

  useEffect(() => {
    if (showModal) {
      setForm(_form);
      setCategory(defaultCategory);
    }
  }, [showModal, defaultCategory]);

  const handleSubmit = (e) => {
    e.preventDefault();
    const { ao = "" } = form;
    if (!ao) {
      delete form.ao;
    }

    dispatch(
      SAVE({
        token,
        data: {
          ...form,
          clients: selected._id,
          status: "approved",
          category: "mbs",
          vendors: activePlatform.branchId,
        },
      })
    );
    dispatch(ToggleDidSearch(false));
    dispatch(SetCATEGORY(category));
  };
  const categoryHasChecked = (category) => form.category.includes(category);

  const handleChecked = (newCategory) =>
    setForm((prev) => ({
      ...prev,
      category: newCategory,
    }));

  // use for direct values like strings and numbers
  const { name = "", displayname = "" } = selected || {};
  return (
    <MDBModal isOpen={showModal} toggle={toggle} size="md" backdrop>
      <MDBModalHeader
        toggle={toggle}
        className="light-blue darken-3 white-text"
      >
        <h5>
          <MDBIcon className="mr-2" icon="tag" />
          Tag {`${name} ${displayname}`}
        </h5>
        <h5
          style={{
            fontWeight: 300,
            fontSize: "1rem",
            marginLeft: "35px",
          }}
        >
          As your new provider
        </h5>
      </MDBModalHeader>
      <form onSubmit={handleSubmit}>
        <MDBModalBody className="mb-0">
          <Search
            setUser={(user) => setForm({ ...form, ao: user._id })}
            label="Administrative Officer"
          />
          <MDBRow>
            <MDBCol>
              <Select
                collections={Memberships.collections}
                label={"Membership"}
                onChange={(value) => setForm({ ...form, membership: value })}
                values={"text"}
                keys={"value"}
                preValue={form.membership}
              />
            </MDBCol>
          </MDBRow>
          <MDBRow>
            <MDBCol>
              <Select
                label={"Monthly Cut off"}
                collections={new Array(30).fill("").map((_, i) => i + 1)}
                onChange={(value) =>
                  setForm({
                    ...form,
                    cutoff: Number(value) <= 0 ? 1 : Number(value),
                  })
                }
                preValue={form.cutoff}
              />
            </MDBCol>
            <MDBCol>
              <Select
                label={"Monthly Due Date"}
                collections={new Array(30).fill("").map((_, i) => i + 1)}
                onChange={(value) => setForm({ ...form, due: Number(value) })}
                preValue={form.due}
              />
            </MDBCol>
          </MDBRow>
          <MDBRow>
            <MDBCol>
              <MDBInput
                type="number"
                label="Credit Limit"
                value={String(form.credit)}
                onChange={(e) => setForm({ ...form, credit: e.target.value })}
              />
            </MDBCol>
          </MDBRow>
          <span className="mb-2" style={{ fontWeight: 300 }}>
            Categories:
          </span>
          <div
            className="d-flex align-items-center mt-2"
            style={{ gap: "2.8rem" }}
          >
            <Checkbox
              setChecked={handleChecked}
              isChecked={categoryHasChecked}
              value="partner"
            />

            <Checkbox
              setChecked={handleChecked}
              isChecked={categoryHasChecked}
              value="utilites"
            />
            <Checkbox
              setChecked={handleChecked}
              isChecked={categoryHasChecked}
              value="supplier"
            />
          </div>
          {!categoryHasChecked("partner") && (
            <div
              className="d-flex align-items-center mt-2"
              style={{ gap: "2.2rem" }}
            >
              <Checkbox
                setChecked={handleChecked}
                isChecked={categoryHasChecked}
                value="insource"
              />
              <Checkbox
                setChecked={handleChecked}
                isChecked={categoryHasChecked}
                value="outsource"
              />
            </div>
          )}
          <hr />
          <MDBRow className="mt-3">
            <MDBCol>
              <div className="d-flex align-items-center justify-content-between">
                <span className="mr-2" style={{ fontWeight: 300 }}>
                  Will you provide a SOA?
                </span>
                <div style={{ marginRight: "64px" }}>
                  <input
                    className="form-check-input"
                    checked={!form.voucher_approval_status}
                    type="checkbox"
                    onClick={() =>
                      setForm({
                        ...form,
                        voucher_approval_status: !form.voucher_approval_status,
                      })
                    }
                    id={"SOA-no"}
                  />
                  <label htmlFor={"SOA-no"} className="form-check-label mr-2">
                    No
                  </label>
                  <input
                    onClick={() =>
                      setForm({
                        ...form,
                        voucher_approval_status: !form.voucher_approval_status,
                      })
                    }
                    className="form-check-input"
                    type="checkbox"
                    checked={form.voucher_approval_status}
                    id={"SOA-yes"}
                  />
                  <label htmlFor={"SOA-yes"} className="form-check-label ">
                    Yes
                  </label>
                </div>
              </div>
            </MDBCol>
          </MDBRow>
          <MDBRow className="mt-2">
            <MDBCol>
              <div className="d-flex align-items-center">
                <span className="mr-2" style={{ fontWeight: 300 }}>
                  Will you provide invoice after payment?
                </span>
                <input
                  className="form-check-input"
                  type="checkbox"
                  onClick={() =>
                    setForm({
                      ...form,
                      invoice: !form.invoice,
                    })
                  }
                  checked={!form.invoice}
                  id={"invoice-no"}
                />
                <label
                  htmlFor={"invoice-no"}
                  className="form-check-label mr-2 "
                >
                  No
                </label>
                <input
                  className="form-check-input"
                  type="checkbox"
                  onClick={() =>
                    setForm({
                      ...form,
                      invoice: !form.invoice,
                    })
                  }
                  checked={form.invoice}
                  id={"invoice-yes"}
                />
                <label htmlFor={"invoice-yes"} className="form-check-label ">
                  Yes
                </label>
              </div>
            </MDBCol>
          </MDBRow>
          <div className="d-flex justify-content-end mt-4">
            <MDBBtn
              type="submit"
              disabled={formSubmitted}
              color="info"
              className="mb-2"
              rounded
            >
              Submit {formSubmitted && <MDBIcon icon="spinner" pulse />}
            </MDBBtn>
          </div>
        </MDBModalBody>
      </form>
    </MDBModal>
  );
}
