import { useEffect, useState } from "react";
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
  MDBTabPane,
  MDBTabContent,
} from "mdbreact";
import { isEqual } from "lodash";
import { useToasts } from "react-toast-notifications";
import {
  UPDATE,
  SAVE,
} from "../../../../../services/redux/slices/commerce/catalog/menus";
import {
  InPatient,
  Contracts,
  Memberships,
  Expenses,
  Others,
  HMO,
} from "./component";
import { currency } from "../../../../../services/utilities";

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
  hmo: [],
  sc: 0,
  ssc: 0,
  vp: 0,
  hasDiscount: false,
  isProfile: false,
  onPromo: false,
  hasReseco: false,
};

const COMPONENTS = {
  InPatient,
  HMO,
  Contracts,
  Memberships,
  Expenses,
  Others,
};
export default function Modal({ show, toggle, selected, willCreate }) {
  const { token, activePlatform } = useSelector(({ auth }) => auth),
    { formSubmitted = false, isSuccess } = useSelector(({ menus }) => menus),
    [form, setForm] = useState(_form),
    [categories, setCategories] = useState([]),
    [activeTab, setActiveTab] = useState(0),
    { addToast } = useToasts(),
    dispatch = useDispatch();

  useEffect(() => {
    if (show) {
      //access the activePlatform in localstorage instead to auth, to get the updated patient categories
      const fakeDB = localStorage.getItem("activePlatform");
      if (fakeDB) {
        setCategories(JSON.parse(fakeDB)?.branch?.companyId?.pc);
      }
    }
  }, [show]);

  const _tabs = [
    "InPatient",
    categories?.includes(6) && "HMO",
    categories?.includes(7) && "Memberships",
    categories?.includes(8) && "Contracts",
    "Expenses",
    "Others",
  ];

  const tabs = _tabs.filter((tab) => tab);
  const components = tabs.map((tab) => COMPONENTS[tab]);
  useEffect(() => {
    const { hmo = [] } = selected || {};
    if (selected?._id)
      setForm({ ...selected, hmo: Array.isArray(hmo) ? hmo : [] });
  }, [selected]);

  useEffect(() => {
    if (!formSubmitted && isSuccess && show) {
      toggle();
      setForm(_form);
    }
  }, [formSubmitted, isSuccess, toggle, show]);

  const handleUpdate = () => {
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
  };

  const handleCreate = () => {
    dispatch(
      SAVE({
        data: {
          ...form,
          branchId: activePlatform?.branchId,
        },
        token,
      })
    );
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
  const handleValue = (key) => form[key];

  const handleChange = (key, value) => setForm({ ...form, [key]: value });
  return (
    <MDBModal
      size="xl"
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
      <MDBModalBody className="mb-0 ">
        <form onSubmit={handleSubmit}>
          <MDBRow>
            <MDBCol md="8">
              <MDBInput
                type="text"
                label="Menu Description"
                value={handleValue("description") || ""}
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
          <h5 className="mb-2 text-center">
            <span className="grey-text">SRP:</span>
            <span className="ml-2">{currency.format(Number(form?.opd))}</span>
          </h5>
          <MDBNav classicTabs color="info" tabs className="nav-justified">
            {tabs.map((title, index) => (
              <MDBNavItem key={`tab-${index}`}>
                <MDBNavLink
                  link
                  active={index === activeTab}
                  to="#!"
                  onClick={() => setActiveTab(index)}
                >
                  {title === "Expenses" ? "Operating Cost" : title}
                </MDBNavLink>
              </MDBNavItem>
            ))}
          </MDBNav>

          <MDBTabContent activeItem={activeTab} className="card mb-4">
            {components.map((Component, index) => {
              return (
                <MDBTabPane key={`component-${index}`} tabId={index}>
                  <Component
                    form={form}
                    setForm={setForm}
                    handleValue={handleValue}
                    handleChange={handleChange}
                  />
                </MDBTabPane>
              );
            })}
          </MDBTabContent>

          <div className="text-center mb-1-half">
            <MDBBtn
              type="submit"
              disabled={formSubmitted}
              color="info"
              className="mb-2"
              rounded
            >
              {willCreate ? "submit" : "update"}{" "}
              {formSubmitted && (
                <MDBIcon icon="spinner" pulse className="ml-2" />
              )}
            </MDBBtn>
          </div>
        </form>
      </MDBModalBody>
    </MDBModal>
  );
}
