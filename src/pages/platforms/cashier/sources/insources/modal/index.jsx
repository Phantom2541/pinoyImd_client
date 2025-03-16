import React, { useEffect, useState } from "react";
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

import {
  ToggleModal,
  ToggleDidSearch,
  SAVE,
} from "../../../../../../services/redux/slices/assets/providers";
import CustomSelect from "../../../../../../components/searchables/customSelect";
import Search from "../../../../../../components/searchables/ao";
import Swal from "sweetalert2";
import Checkbox from "./checkbox";

// declare your expected items
const _form = {
  name: "",
  category: ["insource"],
  ao: "",
  membership: "",
  credit: 0,
  voucher_approval_status: false,
  invoice: false,
};

const MembershipOptions = [
  { value: "hmo", text: "HMO " },
  { value: "silver", text: "Silver 5% discount" },
  { value: "gold", text: "Gold 10% discount" },
  { value: "platinum", text: "Platinum 15% discount" },
  { value: "diamond", text: "Diamond 20% discount" },
  { value: "crown", text: "Crown 25% discount" },
];
export default function Modal() {
  const {
      showCompanyModal = false,
      isLoading,
      selected,
    } = useSelector(({ providers }) => providers),
    { token, activePlatform } = useSelector(({ auth }) => auth),
    [form, setForm] = useState(_form),
    dispatch = useDispatch();

  const toggle = () => dispatch(ToggleModal());

  useEffect(() => {
    if (showCompanyModal) {
      setForm(_form);
    }
  }, [showCompanyModal]);

  const handleSubmit = (e) => {
    e.preventDefault();
    const { category = [], ao = "" } = form;
    if (!ao) {
      delete form.ao;
    }
    if (category.length === 0)
      return Swal.fire({
        title: "Warning!",
        text: "Categories are required.",
        icon: "warning",
        confirmButtonColor: "#3085d6",
        confirmButtonText: "OK",
      });

    dispatch(
      SAVE({
        token,
        data: {
          ...form,
          clients: selected._id,
          vendors: activePlatform.branchId,
        },
      })
    );
    dispatch(ToggleDidSearch(false));
    dispatch(ToggleModal());
  };
  const categoryHasChecked = (category) => form.category.includes(category);

  const handleChecked = (newCategory) => {
    const { category = [] } = form;
    const _category = [...category];
    const index = _category.findIndex((c) => c === newCategory);

    if (index > -1) {
      _category.splice(index, 1);
    } else {
      _category.push(newCategory);
    }
    const hasPartner = _category.some((c) => c === "partner");

    setForm((prev) => ({
      ...prev,
      category: hasPartner
        ? _category.filter((c) => c !== "insource" && c !== "outsource")
        : _category,
    }));
  };

  // use for direct values like strings and numbers
  const { name = "", companyName = "" } = selected || {};
  return (
    <MDBModal isOpen={showCompanyModal} toggle={toggle} size="md" backdrop>
      <MDBModalHeader
        toggle={toggle}
        className="light-blue darken-3 white-text"
      >
        <h5>
          <MDBIcon className="mr-2" icon="tag" />
          Tag {`${name} ${companyName}`}
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
              <CustomSelect
                choices={MembershipOptions}
                label={"Membership"}
                onChange={(value) => setForm({ ...form, membership: value })}
                texts={"text"}
                values={"value"}
                preValue={form.membership}
              />
            </MDBCol>
          </MDBRow>
          <MDBRow>
            <MDBCol>
              <CustomSelect
                label={"Monthly Cut off"}
                choices={new Array(30).fill("").map((_, i) => i + 1)}
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
              disabled={isLoading}
              color="info"
              className="mb-2"
              rounded
            >
              Submit
            </MDBBtn>
          </div>
        </MDBModalBody>
      </form>
    </MDBModal>
  );
}
