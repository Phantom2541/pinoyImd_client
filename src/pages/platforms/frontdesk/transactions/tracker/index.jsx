import React, { useEffect, useState } from "react";
import Header from "./header";
import Body from "./body";
import {
  PATIENTS,
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
    { token, onDuty } = useSelector(({ auth }) => auth),
    { collections: users } = useSelector(({ users }) => users),
    { search } = useLocation(),
    history = useHistory(),
    query = new URLSearchParams(search),
    queryPatient = query.get("patient"),
    dispatch = useDispatch();

  useEffect(() => {
    if (patient?._id && onDuty?._id) {
      dispatch(
        TRACKER({
          token,
          key: {
            branchId: onDuty._id,
            customerId: patient._id,
          },
        })
      );
    }
  }, [patient, onDuty, dispatch, token]);
  useEffect(() => {
    if (token && onDuty._id) {
      dispatch(BROWSE({ token, branchId: onDuty._id }));
      dispatch(HEADS({ token, branchId: onDuty._id }));
    }

    return () => {
      dispatch(PREFRESET());
      dispatch(HEADSRESET());
    };
  }, [token, dispatch, onDuty]);

  // used for external patient query
  useEffect(() => {
    if (queryPatient && !!users.length)
      setPatient(users.find(({ _id }) => _id === queryPatient));
  }, [queryPatient, users]);

  useEffect(() => {
    if (token && onDuty._id) {
      dispatch(PATIENTS({ token }));
    }

    return () => {
      dispatch(RESET());
    };
  }, [token, dispatch, onDuty]);

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
