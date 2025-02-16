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
  MDBNav,
  MDBNavItem,
  MDBNavLink,
  MDBTabContent,
} from "mdbreact";
import { isEqual } from "lodash";
import { useToasts } from "react-toast-notifications";
import {
  UPDATE,
  SAVE,
} from "../../../../../services/redux/slices/commerce/menus";
import { Contracts, SRP, Others } from "./component";

// declare your expected items
const _form = {
    description: "",
    abbreviation: "",
    capital: 0,
    expenses: 0,
    refund: 0,
    opd: 0,
    cw: 0,
    er: 0,
    promo: 0,
    pw: 0,
    hmo: 0,
    sc: 0,
    ssc: 0,
    vp: 0,
    hasDiscount: true,
    isProfile: false,
    onPromo: false,
    hasReseco: false,
  },
  tabs = ["Suggested Retail Price", "Insourcing", "Others"];
export default function Modal({ show, toggle, selected, willCreate }) {
  const { isLoading } = useSelector(({ personnels }) => personnels),
    { token, onDuty } = useSelector(({ auth }) => auth),
    [form, setForm] = useState(_form),
    [activeTab, setActiveTab] = useState("menu-0"),
    { addToast } = useToasts(),
    dispatch = useDispatch();

  useEffect(() => {
    if (selected._id) setForm(selected);
  }, [selected]);

  const handleUpdate = () => {
    toggle();

    // check if object has changed
    if (isEqual(form, selected))
      return addToast("No changes found, skipping update.", {
        appearance: "info",
      });

    dispatch(
      UPDATE({
        data: { ...form, _id: selected._id },
        token,
      })
    );

    setForm(_form);
  };

  const handleCreate = () => {
    dispatch(
      SAVE({
        data: {
          ...form,
          branchId: onDuty._id,
        },
        token,
      })
    );

    setForm(_form);
    toggle();
  };

  const handleSubmit = (e) => {
    e.preventDefault();

    if (willCreate) {
      handleCreate();
    } else {
      handleUpdate();
    }
  };

  // use for direct values like strings and numbers
  const handleValue = (key) =>
    willCreate ? form[key] : form[key] || selected[key];

  const handleChange = (key, value) => setForm({ ...form, [key]: value });

  return (
    <MDBModal
      size="lg"
      isOpen={show}
      toggle={toggle}
      backdrop
      disableFocusTrap={false}
    >
      <MDBModalHeader
        toggle={toggle}
        className="light-blue darken-3 white-text"
      >
        <MDBIcon icon="book-open" className="mr-2" />
        {willCreate ? "Create" : "Update"} {selected?.description || "a Menu"}
      </MDBModalHeader>
      <MDBModalBody className="mb-0">
        <form onSubmit={handleSubmit}>
          <h5 className="mb-0">Information</h5>
          <MDBRow>
            <MDBCol md="8">
              <MDBInput
                type="text"
                label="Description"
                value={handleValue("description")}
                onChange={(e) =>
                  handleChange("description", e.target.value.toUpperCase())
                }
                className="mb-0"
                required
              />
            </MDBCol>
            <MDBCol md="4">
              <MDBInput
                type="text"
                label="Abbreviation"
                value={handleValue("abbreviation")}
                onChange={(e) => handleChange("abbreviation", e.target.value)}
                className="mb-0"
                required
              />
            </MDBCol>
          </MDBRow>
          <MDBNav color="primary" tabs className="nav-justified">
            {tabs.map((title, index) => (
              <MDBNavItem key={`tab-${index}`}>
                <MDBNavLink
                  link
                  active={`menu-${index}` === activeTab}
                  to="#!"
                  onClick={() => setActiveTab(`menu-${index}`)}
                >
                  {title}
                </MDBNavLink>
              </MDBNavItem>
            ))}
          </MDBNav>

          <MDBTabContent activeItem={activeTab}>
            <SRP handleValue={handleValue} handleChange={handleChange} />
          </MDBTabContent>

          <MDBTabContent activeItem={activeTab}>
            <Contracts
              form={form}
              handleValue={handleValue}
              handleChange={handleChange}
            />
          </MDBTabContent>

          <MDBTabContent activeItem={activeTab}>
            <Others handleValue={handleValue} handleChange={handleChange} />
          </MDBTabContent>

          <div className="text-center mb-1-half">
            <MDBBtn
              type="submit"
              disabled={isLoading}
              color="info"
              className="mb-2"
              rounded
            >
              {willCreate ? "submit" : "update"}
            </MDBBtn>
          </div>
        </form>
      </MDBModalBody>
    </MDBModal>
  );
}
