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
  MDBBadge,
} from "mdbreact";
import { currency, fullName } from "../../../../../../services/utilities";
import { Memberships, Services } from "../../../../../../services/fakeDb";
import { capitalize, isEmpty } from "lodash";
import { PROCESS_ONBOARDING } from "../../../../../../services/redux/slices/commerce/pos/services/deals";
import Swal from "sweetalert2";

export default function Modal({ show, selected, toggle }) {
  const { token, auth, activePlatform } = useSelector(({ auth }) => auth),
    { formSubmitted, isSuccess } = useSelector(({ deals }) => deals),
    dispatch = useDispatch();

  const [open, setOpen] = useState(false);
  const [selectedOption, setSelectedOption] = useState(null);

  const handleSelect = (item) => {
    setSelectedOption(item);
    setOpen(false);
  };

  const { customerId = {}, sendouts = {}, branchId = {} } = selected || {};
  const { foundMenus = [], membership = "" } = sendouts;

  const discountPercentage =
    Memberships.find(({ value }) => value === membership)?.discount || 0;

  const amount = selectedOption?.opd || 0;
  const discount = amount * discountPercentage;
  const net = amount - discount;

  const toPercent = (value) => `${value * 100}%`;

  useEffect(() => {
    if (show && !formSubmitted && isSuccess) {
      toggle();
    }
  }, [formSubmitted, isSuccess, show, toggle]);

  useEffect(() => {
    if (show) {
      setOpen(false);
      setSelectedOption({});
      if (foundMenus.length === 1) {
        setSelectedOption(foundMenus[0]);
      }
    }
  }, [show, foundMenus]);

  const handleSubmit = () => {
    if (isEmpty(selectedOption))
      return Swal.fire({
        icon: "warning",
        title: "Menu is required",
        text: "Please select a menu before proceeding.",
        confirmButtonColor: "#3085d6",
        confirmButtonText: "OK",
      });

    const updateDeal = {
      _id: selected?._id,
      acknowledge: {
        by: auth._id,
        at: new Date(),
      },
    };

    const dealMenu = {
      menuId: selectedOption?._id,
      up: amount, //?
      discount, //?
    };

    const deal = {
      source: branchId?._id,
      branchId: activePlatform.branchId,
      customerId: customerId._id,
      cash: 0,
      cashierId: auth._id,
      payment: "voucher",
      discount,
      amount,
    };
    dispatch(
      PROCESS_ONBOARDING({ data: { deal, dealMenu, updateDeal }, token })
    );
  };

  const applyDiscount = selectedOption?.discountable && discount;

  return (
    <MDBModal isOpen={show} toggle={toggle} backdrop size="md">
      <MDBModalHeader
        toggle={() => toggle()}
        className="light-blue darken-3 white-text"
      >
        <MDBIcon icon="user" className="mr-2" />
        {fullName(customerId.fullName)}
      </MDBModalHeader>
      <MDBModalBody className="mb-0">
        <MDBRow>
          <MDBCol>
            <div className="position-relative" style={{ width: "100%" }}>
              <div
                className="form-control"
                onClick={() => setOpen(!open)}
                style={{ cursor: "pointer" }}
              >
                {!isEmpty(selectedOption)
                  ? `${selectedOption?.abbreviation || ""} - ${
                      selectedOption?.description || ""
                    }`
                  : "Select a menu that offers the selected services"}
              </div>
              {open && (
                <ul
                  className="list-group position-absolute w-100"
                  style={{
                    zIndex: 999,
                    maxHeight: "500px",
                    overflowY: "auto",
                  }}
                >
                  {foundMenus
                    .filter(({ opd }) => opd > 0)
                    ?.map((menu, index) => (
                      <li
                        key={index}
                        className="list-group-item"
                        style={{ cursor: "pointer", lineHeight: "1.2rem" }}
                        onClick={() => handleSelect(menu)}
                      >
                        <strong>{menu?.abbreviation}</strong>
                        <br />
                        <small className="text-muted">
                          {menu?.description}
                        </small>
                      </li>
                    ))}
                </ul>
              )}
            </div>
          </MDBCol>
        </MDBRow>
        <MDBRow className="mt-3">
          <MDBCol>
            <span className="font-weight-bold">Services:</span>
            <br />
            {sendouts?.servicesId?.map((id, key) => (
              <MDBBadge key={key} className="mr-1">
                {Services.getAbbr(id)}
              </MDBBadge>
            ))}
          </MDBCol>
        </MDBRow>

        {applyDiscount && (
          <h6 className="mt-3">
            Patient received a <b>{toPercent(discountPercentage)} discount</b>{" "}
            Applied under <b className="mr-1">{capitalize(membership)}</b>
            partnership with <b>{branchId.displayname}</b>.
          </h6>
        )}

        <div className="d-flex justify-content-between align-items-center">
          <div className="d-flex align-items-center mt-3">
            <h6 style={{ fontWeight: 400 }} className="mr-2">
              Amount:
            </h6>
            <h5>{currency(amount)}</h5>
          </div>
          {applyDiscount && (
            <>
              <div className="d-flex align-items-center mt-3">
                <h6 style={{ fontWeight: 400 }} className="mr-2">
                  Discount:
                </h6>
                <h5>{currency(discount)}</h5>
              </div>
              <div className="d-flex align-items-center mt-3">
                <h6 style={{ fontWeight: 400 }} className="mr-2">
                  Net:
                </h6>
                <h5>{currency(net)}</h5>
              </div>
            </>
          )}
        </div>

        <div className="text-center mt-2">
          <MDBBtn
            size="md"
            disabled={formSubmitted}
            rounded
            color="primary"
            onClick={handleSubmit}
          >
            Process
            {formSubmitted && <MDBIcon icon="spinner" pulse className="ml-2" />}
          </MDBBtn>
        </div>
      </MDBModalBody>
    </MDBModal>
  );
}
