import React, { useEffect, useState } from "react";
import { MDBCard, MDBContainer, MDBIcon } from "mdbreact";
import Header from "./header";
import Carousel from "./carousel";
import { useDispatch, useSelector } from "react-redux";
import {
  GETPATIENTS,
  RESET,
} from "../../../../../services/redux/slices/assets/persons/users";
import {
  BROWSE as SOURCELIST,
  RESET as SOURCERESET,
} from "../../../../../services/redux/slices/assets/providers";
import {
  TIEUPS as PHYSICIANS,
  RESET as PHYSICIANRESET,
} from "../../../../../services/redux/slices/assets/persons/physicians";
import CashRegister from "./pos";
import Patron from "./modal";
import "./index.css";
import { useToasts } from "react-toast-notifications";
import { fullNameSearch } from "../../../../../services/utilities";

export default function Cashier() {
  const { token, onDuty } = useSelector(({ auth }) => auth),
    { collections, message, isSuccess, newPatient } = useSelector(
      ({ users }) => users
    ),
    { transaction, isSuccess: saleSuccess } = useSelector(({ sales }) => sales),
    [patients, setPatients] = useState({}),
    [didSearch, setDidSearch] = useState(false),
    [showCashRegister, setShowCashRegister] = useState(false),
    [selected, setSelected] = useState({}),
    [willCreate, setWillCreate] = useState(true),
    [showModal, setShowModal] = useState(false),
    [searchKey, setSearchKey] = useState(""),
    dispatch = useDispatch(),
    { addToast } = useToasts();

  useEffect(() => {
    if (newPatient._id && isSuccess) {
      setSelected(newPatient);
      setTimeout(() => setShowCashRegister(true), 750);
    }
  }, [isSuccess, newPatient]);

  useEffect(() => {
    if (message) {
      addToast(message, {
        appearance: isSuccess ? "success" : "error",
      });
    }

    return () => dispatch(RESET());
  }, [isSuccess, message, addToast, dispatch]);

  useEffect(() => {
    if (transaction._id !== "default" && saleSuccess) {
      localStorage.setItem("claimStub", JSON.stringify(transaction));
      window.open(
        "/printout/claimstub",
        "Claim Stub",
        "top=100px,left=100px,width=550px,height=750px"
      );
    }
  }, [transaction, saleSuccess]);

  useEffect(() => {
    if (token && onDuty._id) {
      dispatch(GETPATIENTS({ token }));
      // dispatch(SOURCELIST({ key: { branch: onDuty._id }, token }));
      dispatch(SOURCELIST({ token, key: { clients: onDuty._id } }));
      dispatch(PHYSICIANS({ key: { branch: onDuty._id }, token }));
    }

    return () => {
      dispatch(RESET());
      dispatch(SOURCERESET());
      dispatch(PHYSICIANRESET());
    };
  }, [token, dispatch, onDuty]);

  useEffect(() => {
    if (!!collections.length) {
      // i get all initials first so I can sort it. if you directly filter the users per alphabet, you cannot sort the object.

      // commented to reduce lag, will think of new approach to lessen lag
      // const alphabets = collections
      //   ?.reduce((accumulator, user) => {
      //     const lname = user?.fullName?.lname[0].toUpperCase();

      //     if (!accumulator.includes(lname)) accumulator.push(lname);

      //     return accumulator;
      //   }, [])
      //   .sort();

      // get all initials
      const initials = [
        "Recent",
        "R",
        // ...alphabets
      ]; // sort from A-Z

      const patients = {},
        today = new Date().toDateString();

      for (const alpha of initials) {
        // filter collections for each alphabet
        patients[alpha] = collections.filter(({ fullName, createdAt }) => {
          if (alpha === "Recent")
            // return false;
            return new Date(createdAt).toDateString() === today;

          return fullName?.lname?.startsWith(alpha);
        });
      }

      setPatients(patients);
    }
  }, [collections]);

  const toggleModal = () => setShowModal(!showModal);
  const toggleCashRegister = () => setShowCashRegister(!showCashRegister);

  const handleUpdate = (selected) => {
    setSelected(selected);
    if (willCreate) {
      setWillCreate(false);
    }
    setShowModal(true);
  };

  const handleSearch = (e) => {
    e.preventDefault();

    if (didSearch && searchKey) setSearchKey("");

    setDidSearch(!didSearch);
  };

  const handlePatronHistory = (selected) => {
    console.log(selected);
  };

  const handleCashRegister = (selected) => {
    setSelected(selected);
    toggleCashRegister();
  };

  const handleCreate = () => {
    if (!willCreate) {
      setWillCreate(true);
    }
    setShowModal(true);
  };

  const searchMatches = () => (
    <Carousel
      label={searchKey}
      array={fullNameSearch(searchKey, collections)}
      handleCashRegister={handleCashRegister}
      handleUpdate={handleUpdate}
      handlePatronHistory={handlePatronHistory}
    />
  );

  const generateCarousel = () => {
    if (didSearch) return searchMatches();

    const data = Object.entries(patients);

    if (!data.length)
      return (
        <div className="text-center">
          <MDBIcon icon="spinner" pulse />
        </div>
      );

    return data
      ?.filter(([_, value]) => value.length) // remove empty values
      ?.map(([key, value]) => (
        <Carousel
          key={key}
          label={key}
          array={value}
          handleCashRegister={handleCashRegister}
          handleUpdate={handleUpdate}
          handlePatronHistory={handlePatronHistory}
        />
      ));
  };

  return (
    <MDBContainer fluid>
      <Header
        handleCreate={handleCreate}
        handleSearch={handleSearch}
        didSearch={didSearch}
        searchKey={searchKey}
        setSearchKey={setSearchKey}
      />
      <MDBCard className="p-3 mt-3 w-100">
        <div className="carousel-wrapper">{generateCarousel()}</div>
      </MDBCard>
      <CashRegister
        key={transaction._id}
        patient={selected}
        show={showCashRegister}
        toggle={toggleCashRegister}
      />
      <Patron
        searchKey={searchKey}
        key={message}
        selected={selected}
        willCreate={willCreate}
        show={showModal}
        toggle={toggleModal}
      />
    </MDBContainer>
  );
}
