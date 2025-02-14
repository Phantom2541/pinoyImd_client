import React, { useEffect, useState } from "react";
import {
  MDBView,
  MDBCardBody,
  MDBSpinner,
  MDBTabContent,
  MDBNavItem,
  MDBNavLink,
  MDBNav,
  MDBTabPane,
} from "mdbreact";
import { useDispatch, useSelector } from "react-redux";
import { RESET, UPDATE } from "../../services/redux/slices/assets/persons/auth";
import { useToasts } from "react-toast-notifications";
import { isEqual } from "lodash";
import Details from "./details";
import File201 from "./file201";

const tabs = ["Account Details", "File 201"],
  components = [Details, File201];

export default function Account() {
  const { auth, token, isSuccess, message, isLoading } = useSelector(
      ({ auth }) => auth
    ),
    [address, setAddress] = useState({
      region: "REGION III (CENTRAL LUZON)",
      province: "NUEVA ECIJA",
      city: "CABANATUAN CITY",
      barangay: "",
      street: "",
    }),
    [curraddress, setCurraddress] = useState({
      region: "REGION III (CENTRAL LUZON)",
      province: "NUEVA ECIJA",
      city: "CABANATUAN CITY",
      barangay: "",
      street: "",
    }),
    [form, setForm] = useState({
      fullName: {
        fname: "",
        mname: "",
        lname: "",
        suffix: "",
        postnominal: "",
        title: "",
      },
      email: "",
      dob: "",
      mobile: "",
      isMale: false,
    }),
    [activeTab, setActiveTab] = useState(0),
    dispatch = useDispatch(),
    { addToast } = useToasts();

  useEffect(() => {
    if (auth._id && message) {
      addToast(message, {
        appearance: isSuccess ? "success" : "error",
      });
      dispatch(RESET());
    }
  }, [auth, isSuccess, message, dispatch, addToast]);

  useEffect(() => {
    if (auth._id) {
      if (auth.address.region) setAddress(auth.address);
      setTimeout(
        () =>
          setForm({
            _id: auth._id,
            fullName: auth.fullName,
            email: auth.email,
            dob: auth.dob,
            isMale: auth.isMale,
            mobile: auth.mobile,
          }),
        1000
      );
    }
  }, [auth]);

  const handleChange = (key, value) => setForm({ ...form, [key]: value });

  const handleSubmit = (e) => {
    e.preventDefault();

    var data = {
      ...form,
      address,
      curraddress,
    };

    const _auth = {
      _id: auth._id,
      address: auth.address,
      fullName: auth.fullName,
      email: auth.email,
      dob: auth.dob,
      isMale: auth.isMale,
      mobile: auth.mobile,
    };

    if (isEqual(data, _auth))
      return addToast("No changes found, skipping update.", {
        appearance: "info",
      });

    if (data.email !== auth.email) data.verified = false;

    dispatch(
      UPDATE({
        data,
        token,
      })
    );
  };

  return (
    <>
      <MDBView cascade className="mdb-color lighten-3 card-header">
        <MDBNav color="primary" tabs className="nav-justified">
          {tabs.map((tab, index) => (
            <MDBNavItem key={`tab-${index}`}>
              <MDBNavLink
                link
                active={index === activeTab}
                to="#!"
                onClick={() => setActiveTab(index)}
              >
                {tab}
              </MDBNavLink>
            </MDBNavItem>
          ))}
        </MDBNav>
      </MDBView>

      <MDBCardBody>
        {form._id ? (
          <MDBTabContent activeItem={activeTab}>
            {components.map((Component, index) => {
              return (
                <MDBTabPane key={`component-${index}`} tabId={index}>
                  <Component
                    address={address}
                    setAddress={setAddress}
                    curraddress={curraddress}
                    setCurraddress={setCurraddress}
                    form={form}
                    handleChange={handleChange}
                    handleSubmit={handleSubmit}
                    isLoading={isLoading}
                  />
                </MDBTabPane>
              );
            })}
          </MDBTabContent>
        ) : (
          <div className="text-center">
            <MDBSpinner />
          </div>
        )}
      </MDBCardBody>
    </>
  );
}
