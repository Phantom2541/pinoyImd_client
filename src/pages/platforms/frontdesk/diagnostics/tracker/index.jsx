import React, { useEffect, useState } from "react";
import Header from "./header";
import Body from "./body";
import {
  GETPATIENTS,
  RESET,
} from "./../../../../../services/redux/slices/assets/persons/users";
import { TRACKER } from "../../../../../services/redux/slices/commerce/sales";
import { useDispatch, useSelector } from "react-redux";
import { fullNameSearch } from "../../../../../services/utilities";
import { useLocation, useHistory } from "react-router-dom";
import { MDBContainer } from "mdbreact";
import {
  BROWSE,
  RESET as PREFRESET,
} from "../../../../../services/redux/slices/results/preferences";
import {
  BROWSE as HEADS,
  RESET as HEADSRESET,
} from "../../../../../services/redux/slices/assets/persons/heads";

export default function Tasks() {
  const [patient, setPatient] = useState({}),
    [patients, setPatients] = useState([]), // this is the matched patients
    [didSearch, setDidSearch] = useState(false),
    [searchKey, setSearchKey] = useState(""),
    { token, activePlatform } = useSelector(({ auth }) => auth),
    { collections: users } = useSelector(({ users }) => users),
    { search } = useLocation(),
    history = useHistory(),
    query = new URLSearchParams(search),
    queryPatient = query.get("patient"),
    dispatch = useDispatch();

  useEffect(() => {
    if (patient?._id && activePlatform?._id) {
      dispatch(
        TRACKER({
          token,
          key: {
            branchId: activePlatform?.branchId,
            customerId: patient._id,
          },
        })
      );
    }
  }, [patient, activePlatform, dispatch, token]);
  useEffect(() => {
    if (token && activePlatform?.branchId) {
      dispatch(BROWSE({ token, branchId: activePlatform?.branchId }));
      dispatch(HEADS({ token, branchId: activePlatform?.branchId }));
    }

    return () => {
      dispatch(PREFRESET());
      dispatch(HEADSRESET());
    };
  }, [token, dispatch, activePlatform]);

  // used for external patient query
  useEffect(() => {
    if (queryPatient && !!users.length)
      setPatient(users.find(({ _id }) => _id === queryPatient));
  }, [queryPatient, users]);

  useEffect(() => {
    // if (token && activePlatform?.branchId) {
    //   dispatch(PATIENTS({ token }));
    if (token && activePlatform._id) {
      dispatch(GETPATIENTS({ token }));
    }

    return () => {
      dispatch(RESET());
    };
  }, [token, dispatch, activePlatform]);

  useEffect(() => {
    setPatients(searchKey && didSearch ? fullNameSearch(searchKey, users) : []);
  }, [users, searchKey, didSearch]);

  const handleSearch = (e) => {
    e.preventDefault();

    // reset query on search
    if (!didSearch && queryPatient) history.push("/transactions/tracker");

    if (didSearch && searchKey) setSearchKey("");

    setDidSearch(!didSearch);
  };

  const selectPatient = (user) => {
    setDidSearch(false);
    setSearchKey("");
    setPatient(user);
  };

  return (
    <MDBContainer fluid>
      <Header
        handleSearch={handleSearch}
        didSearch={didSearch}
        searchKey={searchKey}
        setSearchKey={setSearchKey}
        patients={patients}
        selectPatient={selectPatient}
        patient={patient}
      />
      <Body patient={patient} />
    </MDBContainer>
  );
}
